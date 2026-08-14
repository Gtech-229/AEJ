import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type {
  CreateDispositifPayload,
  Dispositif,
  UpdateDispositifPayload,
} from './dispositifs.dto';

// NB: assumed from the /type-organismes and /fonctions convention (no trailing
// slash). Not yet confirmed against Postman — adjust if the backend differs.
const BASE_URL = '/dispositifs';

/** Responses are enveloped: { Message, data: … } — methods unwrap `data`. */
export const dispositifsService = {
  getAll: async (client: ApiClient = apiClient): Promise<Dispositif[]> => {
    const res = await client.request<{ data: Dispositif[] }>(BASE_URL);
    return Array.isArray(res?.data) ? res.data : [];
  },

  create: async (
    payload: CreateDispositifPayload,
    client: ApiClient = apiClient,
  ): Promise<Dispositif> => {
    const res = await client.request<{ data: Dispositif }>(BASE_URL, {
      method: 'POST',
      body: payload,
    });
    return res.data;
  },

  update: async (
    payload: UpdateDispositifPayload,
    client: ApiClient = apiClient,
  ): Promise<Dispositif> => {
    const res = await client.request<{ data: Dispositif }>(`${BASE_URL}/${payload.id}`, {
      method: 'PUT',
      body: payload,
    });
    return res.data;
  },

  remove: (id: number, client: ApiClient = apiClient): Promise<void> =>
    client.request<void>(`${BASE_URL}/${id}`, { method: 'DELETE' }),
};
