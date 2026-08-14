import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type {
  CreateMegaProjetPayload,
  MegaProjet,
  UpdateMegaProjetPayload,
} from './mega-projets.dto';

const BASE_URL = '/mega-projets';

export const megaProjetsService = {
  getAll: async (client: ApiClient = apiClient): Promise<MegaProjet[]> => {
    const res = await client.request<{ data: MegaProjet[] }>(BASE_URL);
    return Array.isArray(res?.data) ? res.data : [];
  },
  create: async (
    payload: CreateMegaProjetPayload,
    client: ApiClient = apiClient,
  ): Promise<MegaProjet> => {
    const res = await client.request<{ data: MegaProjet }>(BASE_URL, { method: 'POST', body: payload });
    return res.data;
  },
  update: async (
    { id, ...body }: UpdateMegaProjetPayload,
    client: ApiClient = apiClient,
  ): Promise<MegaProjet> => {
    const res = await client.request<{ data: MegaProjet }>(`${BASE_URL}/${id}`, {
      method: 'PUT',
      body,
    });
    return res.data;
  },
  remove: (id: number, client: ApiClient = apiClient): Promise<void> =>
    client.request<void>(`${BASE_URL}/${id}`, { method: 'DELETE' }),
};
