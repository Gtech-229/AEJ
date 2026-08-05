import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type { Projet } from './projects.dto';

const BASE_URL = '/projets';

/**
 * Responses are enveloped: { message, data: [...] }.
 *
 * `/projects` is currently **unpaginated** and does **not** honor `?promoteur_id=`
 * yet, so we fetch the whole list once (shared cache) and derive each promoteur's
 * projects client-side — see `useProjectsByPromoteur`. When the backend ships the
 * filter (and pagination), replace this with a scoped fetch:
 *
 *   getByPromoteur: (id, client = apiClient) =>
 *     client.request<{ data: Projet[] }>(`/projects?promoteur_id=${id}`)
 *       .then((r) => r.data ?? []);
 *   // or the nested route `/promoteurs/${id}/projects`
 */
export const projectsService = {
  getAll: async (client: ApiClient = apiClient): Promise<Projet[]> => {
    const res = await client.request<{ data: Projet[] }>(BASE_URL);
    return Array.isArray(res?.data) ? res.data : [];
  },
};
