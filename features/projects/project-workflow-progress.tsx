'use client';

import { useMemo } from 'react';
import { ChevronDown, FileCheck2, GitBranch, MessageSquare, Paperclip } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { EmptyState } from '@/components/generic/empty-state';
import { LoadingState } from '@/components/generic/loader';
import { cn } from '@/lib/utils';
import { formatDate, formatDateTime } from '@/lib/date';
import type { Projet } from './projects.dto';
import type { WorkflowEtape } from '@/features/workflows/workflow.dto';
import {
  useWorkflowDeliverables,
  useWorkflowEtapeDeliverables,
  useWorkflowEtapeRoles,
  useWorkflowEtapes,
  useWorkflowRoles,
} from '@/features/workflows/workflow.hooks';
import type {
  WorkflowInstance,
  WorkflowInstanceComment,
  WorkflowInstanceDeliverable,
  WorkflowInstanceHistory,
  WorkflowInstanceStatus,
} from '@/features/workflow-instances/workflow-instances.dto';
import {
  useWorkflowInstance,
  useWorkflowInstances,
} from '@/features/workflow-instances/workflow-instances.hooks';

const STORAGE_ORIGIN = 'https://apis.aej-ci.net/public';
const fileHref = (p?: string | null) =>
  !p ? undefined : /^https?:\/\//.test(p) ? p : `${STORAGE_ORIGIN}${p.startsWith('/') ? '' : '/'}${p}`;

