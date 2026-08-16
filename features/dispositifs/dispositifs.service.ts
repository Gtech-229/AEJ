import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type {
  CreateDispositifPayload,
  Dispositif,
  UpdateDispositifPayload,
} from './dispositifs.dto';

const BASE_URL = '/dispositifs';

export const dispositifsService = {
  getAll: async (client: ApiClient = apiClient): Promise<Dispositif[]> => {
    const res = await client.request<{ data: Dispositif[] }>(BASE_URL);
    return Array.isArray(res?.data) ? res.data : [];
  },
  create: async (
    payload: CreateDispositifPayload,
    client: ApiClient = apiClient,
  ): Promise<Dispositif> => {
    const res = await client.request<{ data: Dispositif }>(BASE_URL, { method: 'POST', body: payload });
    return res.data;
  },
  update: async (
    { id, ...body }: UpdateDispositifPayload,
    client: ApiClient = apiClient,
  ): Promise<Dispositif> => {
    const res = await client.request<{ data: Dispositif }>(`${BASE_URL}/${id}`, {
      method: 'PUT',
      body,
    });
    return res.data;
  },
  remove: (id: number, client: ApiClient = apiClient): Promise<void> =>
    client.request<void>(`${BASE_URL}/${id}`, { method: 'DELETE' }),
};
