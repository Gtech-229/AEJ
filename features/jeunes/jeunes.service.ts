import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type { CreateJeunePayload, Jeune, UpdateJeunePayload } from './jeunes.dto';

// TODO(backend): confirm the exact route (assumed /jeunes, no trailing slash).
const BASE_URL = '/jeunes';

/** Responses are enveloped: { Message, data: … } — methods unwrap `data`. */
export const jeunesService = {
  getAll: async (client: ApiClient = apiClient): Promise<Jeune[]> => {
    const res = await client.request<{ data: Jeune[] }>(BASE_URL);
    return Array.isArray(res?.data) ? res.data : [];
  },

  create: async (payload: CreateJeunePayload, client: ApiClient = apiClient): Promise<Jeune> => {
    const res = await client.request<{ data: Jeune }>(BASE_URL, { method: 'POST', body: payload });
    return res.data;
  },

  update: async (payload: UpdateJeunePayload, client: ApiClient = apiClient): Promise<Jeune> => {
    const res = await client.request<{ data: Jeune }>(`${BASE_URL}/${payload.id}`, {
      method: 'PUT',
      body: payload,
    });
    return res.data;
  },

  remove: (id: number, client: ApiClient = apiClient): Promise<void> =>
    client.request<void>(`${BASE_URL}/${id}`, { method: 'DELETE' }),
};
