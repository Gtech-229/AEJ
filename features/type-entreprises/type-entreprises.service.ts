import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type {
  CreateTypeEntreprisePayload,
  TypeEntreprise,
  UpdateTypeEntreprisePayload,
} from './type-entreprises.dto';

const BASE_URL = '/type-entreprises';

/** Responses are enveloped: { Message, data: … } — methods unwrap `data`. */
export const typeEntreprisesService = {
  getAll: async (client: ApiClient = apiClient): Promise<TypeEntreprise[]> => {
    const res = await client.request<{ data: TypeEntreprise[] }>(BASE_URL);
    return Array.isArray(res?.data) ? res.data : [];
  },

  create: async (
    payload: CreateTypeEntreprisePayload,
    client: ApiClient = apiClient,
  ): Promise<TypeEntreprise> => {
    const res = await client.request<{ data: TypeEntreprise }>(BASE_URL, {
      method: 'POST',
      body: payload,
    });
    return res.data;
  },

  update: async (
    payload: UpdateTypeEntreprisePayload,
    client: ApiClient = apiClient,
  ): Promise<TypeEntreprise> => {
    const { id, ...body } = payload;
    const res = await client.request<{ data: TypeEntreprise }>(`${BASE_URL}/${id}`, {
      method: 'PUT',
      body,
    });
    return res.data;
  },

  remove: (id: number, client: ApiClient = apiClient): Promise<void> =>
    client.request<void>(`${BASE_URL}/${id}`, { method: 'DELETE' }),
};
