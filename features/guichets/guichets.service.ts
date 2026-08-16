import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type { CreateGuichetPayload, Guichet, UpdateGuichetPayload } from './guichets.dto';

const BASE_URL = '/guichets';

export const guichetsService = {
  getAll: async (client: ApiClient = apiClient): Promise<Guichet[]> => {
    const res = await client.request<{ data: Guichet[] }>(BASE_URL);
    return Array.isArray(res?.data) ? res.data : [];
  },
  create: async (payload: CreateGuichetPayload, client: ApiClient = apiClient): Promise<Guichet> => {
    const res = await client.request<{ data: Guichet }>(BASE_URL, { method: 'POST', body: payload });
    return res.data;
  },
  update: async (
    { id, ...body }: UpdateGuichetPayload,
    client: ApiClient = apiClient,
  ): Promise<Guichet> => {
    const res = await client.request<{ data: Guichet }>(`${BASE_URL}/${id}`, {
      method: 'PUT',
      body,
    });
    return res.data;
  },
  remove: (id: number, client: ApiClient = apiClient): Promise<void> =>
    client.request<void>(`${BASE_URL}/${id}`, { method: 'DELETE' }),
};
