'use client';

import { ChevronDown, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { EmptyState } from '@/components/generic/empty-state';
import { cn } from '@/lib/utils';
import type { WorkflowEtape } from './workflow.dto';
import {
  useWorkflowDecisionOutcomes,
  useWorkflowEtapeDecisions,
  useWorkflowEtapeDeliverables,
  useWorkflowEtapeRoles,
  useWorkflowEtapeSlas,
  useWorkflowRoles,
} from './workflow.hooks';

/** A labeled block inside an étape's expanded panel. */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}

/**
 * Read-only "process" view of a version's étapes as an accordion. Each step shows
 * order · name and expands to its configuration with **labeled** sections
 * (description, rôles responsables, délai, décisions, livrables) — no cryptic
 * icon rows. Built entirely from the live workflow config (no dossiers, no
 * actions) — the visual foundation the role-gated execution UI will render onto.
 */
export function WorkflowProcessBoard({
  ordered,
}: {
  ordered: { etape: WorkflowEtape; depth: number }[];
}) {
  const { data: etapeRoles } = useWorkflowEtapeRoles();
  const { data: etapeDecisions } = useWorkflowEtapeDecisions();
  const { data: etapeSlas } = useWorkflowEtapeSlas();
  const { data: etapeDeliverables } = useWorkflowEtapeDeliverables();
  const { data: roles } = useWorkflowRoles();
  const { data: outcomes } = useWorkflowDecisionOutcomes();

  const roleName = (code: string) => roles?.find((r) => r.code === code)?.name ?? code;
  const outcomeLabel = (code: string) => outcomes?.find((o) => o.code === code)?.label ?? code;

  if (ordered.length === 0) {
    return (
      <EmptyState
        variant="card"
        icon={Layers}
        title="Aucune étape"
        description="Cette version n'a pas encore d'étapes."
      />
    );
  }

  return (
    <ol className="space-y-2">
      {ordered.map(({ etape, depth }) => {
        const stepRoles = (etapeRoles ?? []).filter((r) => r.etape_code === etape.code);
        const stepDecisions = (etapeDecisions ?? []).filter((d) => d.etape_code === etape.code);
        const stepSla = (etapeSlas ?? []).find((s) => s.etape_code === etape.code);
        const stepDeliverables = (etapeDeliverables ?? []).filter((d) => d.etape_code === etape.code);
        const empty =
          !etape.description &&
          stepRoles.length === 0 &&
          stepDecisions.length === 0 &&
          stepDeliverables.length === 0 &&
          !stepSla;

        return (
          <li key={etape.id} style={{ marginLeft: depth * 20 }}>
            <Collapsible className="rounded-xl border border-border bg-card">
              <CollapsibleTrigger className="group flex w-full items-center gap-3 p-4 text-left">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {etape.order}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{etape.name}</p>
                  <p className="truncate font-mono text-xs text-muted-foreground">{etape.code}</p>
                </div>
                {stepSla && (
                  <Badge variant="outline" className="shrink-0 font-normal text-muted-foreground">
                    Délai · {stepSla.duration_value} {stepSla.duration_unit?.toLowerCase()}
                  </Badge>
                )}
                <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>

              <CollapsibleContent className="space-y-4 border-t border-border px-4 py-4">
                {etape.description && (
                  <Field label="Description">
                    <p className="text-sm text-muted-foreground">{etape.description}</p>
                  </Field>
                )}

                {stepRoles.length > 0 && (
                  <Field label="Rôles responsables">
                    <ul className="space-y-1">
                      {stepRoles.map((r) => (
                        <li key={r.id} className="text-sm">
                          <span className="font-medium text-foreground">{roleName(r.role_code)}</span>
                          {r.responsibility && (
                            <span className="text-muted-foreground"> — {r.responsibility}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </Field>
                )}

                {stepSla && (
                  <Field label="Délai (SLA)">
                    <p className="text-sm text-foreground">
                      {stepSla.duration_value} {stepSla.duration_unit?.toLowerCase()}
                    </p>
                  </Field>
                )}

                {stepDecisions.length > 0 && (
                  <Field label="Décisions">
                    <ul className="space-y-2">
                      {stepDecisions.map((d) => (
                        <li key={d.id}>
                          <p className="text-sm font-medium text-foreground">{d.name}</p>
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {(d.outcomes?.split('|').filter(Boolean) ?? []).map((o) => (
                              <Badge key={o} variant="outline" className="font-normal">
                                {outcomeLabel(o)}
                              </Badge>
                            ))}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </Field>
                )}

                {stepDeliverables.length > 0 && (
                  <Field label="Livrables attendus">
                    <ul className="space-y-1">
                      {stepDeliverables.map((d) => (
                        <li key={d.id} className="flex items-center gap-2 text-sm text-foreground">
                          <span>{d.name ?? d.deliverable_code}</span>
                          <Badge
                            variant="outline"
                            className={cn(
                              'font-normal',
                              d.is_required
                                ? 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                : 'text-muted-foreground',
                            )}
                          >
                            {d.is_required ? 'Obligatoire' : 'Facultatif'}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </Field>
                )}

                {empty && <p className="text-xs text-muted-foreground">Aucune configuration.</p>}
              </CollapsibleContent>
            </Collapsible>
          </li>
        );
      })}
    </ol>
  );
}