function humanSize(bytes?: number | null) {
  if (bytes == null) return '';
  const units = ['o', 'Ko', 'Mo', 'Go'];
  let n = bytes;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(i > 0 && n < 10 ? 1 : 0)} ${units[i]}`;
}

/**
 * A step's date range: the history entry/exit if recorded, otherwise the span of
 * its activity (produced livrables + comments). Returns a display string or ''.
 */
function stepDateRange(
  history: WorkflowInstanceHistory[],
  deliverables: WorkflowInstanceDeliverable[],
  comments: WorkflowInstanceComment[],
): string {
  const acted = history.map((h) => h.acted_at).filter(Boolean).sort() as string[];
  let start = acted[0];
  let end = acted[acted.length - 1];
  if (!start && !end) {
    const acts = [
      ...deliverables.map((d) => d.produced_at),
      ...comments.map((c) => c.created_at),
    ]
      .filter(Boolean)
      .sort() as string[];
    start = acts[0];
    end = acts[acts.length - 1];
  }
  if (start && end && start.slice(0, 10) !== end.slice(0, 10)) {
    return `${formatDate(start)} → ${formatDate(end)}`;
  }
  const one = start ?? end;
  return one ? formatDate(one) : '';
}

const STATUS_LABELS: Record<WorkflowInstanceStatus, string> = {
  EN_COURS: 'En cours',
  TERMINE: 'Terminé',
  REJETE: 'Rejeté',
  ABANDONNE: 'Abandonné',
};
const STATUS_CLASS: Record<WorkflowInstanceStatus, string> = {
  EN_COURS: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
  TERMINE: 'border-success/30 bg-success/10 text-success',
  REJETE: 'border-destructive/30 bg-destructive/10 text-destructive',
  ABANDONNE: 'text-muted-foreground',
};

type StepStatus = 'done' | 'current' | 'pending';
const STEP_TONE: Record<StepStatus, { ring: string; badge: string }> = {
  done: {
    ring: 'border-success/40 bg-success/10 text-success',
    badge: 'border-success/30 bg-success/10 text-success',
  },
  current: {
    ring: 'border-primary bg-primary/10 text-primary',
    badge: 'border-primary/30 bg-primary/10 text-primary',
  },
  pending: { ring: 'border-border text-muted-foreground', badge: 'text-muted-foreground' },
};

const etapeVersionCode = (e: WorkflowEtape) =>
  typeof e.workflow_version === 'string' ? e.workflow_version : e.workflow_version?.code;

function DeliverableRow({ d, name }: { d: WorkflowInstanceDeliverable; name?: string }) {
  const href = fileHref(d.file_path);
  return (
    <li className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border p-2.5">
      <div className="flex min-w-0 items-center gap-2">
        <Paperclip className="size-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {d.deliverable?.name ?? name ?? d.deliverable_code}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {d.file_name ?? '—'}
            {d.file_size ? ` · ${humanSize(d.file_size)}` : ''}
            {d.produced_at ? ` · ${formatDate(d.produced_at)}` : ''}
          </p>
        </div>
      </div>
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-medium text-primary hover:underline"
        >
          Ouvrir
        </a>
      )}
    </li>
  );
}

function CommentRow({ c }: { c: WorkflowInstanceComment }) {
  return (
    <li className="rounded-md border border-border p-2.5">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium text-foreground">
          {c.commented_by ? `${c.commented_by.prenom} ${c.commented_by.nom}` : 'Commentaire'}
        </span>
        <span>{c.created_at ? formatDateTime(c.created_at) : ''}</span>
      </div>
      <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">{c.comment}</p>
    </li>
  );
}

function SubHeading({ icon: Icon, label }: { icon: typeof Paperclip; label: string }) {
  return (
    <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
      <Icon className="size-3.5" />
      {label}
    </p>
  );
}

function StepRow({
  etape,
  status,
  statusLabel,
  history,
  comments,
  deliverables,
  defaultOpen,
  resolveName,
}: {
  etape: WorkflowEtape;
  status: StepStatus;
  statusLabel: string;
  history: WorkflowInstanceHistory[];
  comments: WorkflowInstanceComment[];
  deliverables: WorkflowInstanceDeliverable[];
  defaultOpen: boolean;
  resolveName?: (code: string) => string | undefined;
}) {
  const tone = STEP_TONE[status];
  const dates = stepDateRange(history, deliverables, comments);
  const hasDetails =
    !!etape.description || history.length > 0 || comments.length > 0 || deliverables.length > 0;

  return (
    <Collapsible defaultOpen={defaultOpen} className="rounded-lg border border-border bg-card">
      <CollapsibleTrigger className="group flex w-full items-center gap-3 p-3 text-left">
        <span
          className={cn(
            'flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium',
            tone.ring,
          )}
        >
          {etape.order}
        </span>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              'truncate text-sm',
              status === 'current'
                ? 'font-semibold text-foreground'
                : status === 'done'
                  ? 'text-foreground'
                  : 'text-muted-foreground',
            )}
          >
            {etape.name}
          </p>
          {dates && <p className="mt-0.5 text-xs text-muted-foreground">{dates}</p>}
        </div>
        <Badge variant="outline" className={cn('shrink-0 font-normal', tone.badge)}>
          {statusLabel}
        </Badge>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-3 border-t border-border px-3 py-3">
        {etape.description && (
          <p className="text-xs text-muted-foreground">{etape.description}</p>
        )}

        {history.length > 0 && (
          <div className="space-y-1.5">
            {history.map((h) => {
              const note = h.comments || h.comment || h.observation;
              return (
                <div key={h.id} className="text-xs text-muted-foreground">
                  {h.role_code ? (
                    <span className="font-mono font-medium text-foreground">{h.role_code}</span>
                  ) : null}
                  {h.action ? ` · ${h.action}` : ''}
                  {h.acted_at ? ` · ${formatDate(h.acted_at)}` : ''}
                  {note ? <p className="mt-0.5 text-foreground">{note}</p> : null}
                </div>
              );
            })}
          </div>
        )}

        {deliverables.length > 0 && (
          <div className="space-y-1.5">
            <SubHeading icon={FileCheck2} label={`Livrables (${deliverables.length})`} />
            <ul className="space-y-2">
              {deliverables.map((d) => (
                <DeliverableRow key={d.id} d={d} name={resolveName?.(d.deliverable_code)} />
              ))}
            </ul>
          </div>
        )}

        {comments.length > 0 && (
          <div className="space-y-1.5">
            <SubHeading icon={MessageSquare} label={`Commentaires (${comments.length})`} />
            <ul className="space-y-2">
              {comments.map((c) => (
                <CommentRow key={c.id} c={c} />
              ))}
            </ul>
          </div>
        )}

        {!hasDetails && (
          <p className="text-xs text-muted-foreground">Aucun détail pour cette étape.</p>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

/**
 * Progression tab (§8.2 traçabilité): the dossier's live workflow instance —
 * status + the version's étapes as an accordion. Each step shows order · name ·
 * status and expands to its details (history, produced livrables, comments).
 * Read-only. Clear empty state when the dossier isn't engaged in a workflow yet.
 */
export function ProjectWorkflowProgress({ projet }: { projet: Projet }) {
  const instances = useWorkflowInstances();
  const etapes = useWorkflowEtapes();
  const etapeDeliverables = useWorkflowEtapeDeliverables();
  const etapeRoles = useWorkflowEtapeRoles();
  const roles = useWorkflowRoles();
  const deliverableDefs = useWorkflowDeliverables();

  // A dossier can carry several instances — prefer the active one (EN_COURS),
  // then the most recently started. The list only maps projet → instance id.
  const listInstance: WorkflowInstance | undefined = useMemo(() => {
    const mine = (instances.data ?? []).filter((i) => i.micro_projet_id === projet.id);
    if (mine.length === 0) return undefined;
    const byRecent = [...mine].sort((a, b) =>
      (b.started_at ?? '').localeCompare(a.started_at ?? ''),
    );
    return byRecent.find((i) => i.status === 'EN_COURS') ?? byRecent[0];
  }, [instances.data, projet.id]);

  // The detail endpoint carries history / deliverables / comments in one call.
  const detailQuery = useWorkflowInstance(listInstance?.id);
  const instance = detailQuery.data ?? listInstance;

  // deliverable_code → name (§8.1 config — the detail endpoint doesn't embed it).
  const deliverableNameByCode = useMemo(() => {
    const m = new Map<string, string>();
    (deliverableDefs.data ?? []).forEach((d) => d.code && m.set(d.code, d.name));
    return m;
  }, [deliverableDefs.data]);

  // Responsible role(s) for the current étape (§8.1 etape-roles config).
  const responsibleRoles = useMemo(() => {
    if (!instance?.current_etape_code) return [];
    return (etapeRoles.data ?? [])
      .filter((r) => r.etape_code === instance.current_etape_code)
      .map((r) => roles.data?.find((role) => role.code === r.role_code)?.name ?? r.role_code);
  }, [etapeRoles.data, roles.data, instance?.current_etape_code]);

  const versionEtapes = useMemo(() => {
    if (!instance) return [];
    return (etapes.data ?? [])
      .filter((e) => etapeVersionCode(e) === instance.workflow_version)
      .sort((a, b) => a.order - b.order);
  }, [etapes.data, instance]);

  const instanceHistory = detailQuery.data?.history ?? [];
  const instanceDeliverables = detailQuery.data?.deliverables ?? [];
  const instanceComments = detailQuery.data?.comments ?? [];

  // deliverable_code → the étape(s) that expect it (§8.1 config mapping).
  const stepForDeliverableCode = useMemo(() => {
    const m = new Map<string, string>();
    (etapeDeliverables.data ?? []).forEach((d) => {
      if (d.deliverable_code) m.set(d.deliverable_code, d.etape_code);
    });
    return m;
  }, [etapeDeliverables.data]);

  if (instances.isLoading) return <LoadingState label="Chargement…" />;

  if (!instance) {
    return (
      <EmptyState
        variant="card"
        icon={GitBranch}
        title="Aucun circuit en cours"
        description="Ce dossier n'est pas encore engagé dans un circuit workflow."
      />
    );
  }

  const currentOrder =
    instance.current_etape?.order ??
    versionEtapes.find((e) => e.code === instance.current_etape_code)?.order ??
    -1;

  const stepStatus = (etape: WorkflowEtape): StepStatus => {
    if (etape.code === instance.current_etape_code) return 'current';
    if (instance.status === 'TERMINE') return 'done';
    if (currentOrder >= 0 && etape.order < currentOrder) return 'done';
    return 'pending';
  };
  const stepStatusLabel = (etape: WorkflowEtape, status: StepStatus) => {
    if (status === 'current' && instance.status !== 'EN_COURS') return STATUS_LABELS[instance.status];
    return status === 'done' ? 'Terminé' : status === 'current' ? 'En cours' : 'En attente';
  };

  // Deliverables/comments not attached to any displayed step (safety net).
  const stepCodes = new Set(versionEtapes.map((e) => e.code));
  const orphanDeliverables = instanceDeliverables.filter((d) => {
    const code = stepForDeliverableCode.get(d.deliverable_code);
    return !code || !stepCodes.has(code);
  });

  return (
    <div className="space-y-4">
      {/* Instance header */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-mono text-xs text-muted-foreground">{instance.workflow_version}</p>
            <p className="mt-0.5 font-medium text-foreground">
              {instance.current_etape?.name ?? instance.current_etape_code ?? '—'}
            </p>
            {instance.status === 'EN_COURS' && responsibleRoles.length > 0 && (
              <p className="mt-1 text-xs">
                <span className="text-muted-foreground">En attente de : </span>
                <span className="font-medium text-primary">{responsibleRoles.join(', ')}</span>
              </p>
            )}
          </div>
          <Badge variant="outline" className={cn('font-normal', STATUS_CLASS[instance.status])}>
            {STATUS_LABELS[instance.status]}
          </Badge>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
          <span>Démarré le {instance.started_at ? formatDate(instance.started_at) : '—'}</span>
          {instance.completed_at && <span>Terminé le {formatDate(instance.completed_at)}</span>}
        </div>
      </div>

      {/* Étapes accordion */}
      {versionEtapes.length > 0 ? (
        <div className="space-y-2">
          {versionEtapes.map((etape) => {
            const status = stepStatus(etape);
            const stepDeliverables = instanceDeliverables.filter(
              (d) => stepForDeliverableCode.get(d.deliverable_code) === etape.code,
            );
            return (
              <StepRow
                key={etape.id}
                etape={etape}
                status={status}
                statusLabel={stepStatusLabel(etape, status)}
                history={instanceHistory.filter((h) => h.etape_code === etape.code)}
                comments={instanceComments.filter((c) => c.etape_code === etape.code)}
                deliverables={stepDeliverables}
                defaultOpen={status === 'current'}
                resolveName={(code) => deliverableNameByCode.get(code)}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          variant="card"
          icon={GitBranch}
          title="Étapes indisponibles"
          description="Les étapes de cette version de workflow ne sont pas chargées."
        />
      )}

      {/* Livrables non rattachés à une étape (filet de sécurité) */}
      {orphanDeliverables.length > 0 && (
        <section>
          <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <FileCheck2 className="size-4" /> Autres livrables ({orphanDeliverables.length})
          </h3>
          <ul className="space-y-2">
            {orphanDeliverables.map((d) => (
              <DeliverableRow key={d.id} d={d} name={deliverableNameByCode.get(d.deliverable_code)} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
