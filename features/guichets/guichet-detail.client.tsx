'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import {
  AlertTriangle,
  ArrowLeft,
  FileCheck2,
  Filter,
  FolderKanban,
  Landmark,
  Workflow as WorkflowIcon,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GenericTable } from '@/components/generic';
import { DataTableColumnHeader } from '@/components/data-table';
import { LoadingState } from '@/components/generic/loader';
import { EmptyState } from '@/components/generic/empty-state';
import { cn } from '@/lib/utils';
import { toNumber } from '@/lib/number';
import { formatDate } from '@/lib/date';
import { useAuth } from '@/features/auth/auth.context';
import { useFormatMontant } from '@/features/configurations/configurations.hooks';
import {
  useWorkflowEtapeRoles,
  useWorkflowEtapeSlas,
  useWorkflowRoles,
  useWorkflowVersions,
} from '@/features/workflows/workflow.hooks';
import type { WorkflowEtapeSla } from '@/features/workflows/workflow.dto';
import { humanDuration, slaOverdueMs } from '@/features/workflows/workflow-sla';
import { useWorkflowInstances } from '@/features/workflow-instances/workflow-instances.hooks';
import { canActOnCurrentStep } from '@/features/workflow-instances/workflow-authorization';
import type { WorkflowInstance } from '@/features/workflow-instances/workflow-instances.dto';
import { projectsService } from '@/features/projects/projects.service';
import type { Projet } from '@/features/projects/projects.dto';
import {
  PROJET_TYPE_LABELS,
  PROJET_TYPE_OPTIONS,
  projetStatutLabel,
  projetStatutStyle,
} from '@/features/projects/projects.constants';
import { ProjetStatutBadge } from '@/features/projects/projet-statut-badge';
import { useOrganismes } from '@/features/organismes/organismes.hooks';
import { useAgencesRegionales } from '@/features/referentials/referentials.hooks';
import { refLabel } from '@/features/referentials/referentials.types';
import { useGuichets } from './guichets.hooks';

const ALL = '__all__';

interface ProjetRow {
  id: number;
  code: string;
  intitule: string;
  promoteur: string;
  agence: string;
  partenaire: string;
  montant: number;
  statut: string | null;
  type_projet: string | null;
  etape: string;
  /** Order of the current étape (prefixed on "Étape courante"). */
  etapeOrder: number | null;
  /** Role code(s) responsible for the current étape (CIP, CAR, …) — shown in the
   *  Action cell when the connected user isn't the one to act. */
  responsable: string;
  /** When the dossier started (proxy for time-on-step). */
  depuis: string | null;
  /** >0 when past the current step's SLA; else null. */
  overdueMs: number | null;
  /** Authorization gate for the connected user on the current step. */
  gateState: 'allowed' | 'denied' | 'unavailable' | null;
  search: string;
}

/**
 * Guichet detail: a **campagne** (workflow version) drives the screen — pick one
 * and see the micro-projets routed through this guichet's circuit for that
 * campagne (via the workflow instances on that version). For each dossier we
 * fetch the full projet (promoteur, montant, statut, type), show a per-statut
 * summary, and expose filters (statut, étape, type, montant). Read-only.
 */
