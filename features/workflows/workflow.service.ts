import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type {
  CreateWorkflowDecisionOutcomePayload,
  CreateWorkflowDeliverablePayload,
  CreateWorkflowEtapeDecisionPayload,
  CreateWorkflowEtapeDeliverablePayload,
  CreateWorkflowEtapePayload,
  CreateWorkflowEtapeRolePayload,
  CreateWorkflowEtapeSlaPayload,
  CreateWorkflowModelPayload,
  CreateWorkflowRolePayload,
  CreateWorkflowVersionPayload,
  UpdateWorkflowDecisionOutcomePayload,
  UpdateWorkflowDeliverablePayload,
  UpdateWorkflowEtapeDecisionPayload,
  UpdateWorkflowEtapeDeliverablePayload,
  UpdateWorkflowEtapePayload,
  UpdateWorkflowEtapeRolePayload,
  UpdateWorkflowEtapeSlaPayload,
  UpdateWorkflowModelPayload,
  UpdateWorkflowRolePayload,
  UpdateWorkflowVersionPayload,
  WorkflowDecisionOutcome,
  WorkflowDeliverable,
  WorkflowEtape,
  WorkflowEtapeDecision,
  WorkflowEtapeDeliverable,
  WorkflowEtapeRole,
  WorkflowEtapeSla,
  WorkflowModel,
  WorkflowRole,
  WorkflowVersion,
} from './workflow.dto';

/**
 * Enveloped CRUD ({ Message|message, data }) for a `/workflow/*` resource. The
 * update strips `id` (it targets the URL). Reused for every workflow entity.
 */
function crud<T, C, U extends { id: number }>(path: string) {
  return {
    getAll: async (client: ApiClient = apiClient): Promise<T[]> => {
      const res = await client.request<{ data: T[] }>(path);
      return Array.isArray(res?.data) ? res.data : [];
    },
    create: async (payload: C, client: ApiClient = apiClient): Promise<T> => {
      const res = await client.request<{ data: T }>(path, { method: 'POST', body: payload });
      return res.data;
    },
    update: async (payload: U, client: ApiClient = apiClient): Promise<T> => {
      const { id, ...body } = payload;
      const res = await client.request<{ data: T }>(`${path}/${id}`, { method: 'PUT', body });
      return res.data;
    },
    remove: (id: number, client: ApiClient = apiClient): Promise<void> =>
      client.request<void>(`${path}/${id}`, { method: 'DELETE' }),
  };
}

export const workflowModelsService = crud<
  WorkflowModel,
  CreateWorkflowModelPayload,
  UpdateWorkflowModelPayload
>('/workflow/models');

export const workflowVersionsService = crud<
  WorkflowVersion,
  CreateWorkflowVersionPayload,
  UpdateWorkflowVersionPayload
>('/workflow/versions');

/**
 * Roles were unified into a single table, served from `/roles` (was
 * `/workflow/roles`) — `role.code` is the one source for RBAC + workflow. The
 * canonical row labels with `libelle`, while all the workflow code/UI reads
 * `name`, so this service maps `libelle`⇄`name` at the boundary and leaves the
 * `WorkflowRole` type and every consumer unchanged.
 */
type RawRole = {
  id: number;
  code: string;
  name?: string | null;
  libelle?: string | null;
  description?: string | null;
  is_active?: boolean;
};
const toWorkflowRole = (r: RawRole): WorkflowRole => ({
  id: r.id,
  code: r.code,
  name: r.name ?? r.libelle ?? r.code,
  description: r.description ?? null,
  is_active: r.is_active ?? true,
});
const toRolePayload = (p: { code: string; name: string; description?: string }) => ({
  code: p.code,
  libelle: p.name,
  description: p.description,
});

export const workflowRolesService = {
  getAll: async (client: ApiClient = apiClient): Promise<WorkflowRole[]> => {
    const res = await client.request<{ data: RawRole[] }>('/roles');
    return (Array.isArray(res?.data) ? res.data : []).map(toWorkflowRole);
  },
  create: async (
    payload: CreateWorkflowRolePayload,
    client: ApiClient = apiClient,
  ): Promise<WorkflowRole> => {
    const res = await client.request<{ data: RawRole }>('/roles', {
      method: 'POST',
      body: toRolePayload(payload),
    });
    return toWorkflowRole(res.data);
  },
  update: async (
    payload: UpdateWorkflowRolePayload,
    client: ApiClient = apiClient,
  ): Promise<WorkflowRole> => {
    const { id, ...rest } = payload;
    const res = await client.request<{ data: RawRole }>(`/roles/${id}`, {
      method: 'PUT',
      body: toRolePayload(rest),
    });
    return toWorkflowRole(res.data);
  },
  remove: (id: number, client: ApiClient = apiClient): Promise<void> =>
    client.request<void>(`/roles/${id}`, { method: 'DELETE' }),
};

export const workflowDeliverablesService = crud<
  WorkflowDeliverable,
  CreateWorkflowDeliverablePayload,
  UpdateWorkflowDeliverablePayload
>('/workflow/deliverables');

export const workflowDecisionOutcomesService = crud<
  WorkflowDecisionOutcome,
  CreateWorkflowDecisionOutcomePayload,
  UpdateWorkflowDecisionOutcomePayload
>('/workflow/decision-outcomes');

export const workflowEtapesService = crud<
  WorkflowEtape,
  CreateWorkflowEtapePayload,
  UpdateWorkflowEtapePayload
>('/workflow/etapes');

export const workflowEtapeSlasService = crud<
  WorkflowEtapeSla,
  CreateWorkflowEtapeSlaPayload,
  UpdateWorkflowEtapeSlaPayload
>('/workflow/etape-slas');

export const workflowEtapeDeliverablesService = crud<
  WorkflowEtapeDeliverable,
  CreateWorkflowEtapeDeliverablePayload,
  UpdateWorkflowEtapeDeliverablePayload
>('/workflow/etape-deliverables');

export const workflowEtapeRolesService = crud<
  WorkflowEtapeRole,
  CreateWorkflowEtapeRolePayload,
  UpdateWorkflowEtapeRolePayload
>('/workflow/etape-roles');

export const workflowEtapeDecisionsService = crud<
  WorkflowEtapeDecision,
  CreateWorkflowEtapeDecisionPayload,
  UpdateWorkflowEtapeDecisionPayload
>('/workflow/etape-decisions');
