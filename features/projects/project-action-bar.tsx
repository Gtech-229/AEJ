'use client';

import { toast } from 'sonner';
import { CheckCircle2, Lock, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Projet } from './projects.dto';
import { useProjectWorkflow } from './use-project-workflow';

const TERMINAL_LABEL: Record<string, string> = {
  TERMINE: 'terminé',
  REJETE: 'rejeté',
  ABANDONNE: 'abandonné',
};

/**
 * Sticky footer bar for the 360° — the dossier's next action. Shows the current
 * étape + the role it awaits, and the primary CTA to act on it. The CTA is gated
 * by `canActOnCurrentStep`: disabled with a reason until `/me` carries the user's
 * workflow role (backend P0), enabled the moment the rule resolves to `allowed`.
 * Renders nothing when the dossier has no workflow instance.
 */
export function ProjectActionBar({ projet }: { projet: Projet }) {
  const wf = useProjectWorkflow(projet);


  if (wf.isLoading || !wf.instance) return null;

  console.log("About the workflow", wf)

  const terminal = wf.status !== 'EN_COURS';
  const gate = wf.gate;
  const allowed = gate?.state === 'allowed';
  const reason = gate && gate.state !== 'allowed' ? gate.reason : undefined;

  return (
    <div className="sticky bottom-0 z-20 -mx-6 border-t border-border bg-background/95 px-6 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          {/* <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Étape courante</p>
          <p className="truncate text-sm font-medium text-foreground">
            {wf.currentEtape?.name ?? wf.instance.current_etape_code ?? '—'}
          </p> */}
          {!terminal && wf.responsibleRoleLabels.length > 0 && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              Responsable(s) {' '}
              <span className="font-medium text-primary">
                {wf.responsibleRoleLabels.join(', ')}
              </span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {terminal ? (
            <Badge
              variant="outline"
              className="gap-1 border-success/30 bg-success/10 font-normal text-success"
            >
              <CheckCircle2 className="size-3.5" />
              Dossier {TERMINAL_LABEL[wf.status ?? ''] ?? 'clôturé'}
            </Badge>
          ) : (
            <>
              {/* {reason && (
                <span className="hidden max-w-xs items-center gap-1.5 text-right text-xs text-muted-foreground sm:flex">
                  {gate?.state === 'unavailable' ? (
                    <Lock className="size-3.5 shrink-0" />
                  ) : (
                    <ShieldAlert className="size-3.5 shrink-0" />
                  )}
                  {reason}
                </span>
              )} */}
              {/* Enabled by the authorization gate. The transition WRITE endpoint
                  is still pending (backend P0), so an allowed click explains that
                  rather than posting — swap the handler in once it ships. */}
              <Button
                disabled={!allowed}
                className="cursor-pointer"
                // onClick={() =>
                //   toast.info("Le traitement de l'étape sera bientôt disponible.")
                // }
              >
                Traiter l'étape
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
