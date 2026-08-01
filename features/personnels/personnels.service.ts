import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type {
  CreatePersonnelPayload,
  Personnel,
  UpdatePersonnelPayload,
} from './personnels.dto';

// NB: confirmé via la doc Postman officielle — SANS trailing slash (comme
// /api/fonctions ; /api/localites fait exception avec un slash final).
const BASE_URL = '/personnels';

/** Responses are enveloped: { Message, data: … } — methods unwrap `data`. */
export const personnelsService = {
  getAll: async (client: ApiClient = apiClient): Promise<Personnel[]> => {
    const res = await client.request<{ data: Personnel[] }>(BASE_URL);
    return Array.isArray(res?.data) ? res.data : [];
  },

  create: async (
    payload: CreatePersonnelPayload,
    client: ApiClient = apiClient,
  ): Promise<Personnel> => {
    const res = await client.request<{ data: Personnel }>(BASE_URL, {
      method: 'POST',
      body: payload,
    });
    return res.data;
  },

  update: async (
    payload: UpdatePersonnelPayload,
    client: ApiClient = apiClient,
  ): Promise<Personnel> => {
    const res = await client.request<{ data: Personnel }>(`${BASE_URL}/${payload.id}`, {
      method: 'PUT',
      body: payload,
    });
    return res.data;
  },

  remove: (id: number, client: ApiClient = apiClient): Promise<void> =>
    client.request<void>(`${BASE_URL}/${id}`, { method: 'DELETE' }),
};
