import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type {
  CreateOrganismePayload,
  Organisme,
  UpdateOrganismePayload,
} from './organismes.dto';

const BASE_URL = '/organismes';

/** Responses are enveloped: { Message, data: … } — methods unwrap `data`. */
export const organismesService = {
  getAll: async (client: ApiClient = apiClient): Promise<Organisme[]> => {
    const res = await client.request<{ data: Organisme[] }>(BASE_URL);
    return Array.isArray(res?.data) ? res.data : [];
  },

  create: async (
    payload: CreateOrganismePayload,
    client: ApiClient = apiClient,
  ): Promise<Organisme> => {
    const res = await client.request<{ data: Organisme }>(BASE_URL, {
      method: 'POST',
      body: payload,
    });
    return res.data;
  },

  update: async (
    payload: UpdateOrganismePayload,
    client: ApiClient = apiClient,
  ): Promise<Organisme> => {
    const res = await client.request<{ data: Organisme }>(`${BASE_URL}/${payload.id}`, {
      method: 'PUT',
      body: payload,
    });
    return res.data;
  },

  remove: (id: number, client: ApiClient = apiClient): Promise<void> =>
    client.request<void>(`${BASE_URL}/${id}`, { method: 'DELETE' }),
};
