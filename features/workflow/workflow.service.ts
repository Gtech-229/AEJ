import { apiClient } from '@/lib/api/client';
import type { AdvanceWorkflowInput, DossierWorkflow, WorkflowListParams } from './workflow.types';

const BASE_URL = '/workflow';

function toQueryString(params: WorkflowListParams = {}): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export const workflowService = {
  list: (params: WorkflowListParams = {}): Promise<DossierWorkflow[]> =>
    apiClient.get<DossierWorkflow[]>(`${BASE_URL}${toQueryString(params)}`),
  advance: (input: AdvanceWorkflowInput): Promise<void> =>
    apiClient.post<void>(`${BASE_URL}/advance`, input),
};
