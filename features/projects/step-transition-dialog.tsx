'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { WorkflowEtape } from '@/features/workflows/workflow.dto';
import { useWorkflowEtapes } from '@/features/workflows/workflow.hooks';
import { useUpdateWorkflowInstance } from '@/features/workflow-instances/workflow-instances.hooks';

const etapeVersionCode = (e: WorkflowEtape) =>
  typeof e.workflow_version === 'string' ? e.workflow_version : e.workflow_version?.code;

/**
 * "Traiter l'étape" — interim step transition. Advances the dossier by writing
 * the chosen `current_etape_code` (PUT). Defaults to the next étape by order, but
 * any étape of the circuit can be picked (returns/corrections). This is the
 * placeholder until the decision-driven transition endpoint ships — no outcome,
 * no history is recorded here.
 */
export function StepTransitionDialog({
  open,
  onOpenChange,
  instanceId,
  workflowVersion,
  currentEtapeCode,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instanceId: number;
  workflowVersion: string;
  currentEtapeCode: string | null;
}) {
  const etapes = useWorkflowEtapes();
  const update = useUpdateWorkflowInstance();

  const versionEtapes = useMemo(
    () =>
      (etapes.data ?? [])
        .filter((e) => etapeVersionCode(e) === workflowVersion)
        .sort((a, b) => a.order - b.order),
    [etapes.data, workflowVersion],
  );

  const currentOrder = versionEtapes.find((e) => e.code === currentEtapeCode)?.order ?? -1;
  const defaultNext = versionEtapes.find((e) => e.order > currentOrder)?.code ?? '';

  const [target, setTarget] = useState('');
  useEffect(() => {
    if (open) setTarget(defaultNext);
  }, [open, defaultNext]);

  const submit = () => {
    if (!target) return;
    update.mutate(
      { id: instanceId, current_etape_code: target },
      {
        onSuccess: () => {
          toast.success('Étape mise à jour.');
          onOpenChange(false);
        },
        onError: () => toast.error("Échec de la mise à jour de l'étape."),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Traiter l&apos;étape</DialogTitle>
          <DialogDescription>
            Faire avancer le dossier vers une autre étape du circuit.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5 py-2">
          <Label className="text-xs text-muted-foreground">Étape cible</Label>
          <Select value={target} onValueChange={setTarget} disabled={versionEtapes.length === 0}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choisir l'étape" />
            </SelectTrigger>
            <SelectContent>
              {versionEtapes.map((e) => (
                <SelectItem key={e.code} value={e.code}>
                  {e.order}. {e.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Annuler</Button>
          </DialogClose>
          <Button disabled={!target || update.isPending} onClick={submit}>
            {update.isPending ? 'Envoi…' : 'Valider'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
