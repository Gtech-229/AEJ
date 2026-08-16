'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/auth.context';
import type {
  CreateWorkflowInstanceCommentPayload,
  CreateWorkflowInstanceDeliverablePayload,
} from './workflow-instances.dto';
import { workflowInstancesKeys } from './workflow-instances.keys';
import { workflowInstancesService } from './workflow-instances.service';

/** Today as `YYYY-MM-DD` (the API's date-only convention for these writes). */
const today = () => new Date().toISOString().slice(0, 10);

export function useWorkflowInstances() {
  return useQuery({
    queryKey: workflowInstancesKeys.instances(),
    queryFn: () => workflowInstancesService.getInstances(),
  });
}

/** Single instance with embedded history / deliverables / comments. */
export function useWorkflowInstance(id: number | undefined) {
  return useQuery({
    queryKey: workflowInstancesKeys.instance(id ?? 0),
    queryFn: () => workflowInstancesService.getInstance(id as number),
    enabled: id != null,
  });
}

export function useWorkflowInstanceHistories() {
  return useQuery({
    queryKey: workflowInstancesKeys.histories(),
    queryFn: () => workflowInstancesService.getHistories(),
  });
}

export function useWorkflowInstanceDeliverables() {
  return useQuery({
    queryKey: workflowInstancesKeys.deliverables(),
    queryFn: () => workflowInstancesService.getDeliverables(),
  });
}

export function useWorkflowInstanceComments() {
  return useQuery({
    queryKey: workflowInstancesKeys.comments(),
    queryFn: () => workflowInstancesService.getComments(),
  });
}

// ── Writes ────────────────────────────────────────────────────────────────
type NewComment = Omit<CreateWorkflowInstanceCommentPayload, 'commented_by_id' | 'created_at'>;
type NewDeliverable = Omit<CreateWorkflowInstanceDeliverablePayload, 'produced_by_id' | 'produced_at'>;

/** Add a comment to a step. Fills author from the session + date = today. */
export function useAddWorkflowInstanceComment() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (input: NewComment) =>
      workflowInstancesService.createComment({
        ...input,
        commented_by_id: user?.id as number,
        created_at: today(),
      }),
    onSuccess: (_data, input) => {
      qc.invalidateQueries({ queryKey: workflowInstancesKeys.instance(input.workflow_instance_id) });
      qc.invalidateQueries({ queryKey: workflowInstancesKeys.comments() });
    },
  });
}

/** Record a produced livrable (by stored file path). Fills producer + date. */
export function useAddWorkflowInstanceDeliverable() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (input: NewDeliverable) =>
      workflowInstancesService.createDeliverable({
        ...input,
        produced_by_id: user?.id as number,
        produced_at: today(),
      }),
    onSuccess: (_data, input) => {
      qc.invalidateQueries({ queryKey: workflowInstancesKeys.instance(input.workflow_instance_id) });
      qc.invalidateQueries({ queryKey: workflowInstancesKeys.deliverables() });
    },
  });
}