export function GuichetDetailClient({ guichetId }: { guichetId: number }) {
  const router = useRouter();
  const { user } = useAuth();
  const guichets = useGuichets();
  const versions = useWorkflowVersions();
  const instances = useWorkflowInstances();
  const etapeRoles = useWorkflowEtapeRoles();
  const workflowRoles = useWorkflowRoles();
  const etapeSlas = useWorkflowEtapeSlas();
  const organismes = useOrganismes();
  const agences = useAgencesRegionales();
  const formatMontant = useFormatMontant();

  const [campagne, setCampagne] = useState<string>('');
  const [onlyMine, setOnlyMine] = useState(false);
  const [statutFilter, setStatutFilter] = useState(ALL);
  const [etapeFilter, setEtapeFilter] = useState(ALL);
  const [typeFilter, setTypeFilter] = useState(ALL);
  const [montantMin, setMontantMin] = useState('');
  const [montantMax, setMontantMax] = useState('');

  const guichet = useMemo(
    () => (guichets.data ?? []).find((g) => g.id === guichetId),
    [guichets.data, guichetId],
  );

  // Campagnes = the versions of this guichet's workflow, most recent first.
  const campagnes = useMemo(() => {
    if (!guichet?.workflow_code) return [];
    return (versions.data ?? [])
      .filter((v) => v.workflow_code === guichet.workflow_code)
      .sort((a, b) => b.version.localeCompare(a.version));
  }, [versions.data, guichet?.workflow_code]);

  // Default the driver to the default campagne (or the most recent).
  const activeCampagne =
    campagne || campagnes.find((v) => v.is_default)?.code || campagnes[0]?.code || '';

  // Instances of this campagne → the dossiers + their current étape.
  const campagneInstances = useMemo(
    () =>
      (instances.data ?? []).filter(
        (i) => activeCampagne && i.workflow_version === activeCampagne,
      ),
    [instances.data, activeCampagne],
  );
  // micro_projet_id → its chosen instance (active EN_COURS wins over others).
  const instanceByProjet = useMemo(() => {
    const m = new Map<number, WorkflowInstance>();
    [...campagneInstances]
      .sort((a, b) => Number(a.statut === 'EN_COURS') - Number(b.statut === 'EN_COURS'))
      .forEach((i) => m.set(i.micro_projet_id, i));
    return m;
  }, [campagneInstances]);

  // etape_code → authorized role code(s) + display labels (§8.1 etape-roles).
  const rolesByEtape = useMemo(() => {
    const m = new Map<string, { codes: string[]; labels: string[] }>();
    (etapeRoles.data ?? []).forEach((r) => {
      const label = workflowRoles.data?.find((x) => x.code === r.role_code)?.name ?? r.role_code;
      const entry = m.get(r.etape_code) ?? { codes: [], labels: [] };
      entry.codes.push(r.role_code);
      entry.labels.push(label);
      m.set(r.etape_code, entry);
    });
    return m;
  }, [etapeRoles.data, workflowRoles.data]);

  // etape_code → SLA (for the overdue flag).
  const slaByEtape = useMemo(() => {
    const m = new Map<string, WorkflowEtapeSla>();
    (etapeSlas.data ?? []).forEach((s) => m.set(s.etape_code, s));
    return m;
  }, [etapeSlas.data]);

  // Full projet per dossier — the reliable source for promoteur + montant +
  // statut + type (the instance embed only carries a partial micro_projet).
  // Interim N+1 (bounded by campagne size); no batch projets-by-ids endpoint yet.
  const projetIds = useMemo(
    () => [...new Set(campagneInstances.map((i) => i.micro_projet_id))],
    [campagneInstances],
  );
  const projetQueries = useQueries({
    queries: projetIds.map((id) => ({
      queryKey: ['projets', 'detail', id],
      queryFn: () => projectsService.getById(id),
      staleTime: 5 * 60 * 1000,
    })),
  });
  const projetsLoading = projetQueries.some((q) => q.isLoading);
  const projetDataKey = projetQueries.map((q) => q.data?.id ?? 0).join(',');

  // FK → display name lookups for Agence / Partenaire (organisme financeur).
  const agenceById = useMemo(
    () => new Map((agences.data ?? []).map((a) => [a.id, refLabel(a)] as const)),
    [agences.data],
  );
  const organismeById = useMemo(
    () => new Map((organismes.data ?? []).map((o) => [o.id, o.nom || o.sigle] as const)),
    [organismes.data],
  );

  const allRows: ProjetRow[] = useMemo(() => {
    return projetQueries
      .map((q) => q.data)
      .filter((p): p is Projet => !!p)
      .map((p) => {
        const promoteur = p.promoteur
          ? `${p.promoteur.prenom} ${p.promoteur.nom}`.trim()
          : `Promoteur #${p.promoteur_id}`;
        const agence = (p.agence_id != null && agenceById.get(p.agence_id)) || '';
        const partenaire = (p.organisme_id != null && organismeById.get(p.organisme_id)) || '';

        const inst = instanceByProjet.get(p.id);
        const etapeCode = inst?.current_etape_code ?? null;
        const active = inst?.statut === 'EN_COURS';
        const roleInfo = etapeCode ? rolesByEtape.get(etapeCode) : undefined;
        const responsable = active ? (roleInfo?.codes.join(', ') ?? '') : '';
        const overdueMs = active
          ? slaOverdueMs(inst?.started_at, etapeCode ? slaByEtape.get(etapeCode) : undefined)
          : null;
        const gate = active
          ? canActOnCurrentStep({ user, projet: p, authorizedRoleCodes: roleInfo?.codes ?? [] })
          : null;

        return {
          id: p.id,
          code: p.code ?? `#${p.id}`,
          intitule: p.intitule ?? '',
          promoteur,
          agence,
          partenaire,
          montant: toNumber(p.montant_total) ?? 0,
          statut: p.statut ?? null,
          type_projet: p.type_projet ?? null,
          etape: inst?.current_etape?.name ?? etapeCode ?? '—',
          etapeOrder: inst?.current_etape?.order ?? null,
          responsable,
          depuis: inst?.started_at ?? null,
          overdueMs,
          gateState: gate?.state ?? null,
          search: `${p.code ?? ''} ${p.intitule ?? ''} ${promoteur} ${agence} ${partenaire}`,
        };
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projetDataKey, instanceByProjet, rolesByEtape, slaByEtape, agenceById, organismeById, user]);

  // Per-statut summary over the whole campagne (before filters).
  const statutCounts = useMemo(() => {
    const m = new Map<string, number>();
    allRows.forEach((r) => {
      const s = r.statut ?? '—';
      m.set(s, (m.get(s) ?? 0) + 1);
    });
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [allRows]);

  const etapeOptions = useMemo(
    () => [...new Set(allRows.map((r) => r.etape).filter((e) => e && e !== '—'))].sort(),
    [allRows],
  );

  // Count of dossiers the connected user can act on (for the toggle badge).
  const mineCount = useMemo(
    () => allRows.filter((r) => r.gateState === 'allowed').length,
    [allRows],
  );

  const rows = useMemo(() => {
    const min = toNumber(montantMin);
    const max = toNumber(montantMax);
    return allRows.filter(
      (r) =>
        (!onlyMine || r.gateState === 'allowed') &&
        (statutFilter === ALL || r.statut === statutFilter) &&
        (etapeFilter === ALL || r.etape === etapeFilter) &&
        (typeFilter === ALL || r.type_projet === typeFilter) &&
        (min == null || r.montant > min) &&
        (max == null || r.montant < max),
    );
  }, [allRows, onlyMine, statutFilter, etapeFilter, typeFilter, montantMin, montantMax]);

  // How many filters are applied (for the "Filtres" button badge) + a reset.
  const activeCount =
    (statutFilter !== ALL ? 1 : 0) +
    (etapeFilter !== ALL ? 1 : 0) +
    (typeFilter !== ALL ? 1 : 0) +
    (montantMin ? 1 : 0) +
    (montantMax ? 1 : 0);
  const resetFilters = () => {
    setStatutFilter(ALL);
    setEtapeFilter(ALL);
    setTypeFilter(ALL);
    setMontantMin('');
    setMontantMax('');
  };

  const columns: ColumnDef<ProjetRow>[] = [
    {
      accessorKey: 'search',
      meta: { label: 'Micro-projet' },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Micro-projet" />,
      cell: ({ row }) => (
        <div className="min-w-0">
          {row.original.intitule && (
            <span className="font-medium text-foreground">{row.original.intitule}</span>
          )}
          <span className="block font-mono text-xs text-muted-foreground">{row.original.code}</span>
          <span className="block text-xs text-muted-foreground">{row.original.promoteur}</span>
        </div>
      ),
    },
    {
      id: 'agence',
      meta: { label: 'Agence' },
      header: 'Agence',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">{row.original.agence || '—'}</span>
      ),
    },
    {
      id: 'partenaire',
      meta: { label: 'Partenaire' },
      header: 'Partenaire',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">{row.original.partenaire || '—'}</span>
      ),
    },
    {
      id: 'montant',
      meta: { label: 'Montant' },
      header: 'Montant',
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-xs font-medium">
          {formatMontant(row.original.montant)}
        </span>
      ),
    },
    {
      id: 'etape',
      meta: { label: 'Étape courante' },
      header: 'Étape courante',
      cell: ({ row }) => (
        <div className="min-w-0">
          <span className="text-xs">
            {row.original.etapeOrder != null && (
              <span className="mr-1 font-medium text-muted-foreground">
                {row.original.etapeOrder}.
              </span>
            )}
            {row.original.etape}
          </span>
          {row.original.overdueMs != null && row.original.overdueMs > 0 && (
            <span className="mt-0.5 flex items-center gap-1 text-xs font-medium text-destructive">
              <AlertTriangle className="size-3" />
              En retard de {humanDuration(row.original.overdueMs)}
            </span>
          )}
        </div>
      ),
    },
    {
      id: 'depuis',
      meta: { label: 'Depuis' },
      header: 'Depuis',
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-xs text-muted-foreground">
          {row.original.depuis ? formatDate(row.original.depuis) : '—'}
        </span>
      ),
    },
    {
      id: 'type',
      meta: { label: 'Type' },
      header: 'Type',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.type_projet
            ? (PROJET_TYPE_LABELS[row.original.type_projet] ?? row.original.type_projet)
            : '—'}
        </span>
      ),
    },
    {
      id: 'statut',
      meta: { label: 'Statut' },
      header: 'Statut',
      cell: ({ row }) => <ProjetStatutBadge statut={row.original.statut} />,
    },
    {
      id: 'action',
      meta: { label: 'Action' },
      header: 'Action',
      // Allowed → the CTA chip; otherwise the responsible role code(s) awaiting it.
      cell: ({ row }) =>
        row.original.gateState === 'allowed' ? (
          <Badge
            variant="outline"
            className="gap-1 whitespace-nowrap border-primary/30 bg-primary/10 font-normal text-primary"
          >
            À traiter
          </Badge>
        ) : row.original.responsable ? (
          <span className="whitespace-nowrap text-xs text-muted-foreground">
            {row.original.responsable}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
  ];

  if (guichets.isLoading) return <LoadingState label="Chargement…" />;
  if (!guichet) {
    return (
      <div className="mx-auto w-full max-w-[1600px] px-6 py-6">
        <EmptyState
          variant="card"
          icon={Landmark}
          title="Guichet introuvable"
          description="Ce guichet n'existe pas ou a été supprimé."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 px-6 py-6">
      <div>
        <Link
          href="/dashboard/guichets"
          className="mb-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Guichets
        </Link>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <span
            className="size-4 shrink-0 rounded-full border border-border"
            style={{ backgroundColor: guichet.couleur ?? 'transparent' }}
          />
          {guichet.libelle}
          <span className="font-mono text-sm font-normal text-muted-foreground">{guichet.code}</span>
        </h1>
        <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <WorkflowIcon className="size-3.5" />
          {guichet.workflow?.name ?? guichet.workflow_code ?? 'Aucun workflow'}
          <span className="mx-1">·</span>
          {formatMontant(guichet.montant_min)} – {formatMontant(guichet.montant_max)}
        </p>
      </div>

      {/* Campagne — high driver + per-statut summary */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5 flex  justify-between ">
       <div>
         <label className="text-xs font-medium text-muted-foreground">Campagne</label>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <Select value={activeCampagne} onValueChange={setCampagne} disabled={campagnes.length === 0}>
            <SelectTrigger className="w-full sm:w-72">
              <SelectValue placeholder="Aucune campagne pour ce workflow" />
            </SelectTrigger>
            <SelectContent>
              {campagnes.map((v) => (
                <SelectItem key={v.code} value={v.code}>
                  Campagne {v.version}
                  {v.is_default && <span className="opacity-50"> (défaut)</span>}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            {allRows.length} micro-projet{allRows.length > 1 ? 's' : ''}
          </span>
        </div>
       </div>

        {activeCampagne && statutCounts.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={() => setStatutFilter(ALL)}
              className={cn(
                'rounded-md border px-2.5 py-1 text-xs transition-colors',
                statutFilter === ALL
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:bg-accent',
              )}
            >
              Total · {allRows.length}
            </button>
            {statutCounts.map(([s, n]) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatutFilter((f) => (f === s ? ALL : s))}
                className={cn(
                  'rounded-md border px-2.5 py-1 text-xs transition-colors',
                  projetStatutStyle(s),
                  statutFilter === s
                    ? 'ring-2 ring-primary ring-offset-1 ring-offset-card'
                    : 'opacity-90 hover:opacity-100',
                )}
              >
                {projetStatutLabel(s)} · {n}
              </button>
            ))}
          </div>
        )}
      </div>

      {activeCampagne ? (
        <GenericTable<ProjetRow>
          data={rows}
          columns={columns}
          searchKey="search"
          searchPlaceholder="Rechercher un micro-projet…"
          isLoading={instances.isLoading || projetsLoading}
          emptyIcon={FolderKanban}
          emptyTitle="Aucun micro-projet"
          emptyDescription="Aucun micro-projet ne correspond à ces critères."
          onRowClick={(r) => router.push(`/dashboard/guichets/${guichetId}/projets/${r.id}`)}
          toolbarEndSlot={
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={onlyMine ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setOnlyMine((v) => !v)}
                title="Micro-projets en attente de votre validation"
              >
                <FileCheck2 className="size-4" />
                Mes dossiers en attente
                {mineCount > 0 && (
                  <span
                    className={cn(
                      'ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold',
                      onlyMine ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted',
                    )}
                  >
                    {mineCount}
                  </span>
                )}
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="cursor-pointer" variant={activeCount > 0 ? 'default' : 'outline'}>
                    <Filter className="size-4" />
                    Filtres
                    {activeCount > 0 && (
                      <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-foreground/20 px-1.5 text-xs font-semibold text-primary-foreground">
                        {activeCount}
                      </span>
                    )}
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Filtres</DialogTitle>
                    <DialogDescription>Affinez les micro-projets de cette campagne.</DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Statut</Label>
                      <Select value={statutFilter} onValueChange={setStatutFilter}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ALL}>Tous les statuts</SelectItem>
                          {statutCounts.map(([s]) => (
                            <SelectItem key={s} value={s}>
                              <span
                                className={cn(
                                  'mr-2 inline-block size-2 rounded-full align-middle',
                                  projetStatutStyle(s),
                                )}
                              />
                              {projetStatutLabel(s)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Étape</Label>
                      <Select value={etapeFilter} onValueChange={setEtapeFilter}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Étape" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ALL}>Toutes les étapes</SelectItem>
                          {etapeOptions.map((e) => (
                            <SelectItem key={e} value={e}>
                              {e}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Type de projet</Label>
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Type de projet" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ALL}>Tous les types</SelectItem>
                          {PROJET_TYPE_OPTIONS.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Montant</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          inputMode="numeric"
                          placeholder="Plus de…"
                          value={montantMin}
                          onChange={(e) => setMontantMin(e.target.value)}
                          className="w-full"
                        />
                        <Input
                          type="number"
                          inputMode="numeric"
                          placeholder="Moins de…"
                          value={montantMax}
                          onChange={(e) => setMontantMax(e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    {activeCount > 0 && (
                      <Button variant="ghost" onClick={resetFilters} className="sm:mr-auto">
                        <X className="size-4" />
                        Réinitialiser
                      </Button>
                    )}
                    <DialogClose asChild>
                      <Button>Fermer</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {activeCount > 0 && (
                <Button variant="ghost" size="sm" onClick={resetFilters} className="shrink-0">
                  <X className="size-4" />
                  Réinitialiser
                </Button>
              )}
            </div>
          }
        />
      ) : (
        <EmptyState
          variant="card"
          icon={WorkflowIcon}
          title="Aucune campagne"
          description="Ce guichet n'est rattaché à aucun workflow, ou le workflow n'a pas de version."
        />
      )}
    </div>
  );
}
