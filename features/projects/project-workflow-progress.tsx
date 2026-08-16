'use client';

import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CalendarClock,
  ChevronDown,
  CircleDashed,
  Dot,
  ExternalLink,
  FileCheck2,
  GitBranch,
  MessageSquare,
  Paperclip,
  Timer,
  UserCog,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { EmptyState } from '@/components/generic/empty-state';
import { LoadingState } from '@/components/generic/loader';
import { cn } from '@/lib/utils';
import { formatDate, formatDateTime } from '@/lib/date';
import type { Projet } from './projects.dto';
import type {
  WorkflowEtape,
  WorkflowEtapeDeliverable,
  WorkflowEtapeSla,
} from '@/features/workflows/workflow.dto';
import {
  useWorkflowDeliverables,
  useWorkflowEtapeDeliverables,
  useWorkflowEtapeRoles,
  useWorkflowEtapeSlas,
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
  useAddWorkflowInstanceComment,
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

/** Milliseconds for an SLA `duration_unit`, tolerant of FR/EN singular/plural. */
const UNIT_MS: Record<string, number> = {
  minute: 60_000,
  minutes: 60_000,
  min: 60_000,
  heure: 3_600_000,
  heures: 3_600_000,
  hour: 3_600_000,
  hours: 3_600_000,
  h: 3_600_000,
  jour: 86_400_000,
  jours: 86_400_000,
  day: 86_400_000,
  days: 86_400_000,
  j: 86_400_000,
  semaine: 604_800_000,
  semaines: 604_800_000,
  week: 604_800_000,
  weeks: 604_800_000,
  mois: 2_592_000_000,
  month: 2_592_000_000,
  months: 2_592_000_000,
};

function humanDuration(ms: number): string {
  const abs = Math.abs(ms);
  const d = Math.floor(abs / 86_400_000);
  if (d >= 1) return `${d} j`;
  const h = Math.floor(abs / 3_600_000);
  if (h >= 1) return `${h} h`;
  return `${Math.max(1, Math.floor(abs / 60_000))} min`;
}

const slaLabel = (s: WorkflowEtapeSla) => `${s.duration_value} ${s.duration_unit}`;

/**
 * The earliest recorded activity timestamp for a step — its "date de début"
 * (history entry, else the first produced livrable / comment).
 */
function stepStart(
  history: WorkflowInstanceHistory[],
  deliverables: WorkflowInstanceDeliverable[],
  comments: WorkflowInstanceComment[],
): string | undefined {
  const stamps = [
    ...history.map((h) => h.acted_at),
    ...deliverables.map((d) => d.produced_at),
    ...comments.map((c) => c.created_at),
  ]
    .filter(Boolean)
    .sort() as string[];
  return stamps[0];
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

/** A required/optional livrable for the step + whether it's been provided. */
interface Requirement {
  key: string;
  name: string;
  required: boolean;
  provided?: WorkflowInstanceDeliverable;
}

function Meta({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof UserCog;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <div className="text-sm font-medium text-foreground">{children}</div>
      </div>
    </div>
  );
}

function SubHeading({ icon: Icon, label }: { icon: typeof Paperclip; label: string }) {
  return (
    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      <Icon className="size-3.5" />
      {label}
    </p>
  );
}

function RequirementRow({ req }: { req: Requirement }) {
  const href = fileHref(req.provided?.file_path);
  const provided = !!req.provided;
  return (
    <li className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3">
      <div className="flex min-w-0 items-start gap-2.5">
        {provided ? (
          <FileCheck2 className="mt-0.5 size-4 shrink-0 text-success" />
        ) : (
          <CircleDashed className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{req.name}</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
            <span className={req.required ? 'text-foreground' : 'text-muted-foreground'}>
              {req.required ? 'Requis' : 'Optionnel'}
            </span>
            <span className="text-muted-foreground">·</span>
            {provided ? (
              <span className="font-medium text-success">
                Fourni{req.provided?.produced_at ? ` le ${formatDate(req.provided.produced_at)}` : ''}
              </span>
            ) : (
              <span className="text-muted-foreground">Non fourni</span>
            )}
          </div>
          {provided && req.provided?.file_name && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {req.provided.file_name}
              {req.provided.file_size ? ` · ${humanSize(req.provided.file_size)}` : ''}
            </p>
          )}
        </div>
      </div>
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 text-xs font-medium text-primary group"
        >
          <ExternalLink className='size-4 group-hover:translate-x-1 duration:600' />
        </a>
      )}
    </li>
  );
}

/** Inline composer to add a comment/observation to a step (current step only). */
function StepCommentComposer({ instanceId, etapeCode }: { instanceId: number; etapeCode: string }) {
  const [value, setValue] = useState('');
  const add = useAddWorkflowInstanceComment();
  const submit = () => {
    const comment = value.trim();
    if (!comment) return;
    add.mutate(
      { workflow_instance_id: instanceId, etape_code: etapeCode, comment },
      { onSuccess: () => setValue('') },
    );
  };
  return (
    <div className="space-y-2 rounded-lg border border-dashed border-border p-3">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ajouter un commentaire ou une observation…"
        rows={2}
      />
      <div className="flex justify-end">
        <Button size="sm" disabled={!value.trim() || add.isPending} onClick={submit}>
          {add.isPending ? 'Envoi…' : 'Commenter'}
        </Button>
      </div>
    </div>
  );
}

function CommentRow({ c }: { c: WorkflowInstanceComment }) {
  return (
    <li className="rounded-lg border border-border p-3">
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

function StepCard({
  etape,
  status,
  statusLabel,
  roleLabels,
  responsibility,
  startAt,
  sla,
  overdueMs,
  requirements,
  history,
  comments,
  defaultOpen,
  instanceId,
  canComment,
}: {
  etape: WorkflowEtape;
  status: StepStatus;
  statusLabel: string;
  roleLabels: string[];
  responsibility?: string;
  startAt?: string;
  sla?: WorkflowEtapeSla;
  /** >0 when the current step is past its SLA deadline; else null/undefined. */
  overdueMs?: number | null;
  requirements: Requirement[];
  history: WorkflowInstanceHistory[];
  comments: WorkflowInstanceComment[];
  defaultOpen: boolean;
  instanceId: number;
  /** Show the comment composer (current, running step). */
  canComment: boolean;
}) {
  const tone = STEP_TONE[status];
  const overdue = typeof overdueMs === 'number' && overdueMs > 0;
  const providedCount = requirements.filter((r) => r.provided).length;

  return (
    <Collapsible
      defaultOpen={defaultOpen}
      className={cn(
        'rounded-xl border bg-card',
        status === 'current' ? 'border-primary/40 shadow-sm' : 'border-border',
      )}
    >
      <CollapsibleTrigger className="group flex w-full items-center gap-3 p-4 text-left">
        <span
          className={cn(
            'flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold',
            tone.ring,
          )}
        >
          {etape.order}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <p
              className={cn(
                'truncate text-sm',
                status === 'pending' ? 'text-muted-foreground' : 'font-semibold text-foreground',
              )}
            >
              {etape.name}
            </p>
            <span className="font-mono text-[11px] text-muted-foreground">{etape.code}</span>
          </div>
          {startAt && (
            <p className="mt-0.5 text-xs text-muted-foreground">Depuis le {formatDate(startAt)}</p>
          )}
        </div>
        {overdue && (
          <Badge
            variant="outline"
            className="shrink-0 gap-1 border-destructive/30 bg-destructive/10 font-normal text-destructive"
          >
            <AlertTriangle className="size-3" />
            En retard de {humanDuration(overdueMs!)}
          </Badge>
        )}
        <Badge variant="outline" className={cn('shrink-0 font-normal', tone.badge)}>
          {statusLabel}
        </Badge>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-5 border-t border-border p-4">
        {/* Meta grid */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Meta icon={UserCog} label="Profil(s) en charge">
            {roleLabels.length > 0 ? (
              <div className='flex flex-col space-y-1 py-2'>{roleLabels.map((rl)=> (
                  <div key={rl} className='flex items-center gap-2'>
                    <Dot className='text-muted-foreground size-2'/>
                    <span>{rl}</span>
                  </div>
                
              ))}</div>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
            {responsibility && (
              <p className="mt-0.5 text-xs font-normal text-muted-foreground">{responsibility}</p>
            )}
          </Meta>
          <Meta icon={CalendarClock} label="Date de début">
            {startAt ? formatDate(startAt) : <span className="text-muted-foreground">—</span>}
          </Meta>
          <Meta icon={Timer} label="Délai">
            {sla ? slaLabel(sla) : <span className="text-muted-foreground">—</span>}
            {overdue && (
              <p className="mt-0.5 text-xs font-normal text-destructive">
                Dépassé de {humanDuration(overdueMs!)}
              </p>
            )}
          </Meta>
        </div>

        {etape.description && (
          <div className="space-y-1.5">
            <SubHeading icon={GitBranch} label="Description" />
            <p className="text-sm text-muted-foreground">{etape.description}</p>
          </div>
        )}

        {/* Livrables — the step's requirements + provided state */}
        {requirements.length > 0 && (
          <div className="space-y-2">
            <SubHeading
              icon={FileCheck2}
              label={`Livrables — ${providedCount}/${requirements.length} fournis`}
            />
            <ul className="space-y-2">
              {requirements.map((r) => (
                <RequirementRow key={r.key} req={r} />
              ))}
            </ul>
          </div>
        )}

        {/* History (who acted) */}
        {history.length > 0 && (
          <div className="space-y-1.5">
            <SubHeading icon={UserCog} label="Traçabilité" />
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
          </div>
        )}

        {/* Comments */}
        {(comments.length > 0 || canComment) && (
          <div className="space-y-2">
            <SubHeading icon={MessageSquare} label={`Commentaires (${comments.length})`} />
            {comments.length > 0 && (
              <ul className="space-y-2">
                {comments.map((c) => (
                  <CommentRow key={c.id} c={c} />
                ))}
              </ul>
            )}
            {canComment && <StepCommentComposer instanceId={instanceId} etapeCode={etape.code} />}
          </div>
        )}

        {!etape.description &&
          requirements.length === 0 &&
          history.length === 0 &&
          comments.length === 0 &&
          !canComment && (
            <p className="text-xs text-muted-foreground">Aucun détail pour cette étape.</p>
          )}
      </CollapsibleContent>
    </Collapsible>
  );
}

/**
 * Progression tab (§8.2 traçabilité): the dossier's live workflow instance —
 * status + the version's étapes as rich, spacious cards. Each step card carries
 * its libellé/code/statut, description, profil en charge, date de début, overdue
 * flag (vs its SLA), its livrables **as requirements** (required + provided or
 * not, with a view link when provided), and its comments. Read-only.
 */
export function ProjectWorkflowProgress({ projet }: { projet: Projet }) {
  const instances = useWorkflowInstances();
  const etapes = useWorkflowEtapes();
  const etapeDeliverables = useWorkflowEtapeDeliverables();
  const etapeRoles = useWorkflowEtapeRoles();
  const etapeSlas = useWorkflowEtapeSlas();
  const roles = useWorkflowRoles();
  const deliverableDefs = useWorkflowDeliverables();

  // Prefer the active instance (EN_COURS), then the most recently started.
  const listInstance: WorkflowInstance | undefined = useMemo(() => {
    const mine = (instances.data ?? []).filter((i) => i.micro_projet_id === projet.id);
    if (mine.length === 0) return undefined;
    const byRecent = [...mine].sort((a, b) =>
      (b.started_at ?? '').localeCompare(a.started_at ?? ''),
    );
    return byRecent.find((i) => i.statut === 'EN_COURS') ?? byRecent[0];
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

  const versionEtapes = useMemo(() => {
    if (!instance) return [];
    return (etapes.data ?? [])
      .filter((e) => etapeVersionCode(e) === instance.workflow_version)
      .sort((a, b) => a.order - b.order);
  }, [etapes.data, instance]);

  const instanceHistory = detailQuery.data?.history ?? [];
  const instanceDeliverables = detailQuery.data?.deliverables ?? [];
  const instanceComments = detailQuery.data?.comments ?? [];

  // etape_code → its SLA / role(s) / expected livrables (Phase 3 config).
  const slaByEtape = useMemo(() => {
    const m = new Map<string, WorkflowEtapeSla>();
    (etapeSlas.data ?? []).forEach((s) => m.set(s.etape_code, s));
    return m;
  }, [etapeSlas.data]);

  const rolesByEtape = useMemo(() => {
    const m = new Map<string, { labels: string[]; responsibility?: string }>();
    (etapeRoles.data ?? []).forEach((r) => {
      const label = roles.data?.find((x) => x.code === r.role_code)?.name ?? r.role_code;
      const entry = m.get(r.etape_code) ?? { labels: [] };
      entry.labels.push(label);
      if (!entry.responsibility && r.responsibility) entry.responsibility = r.responsibility;
      m.set(r.etape_code, entry);
    });
    return m;
  }, [etapeRoles.data, roles.data]);

  const requirementsByEtape = useMemo(() => {
    const m = new Map<string, WorkflowEtapeDeliverable[]>();
    (etapeDeliverables.data ?? []).forEach((d) => {
      const arr = m.get(d.etape_code) ?? [];
      arr.push(d);
      m.set(d.etape_code, arr);
    });
    return m;
  }, [etapeDeliverables.data]);

  // Provided instance livrables, indexed by deliverable_code.
  const providedByCode = useMemo(() => {
    const m = new Map<string, WorkflowInstanceDeliverable>();
    instanceDeliverables.forEach((d) => m.set(d.deliverable_code, d));
    return m;
  }, [instanceDeliverables]);

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
    if (instance.statut === 'TERMINE') return 'done';
    if (currentOrder >= 0 && etape.order < currentOrder) return 'done';
    return 'pending';
  };
  const stepStatusLabel = (status: StepStatus) => {
    if (status === 'current' && instance.statut !== 'EN_COURS') return STATUS_LABELS[instance.statut];
    return status === 'done' ? 'Terminé' : status === 'current' ? 'En cours' : 'En attente';
  };

  // Provided livrables whose code isn't declared by any étape (safety net so
  // real files are never hidden just because the config doesn't list them).
  const allExpectedCodes = new Set(
    (etapeDeliverables.data ?? [])
      .map((d) => d.deliverable_code)
      .filter(Boolean) as string[],
  );
  const orphanRequirements: Requirement[] = instanceDeliverables
    .filter((d) => !allExpectedCodes.has(d.deliverable_code))
    .map((d) => ({
      key: `orphan-${d.id}`,
      name: deliverableNameByCode.get(d.deliverable_code) ?? d.deliverable_code,
      required: false,
      provided: d,
    }));

  const buildRequirements = (etape: WorkflowEtape): Requirement[] => {
    const defs = requirementsByEtape.get(etape.code) ?? [];
    return defs.map((d) => {
      const code = d.deliverable_code ?? '';
      return {
        key: String(d.id),
        name: d.name || deliverableNameByCode.get(code) || code || 'Livrable',
        required: d.is_required,
        provided: code ? providedByCode.get(code) : undefined,
      };
    });
  };

  // Overdue only for the current, still-running step (past its SLA deadline).
  const overdueForStep = (etape: WorkflowEtape, status: StepStatus, startAt?: string) => {
    if (status !== 'current' || instance.statut !== 'EN_COURS' || !startAt) return null;
    const sla = slaByEtape.get(etape.code);
    if (!sla) return null;
    const unitMs = UNIT_MS[sla.duration_unit?.toLowerCase()?.trim()] ?? 0;
    if (!unitMs) return null;
    const deadline = new Date(startAt).getTime() + sla.duration_value * unitMs;
    return Date.now() - deadline;
  };

  return (
    <div className="space-y-4">
      {/* Instance header — version + overall status + dates. */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-mono text-xs text-muted-foreground">{instance.workflow_version}</p>
            <p className="mt-0.5 font-medium text-foreground">
              Étape courante : {instance.current_etape?.name ?? instance.current_etape_code ?? '—'}
            </p>
          </div>
          <Badge variant="outline" className={cn('font-normal', STATUS_CLASS[instance.statut])}>
            {STATUS_LABELS[instance.statut]}
          </Badge>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
          <span>Démarré le {instance.started_at ? formatDate(instance.started_at) : '—'}</span>
          {instance.completed_at && <span>Terminé le {formatDate(instance.completed_at)}</span>}
        </div>
      </div>

      {/* Étapes — rich cards */}
      {versionEtapes.length > 0 ? (
        <div className="space-y-3">
          {versionEtapes.map((etape) => {
            const status = stepStatus(etape);
            const history = instanceHistory.filter((h) => h.etape_code === etape.code);
            const comments = instanceComments.filter((c) => c.etape_code === etape.code);
            // Livrables produced for this étape (those whose code it expects).
            const expectedCodes = new Set(
              (requirementsByEtape.get(etape.code) ?? [])
                .map((d) => d.deliverable_code)
                .filter(Boolean) as string[],
            );
            const stepDeliverables = instanceDeliverables.filter((d) =>
              expectedCodes.has(d.deliverable_code),
            );
            const startAt =
              stepStart(history, stepDeliverables, comments) ??
              (status === 'current' ? instance.started_at ?? undefined : undefined);
            const role = rolesByEtape.get(etape.code);
            return (
              <StepCard
                key={etape.id}
                etape={etape}
                status={status}
                statusLabel={stepStatusLabel(status)}
                roleLabels={role?.labels ?? []}
                responsibility={role?.responsibility}
                startAt={startAt}
                sla={slaByEtape.get(etape.code)}
                overdueMs={overdueForStep(etape, status, startAt)}
                requirements={buildRequirements(etape)}
                history={history}
                comments={comments}
                defaultOpen={status === 'current'}
                instanceId={instance.id}
                canComment={status === 'current' && instance.statut === 'EN_COURS'}
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

      {/* Livrables produced but not tied to a configured étape requirement. */}
      {orphanRequirements.length > 0 && (
        <section className="rounded-xl border border-border bg-card p-4">
          <SubHeading icon={FileCheck2} label={`Autres livrables (${orphanRequirements.length})`} />
          <ul className="mt-2 space-y-2">
            {orphanRequirements.map((r) => (
              <RequirementRow key={r.key} req={r} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
