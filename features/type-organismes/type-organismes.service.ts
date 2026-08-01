import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type {
  CreateTypeOrganismePayload,
  TypeOrganisme,
  UpdateTypeOrganismePayload,
} from './type-organismes.dto';

const BASE_URL = '/type-organismes';

/** Responses are enveloped: { Message, data: … } — methods unwrap `data`. */
export const typeOrganismesService = {
  getAll: async (client: ApiClient = apiClient): Promise<TypeOrganisme[]> => {
    const res = await client.request<{ data: TypeOrganisme[] }>(BASE_URL);
    return Array.isArray(res?.data) ? res.data : [];
  },

  create: async (
    payload: CreateTypeOrganismePayload,
    client: ApiClient = apiClient,
  ): Promise<TypeOrganisme> => {
    const res = await client.request<{ data: TypeOrganisme }>(BASE_URL, {
      method: 'POST',
      body: payload,
    });
    return res.data;
  },

  update: async (
    payload: UpdateTypeOrganismePayload,
    client: ApiClient = apiClient,
  ): Promise<TypeOrganisme> => {
    const res = await client.request<{ data: TypeOrganisme }>(`${BASE_URL}/${payload.id}`, {
      method: 'PUT',
      body: payload,
    });
    return res.data;
  },

  remove: (id: number, client: ApiClient = apiClient): Promise<void> =>
    client.request<void>(`${BASE_URL}/${id}`, { method: 'DELETE' }),
};
