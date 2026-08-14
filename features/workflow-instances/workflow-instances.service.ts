import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type {
  WorkflowInstance,
  WorkflowInstanceComment,
  WorkflowInstanceDeliverable,
  WorkflowInstanceHistory,
} from './workflow-instances.dto';

const BASE = '/workflow-instances';

/** Enveloped list: { message, data: [...] } — `data` is the array either way. */
async function getList<T>(url: string, client: ApiClient): Promise<T[]> {
  const res = await client.request<{ data: T[] }>(url);
  return Array.isArray(res?.data) ? res.data : [];
}

/**
 * Read-only accessors for the workflow runtime. The endpoints don't scope by
 * micro_projet_id / workflow_instance_id yet, so callers fetch and filter
 * client-side (see backend-asks).
 */
export const workflowInstancesService = {
  getInstances: (client: ApiClient = apiClient) =>
    getList<WorkflowInstance>(`${BASE}/instances`, client),
  getHistories: (client: ApiClient = apiClient) =>
    getList<WorkflowInstanceHistory>(`${BASE}/histories`, client),
  getDeliverables: (client: ApiClient = apiClient) =>
    getList<WorkflowInstanceDeliverable>(`${BASE}/deliverables`, client),
  getComments: (client: ApiClient = apiClient) =>
    getList<WorkflowInstanceComment>(`${BASE}/comments`, client),
};
