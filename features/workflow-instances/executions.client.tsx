'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Activity, Workflow as WorkflowIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmptyState } from '@/components/generic/empty-state';
import { GenericTable } from '@/components/generic';
import { DataTableColumnHeader } from '@/components/data-table';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/date';
import {
  useWorkflowEtapeRoles,
  useWorkflowEtapes,
  useWorkflowModels,
  useWorkflowVersions,
} from '@/features/workflows/workflow.hooks';
import { useWorkflowInstances } from './workflow-instances.hooks';

const ALL = '__all__';

interface ExecRow {
  id: number;
  micro_projet_id: number;
  projet_code: string;
  projet_intitule: string;
  etape_name: string;
  role_codes: string[];
  started_at: string | null;
  age_days: number | null;
  search: string;
}

function daysSince(iso: string | null): number | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return null;
  return Math.max(0, Math.floor((Date.now() - t) / 86_400_000));
}

/**
 * Exécutions (§8.2): the operational surface for a workflow circuit. The user
 * picks a workflow (model) + version — a required, screen-driving choice, since
 * dossiers are grouped by circuit — then works the dossiers EN_COURS on that
 * version, optionally narrowed to the role responsible for the current étape.
 * Read-only for now; once `/me` exposes `role.code`, the rôle filter defaults to
 * the connected user's role and view/act is gated by authorization.
 */
export function WorkflowExecutionsClient() {
  const instances = useWorkflowInstances();
  const etapeRoles = useWorkflowEtapeRoles();
  const etapes = useWorkflowEtapes();
  const models = useWorkflowModels();
  const versions = useWorkflowVersions();

  const [workflow, setWorkflow] = useState('');
  const [version, setVersion] = useState('');
  const [roleFilter, setRoleFilter] = useState(ALL);

  // etape_code → responsible role codes.
  const rolesByEtape = useMemo(() => {
    const m = new Map<string, string[]>();
    (etapeRoles.data ?? []).forEach((r) => {
      const arr = m.get(r.etape_code) ?? [];
      arr.push(r.role_code);
      m.set(r.etape_code, arr);
    });
    return m;
  }, [etapeRoles.data]);

  const etapeName = (code: string | null) =>
    (code && etapes.data?.find((e) => e.code === code)?.name) || code || '—';

  const versionOptions = useMemo(
    () =>
      (versions.data ?? [])
        .filter((v) => v.workflow_code === workflow)
        .sort((a, b) => a.code.localeCompare(b.code)),
    [versions.data, workflow],
  );

  /** Pick a workflow, auto-selecting its default (or first) version. */
  const chooseWorkflow = (code: string) => {
    setWorkflow(code);
    const vs = (versions.data ?? []).filter((v) => v.workflow_code === code);
    const def = vs.find((v) => v.is_default) ?? vs.find((v) => v.is_active) ?? vs[0];
    setVersion(def?.code ?? '');
    setRoleFilter(ALL);
  };

  const rows: ExecRow[] = useMemo(() => {
    if (!version) return [];
    return (instances.data ?? [])
      .filter((i) => i.status === 'EN_COURS' && i.workflow_version === version)
      .map((i) => {
        const code = i.micro_projet?.code ?? `#${i.micro_projet_id}`;
        const intitule = i.micro_projet?.intitule ?? '';
        return {
          id: i.id,
          micro_projet_id: i.micro_projet_id,
          projet_code: code,
          projet_intitule: intitule,
          etape_name: i.current_etape?.name ?? etapeName(i.current_etape_code),
          role_codes: rolesByEtape.get(i.current_etape_code ?? '') ?? [],
          started_at: i.started_at,
          age_days: daysSince(i.started_at),
          search: `${code} ${intitule}`,
        };
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instances.data, rolesByEtape, etapes.data, version]);

  const roleOptions = useMemo(() => {
    const s = new Set<string>();
    rows.forEach((r) => r.role_codes.forEach((c) => s.add(c)));
    return [...s].sort();
  }, [rows]);

  const filtered = useMemo(
    () => (roleFilter === ALL ? rows : rows.filter((r) => r.role_codes.includes(roleFilter))),
    [rows, roleFilter],
  );

  const columns: ColumnDef<ExecRow>[] = [
    {
      accessorKey: 'search',
      meta: { label: 'Dossier' },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Dossier" />,
      cell: ({ row }) => (
        <Link href={`/dashboard/projets/${row.original.micro_projet_id}`} className="block min-w-0">
          {row.original.projet_intitule && (
            <span className="font-medium text-foreground hover:underline">
              {row.original.projet_intitule}
            </span>
          )}
          <span className="block font-mono text-xs text-muted-foreground">
            {row.original.projet_code}
          </span>
        </Link>
      ),
    },
    {
      id: 'etape',
      meta: { label: 'Étape courante' },
      header: 'Étape courante',
      cell: ({ row }) => <span className="text-sm">{row.original.etape_name}</span>,
    },
    {
      id: 'roles',
      meta: { label: 'Responsable' },
      header: 'Responsable',
      cell: ({ row }) =>
        row.original.role_codes.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {row.original.role_codes.map((c) => (
              <Badge key={c} variant="secondary" className="font-mono text-[11px] font-normal">
                {c}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      id: 'age',
      meta: { label: 'Depuis' },
      header: 'Depuis',
      cell: ({ row }) => {
        const d = row.original.age_days;
        return (
          <span
            className={cn(
              'text-sm',
              d != null && d > 14
                ? 'font-medium text-amber-600 dark:text-amber-400'
                : 'text-muted-foreground',
            )}
          >
            {d == null ? '—' : d === 0 ? "Aujourd'hui" : `${d} j`}
            {row.original.started_at && (
              <span className="ml-1 text-xs text-muted-foreground">
                ({formatDate(row.original.started_at)})
              </span>
            )}
          </span>
        );
      },
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Exécutions</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Sélectionnez un circuit, puis traitez les dossiers de sa version en cours.
        </p>
      </div>

      {/* Primary circuit picker — drives the screen. */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Workflow</label>
            <Select value={workflow} onValueChange={chooseWorkflow}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir un workflow…" />
              </SelectTrigger>
              <SelectContent>
                {(models.data ?? []).map((m) => (
                  <SelectItem key={m.code} value={m.code}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Version</label>
            <Select value={version} onValueChange={setVersion} disabled={!workflow}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir une version…" />
              </SelectTrigger>
              <SelectContent>
                {versionOptions.map((v) => (
                  <SelectItem key={v.code} value={v.code}>
                    {v.code}
                    {v.is_default ? ' · par défaut' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {version ? (
        <GenericTable<ExecRow>
          data={filtered}
          columns={columns}
          searchKey="search"
          searchPlaceholder="Rechercher un dossier…"
          isLoading={instances.isLoading}
          emptyIcon={Activity}
          emptyTitle="Aucun dossier"
          emptyDescription="Aucun dossier en cours sur cette version pour ce rôle."
          toolbarEndSlot={
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Tous les rôles</SelectItem>
                {roleOptions.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />
      ) : (
        <EmptyState
          variant="card"
          icon={WorkflowIcon}
          title="Sélectionnez un circuit"
          description="Choisissez un workflow et sa version pour afficher les dossiers à traiter."
        />
      )}
    </div>
  );
}
