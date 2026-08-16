import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type {
  CreateEntreprisePayload,
  Entreprise,
  UpdateEntreprisePayload,
} from './entreprises.dto';

const BASE_URL = '/entreprises';

/** Responses are enveloped: { message, data: … } — methods unwrap `data`. */
export const entreprisesService = {
  getAll: async (client: ApiClient = apiClient): Promise<Entreprise[]> => {
    const res = await client.request<{ data: Entreprise[] }>(BASE_URL);
    return Array.isArray(res?.data) ? res.data : [];
  },

  create: async (
    payload: CreateEntreprisePayload,
    client: ApiClient = apiClient,
  ): Promise<Entreprise> => {
    const res = await client.request<{ data: Entreprise }>(BASE_URL, {
      method: 'POST',
      body: payload,
    });
    return res.data;
  },

  update: async (
    payload: UpdateEntreprisePayload,
    client: ApiClient = apiClient,
  ): Promise<Entreprise> => {
    const { id, ...body } = payload;
    const res = await client.request<{ data: Entreprise }>(`${BASE_URL}/${id}`, {
      method: 'PUT',
      body,
    });
    return res.data;
  },

  remove: (id: number, client: ApiClient = apiClient): Promise<void> =>
    client.request<void>(`${BASE_URL}/${id}`, { method: 'DELETE' }),
};
