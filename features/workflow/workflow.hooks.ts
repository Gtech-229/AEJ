'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { workflowService } from './workflow.service';
import type { AdvanceWorkflowInput, WorkflowListParams } from './workflow.types';

export const workflowKeys = {
  all: ['workflow'] as const,
  lists: () => [...workflowKeys.all, 'list'] as const,
  list: (params: WorkflowListParams) => [...workflowKeys.lists(), params] as const,
};

export function useWorkflowList(params: WorkflowListParams = {}) {
  return useQuery({
    queryKey: workflowKeys.list(params),
    queryFn: () => workflowService.list(params),
  });
}

/** Fait avancer un lot de dossiers d'une étape à la suivante — pas de formulaire, action directe. */
export function useAdvanceWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AdvanceWorkflowInput) => workflowService.advance(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.all });
    },
  });
}
