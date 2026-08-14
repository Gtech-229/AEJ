import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type {
  CreateEmploiPrevuPayload,
  EmploiPrevu,
  UpdateEmploiPrevuPayload,
} from './emplois-prevus.dto';

// NB: assumed from the /type-organismes convention (no trailing slash). Not
// yet confirmed against Postman/backend routes — adjust if it differs.
const BASE_URL = '/emplois-prevus';

/** Responses are enveloped: { Message, data: … } — methods unwrap `data`. */
export const emploisPrevusService = {
  getAll: async (client: ApiClient = apiClient): Promise<EmploiPrevu[]> => {
    const res = await client.request<{ data: EmploiPrevu[] }>(BASE_URL);
    return Array.isArray(res?.data) ? res.data : [];
  },

  create: async (
    payload: CreateEmploiPrevuPayload,
    client: ApiClient = apiClient,
  ): Promise<EmploiPrevu> => {
    const res = await client.request<{ data: EmploiPrevu }>(BASE_URL, {
      method: 'POST',
      body: payload,
    });
    return res.data;
  },

  update: async (
    payload: UpdateEmploiPrevuPayload,
    client: ApiClient = apiClient,
  ): Promise<EmploiPrevu> => {
    const res = await client.request<{ data: EmploiPrevu }>(`${BASE_URL}/${payload.id}`, {
      method: 'PUT',
      body: payload,
    });
    return res.data;
  },

  remove: (id: number, client: ApiClient = apiClient): Promise<void> =>
    client.request<void>(`${BASE_URL}/${id}`, { method: 'DELETE' }),
};
