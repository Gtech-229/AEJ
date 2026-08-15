'use client';

import {
  AlertTriangle,
  Banknote,
  Briefcase,
  Building2,
  Clock,
  FolderKanban,
  Landmark,
  ShieldAlert,
  Trophy,
  Users,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/number';
import { GenericTable } from '@/components/generic';
import { DataTableColumnHeader } from '@/components/data-table';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import type { ColumnDef } from '@tanstack/react-table';
import type {
  ClassementAgence,
  FinancementAgence,
  ProjetAgenceCount,
} from './agences-dashboard.dto';
import {
  useAgencesAlertes,
  useAgencesKpis,
  useClassementAgences,
  useFinancementAgence,
  useProjetsAgence,
  useProjetsStatut,
} from './agences-dashboard.hooks';

// ─── Defensive field resolvers for the 3 unconfirmed shapes ──────────────────
// (projets-agence, financement-agence, classement return `[]` in dev — no
// real row has been seen yet. These resolvers try several plausible field
// names so a wrong guess degrades to a placeholder instead of crashing.)
function agenceName(item: ProjetAgenceCount | FinancementAgence | ClassementAgence): string {
  return item.agence ?? item.nom_agence ?? item.libelle ?? (item.agence_id ? `Agence #${item.agence_id}` : 'Agence');
}
function agenceCount(item: ProjetAgenceCount): number {
  return item.count ?? item.nombre_projets ?? item.total ?? 0;
}
function agenceMontant(item: FinancementAgence): number {
  const raw = item.montant ?? item.montant_finance ?? item.total ?? 0;
  return typeof raw === 'string' ? Number(raw) || 0 : raw;
}

// ─── Status label + semantic color (Projets par statut) ──────────────────────
const STATUT_LABELS: Record<string, string> = {
  BROUILLON: 'Brouillon',
  EN_SOUMISSION: 'En soumission',
  EN_COURS: 'En cours',
  EN_ANALYSE: 'En analyse',
  EN_ATTENTE: 'En attente',
  ANNULE: 'Annulé',
  NON_APPROUVE: 'Non approuvé',
  APPROUVE: 'Approuvé',
  EN_FORMATION: 'En formation',
  EN_FINANCEMENT: 'En financement',
  EN_DECAISSEMENT: 'En décaissement',
  EN_SUIVI: 'En suivi',
  EN_REMBOURSEMENT: 'En remboursement',
  TERMINE: 'Terminé',
};
function statutLabel(statut: string): string {
  return STATUT_LABELS[statut] ?? statut.replace(/_/g, ' ');
}
function statutColor(statut: string): string {
  if (['ANNULE', 'NON_APPROUVE'].includes(statut)) return 'var(--color-destructive)';
  if (['APPROUVE', 'TERMINE'].includes(statut)) return 'var(--color-chart-1)';
  return 'var(--color-chart-3)';
}

const chartConfig = {
  count: { label: 'Projets' },
  montant: { label: 'Montant financé' },
} satisfies ChartConfig;

/** Small metric card for the KPI/alertes rows — icon badge + big number + label. */
function MetricCard({
  icon: Icon,
  label,
  value,
  accent = 'primary',
}: {
  icon: typeof Users;
  label: string;
  value: string;
  accent?: 'primary' | 'warning';
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <span
        className={cn(
          'flex size-9 items-center justify-center rounded-lg',
          accent === 'primary' ? 'bg-primary/10 text-primary' : 'bg-amber-500/10 text-amber-600',
        )}
      >
        <Icon className="size-4.5" />
      </span>
      <p className="mt-3 text-2xl font-bold text-foreground">{value}</p>
      <p className="mt-0.5 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

/** FCFA-formatted amount — large sums, so keep it compact-friendly. */
function formatFcfa(value: string | number): string {
  return `${formatNumber(value)} FCFA`;
}

export function AgencesDashboardClient() {
  const { data: kpis, isLoading: loadingKpis } = useAgencesKpis();
  const { data: alertes, isLoading: loadingAlertes } = useAgencesAlertes();
  const { data: projetsStatut } = useProjetsStatut();
  const { data: projetsAgence } = useProjetsAgence();
  const { data: financementAgence } = useFinancementAgence();
  const { data: classement, isLoading: loadingClassement } = useClassementAgences();

  const statutChartData = [...(projetsStatut ?? [])]
    .sort((a, b) => b.count - a.count)
    .map((s) => ({ statut: statutLabel(s.statut), count: s.count, fill: statutColor(s.statut) }));

  const projetsAgenceChartData = (projetsAgence ?? []).map((p) => ({
    agence: agenceName(p),
    count: agenceCount(p),
  }));

  const financementChartData = (financementAgence ?? []).map((f) => ({
    agence: agenceName(f),
    montant: agenceMontant(f),
  }));

  const classementColumns: ColumnDef<ClassementAgence>[] = [
    {
      id: 'rang',
      header: '#',
      cell: ({ row }) => (
        <span className="text-sm font-semibold text-muted-foreground">
          {row.original.rang ?? row.original.rank ?? row.index + 1}
        </span>
      ),
    },
    {
      id: 'agence',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Agence" />,
      cell: ({ row }) => <span className="font-medium">{agenceName(row.original)}</span>,
    },
    {
      id: 'nombre_projets',
      header: 'Projets',
      cell: ({ row }) => row.original.nombre_projets ?? '—',
    },
    {
      id: 'montant',
      header: 'Montant',
      cell: ({ row }) =>
        row.original.montant !== undefined ? formatFcfa(row.original.montant) : '—',
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 px-[2.5%] py-6">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Landmark className="size-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agence</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Vue globale{typeof kpis?.nombre_agences === 'number' && ` — ${kpis.nombre_agences} agences régionales`}.
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {loadingKpis
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[126px] animate-pulse rounded-2xl border border-border/60 bg-muted/40" />
            ))
          : kpis && (
              <>
                <MetricCard icon={Building2} label="Agences" value={formatNumber(kpis.nombre_agences)} />
                <MetricCard icon={FolderKanban} label="Projets" value={formatNumber(kpis.nombre_projets)} />
                <MetricCard icon={Users} label="Promoteurs" value={formatNumber(kpis.nombre_promoteurs)} />
                <MetricCard icon={Banknote} label="Montant financé" value={formatFcfa(kpis.montant_financé)} />
                <MetricCard icon={Banknote} label="Montant décaissé" value={formatFcfa(kpis.montant_décaissé)} />
                <MetricCard icon={Briefcase} label="Emplois créés" value={formatNumber(kpis.emplois_créés)} />
              </>
            )}
      </div>

      {/* Alertes */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {loadingAlertes
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-[126px] animate-pulse rounded-2xl border border-border/60 bg-muted/40" />
            ))
          : alertes && (
              <>
                <MetricCard
                  icon={Clock}
                  accent="warning"
                  label="Dossiers en attente"
                  value={formatNumber(alertes.dossiers_en_attente)}
                />
                <MetricCard
                  icon={ShieldAlert}
                  accent="warning"
                  label="Financements non décaissés"
                  value={formatNumber(alertes.financements_non_decaisses)}
                />
                <MetricCard
                  icon={AlertTriangle}
                  accent="warning"
                  label="Projets en retard"
                  value={formatNumber(alertes.projets_en_retard)}
                />
              </>
            )}
      </div>

      {/* Projets par statut */}
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Projets par statut</h2>
        <ChartContainer config={chartConfig} className="mt-4 aspect-auto h-[360px] w-full">
          <BarChart data={statutChartData} layout="vertical" margin={{ left: 8 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="statut"
              tickLine={false}
              axisLine={false}
              width={120}
              tick={{ fontSize: 11 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>

      {/* Projets par agence + Financement par agence */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">Projets par agence</h2>
          {projetsAgenceChartData.length === 0 ? (
            <p className="mt-8 pb-8 text-center text-sm text-muted-foreground">
              Aucune donnée pour le moment.
            </p>
          ) : (
            <ChartContainer config={chartConfig} className="mt-4 aspect-auto h-[280px] w-full">
              <BarChart data={projetsAgenceChartData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="agence" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-chart-3)" radius={4} />
              </BarChart>
            </ChartContainer>
          )}
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">Financement par agence</h2>
          {financementChartData.length === 0 ? (
            <p className="mt-8 pb-8 text-center text-sm text-muted-foreground">
              Aucune donnée pour le moment.
            </p>
          ) : (
            <ChartContainer config={chartConfig} className="mt-4 aspect-auto h-[280px] w-full">
              <BarChart data={financementChartData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="agence" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="montant" fill="var(--color-chart-1)" radius={4} />
              </BarChart>
            </ChartContainer>
          )}
        </div>
      </div>

      {/* Classement */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Trophy className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Classement des agences</h2>
        </div>
        <GenericTable<ClassementAgence>
          data={classement ?? []}
          columns={classementColumns}
          isLoading={loadingClassement}
          emptyIcon={Trophy}
          emptyTitle="Aucun classement disponible"
          emptyDescription="Le classement s'affichera dès que des données seront disponibles."
        />
      </div>
    </div>
  );
}
