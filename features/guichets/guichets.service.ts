import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type { CreateGuichetPayload, Guichet, UpdateGuichetPayload } from './guichets.dto';

// NB: assumed from the /type-organismes and /fonctions convention (no trailing
// slash). Not yet confirmed against Postman — adjust if the backend differs.
const BASE_URL = '/guichets';

/** Responses are enveloped: { Message, data: … } — methods unwrap `data`. */
export const guichetsService = {
  getAll: async (client: ApiClient = apiClient): Promise<Guichet[]> => {
    const res = await client.request<{ data: Guichet[] }>(BASE_URL);
    return Array.isArray(res?.data) ? res.data : [];
  },

  create: async (
    payload: CreateGuichetPayload,
    client: ApiClient = apiClient,
  ): Promise<Guichet> => {
    const res = await client.request<{ data: Guichet }>(BASE_URL, {
      method: 'POST',
      body: payload,
    });
    return res.data;
  },

  update: async (
    payload: UpdateGuichetPayload,
    client: ApiClient = apiClient,
  ): Promise<Guichet> => {
    const res = await client.request<{ data: Guichet }>(`${BASE_URL}/${payload.id}`, {
      method: 'PUT',
      body: payload,
    });
    return res.data;
  },

  remove: (id: number, client: ApiClient = apiClient): Promise<void> =>
    client.request<void>(`${BASE_URL}/${id}`, { method: 'DELETE' }),
};
