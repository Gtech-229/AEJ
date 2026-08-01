import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type { CreateFonctionPayload, Fonction, UpdateFonctionPayload } from './fonctions.dto';

// NB: confirmé via la doc Postman officielle — SANS trailing slash, contrairement
// à /users/ qui en a un. Vérifié en testant réellement /api/fonctions/{id}.
const BASE_URL = '/fonctions';

/** Responses are enveloped: { Message, data: … } — methods unwrap `data`. */
export const fonctionsService = {
  getAll: async (client: ApiClient = apiClient): Promise<Fonction[]> => {
    const res = await client.request<{ data: Fonction[] }>(BASE_URL);
    return Array.isArray(res?.data) ? res.data : [];
  },

  create: async (
    payload: CreateFonctionPayload,
    client: ApiClient = apiClient,
  ): Promise<Fonction> => {
    const res = await client.request<{ data: Fonction }>(BASE_URL, {
      method: 'POST',
      body: payload,
    });
    return res.data;
  },

  update: async (
    payload: UpdateFonctionPayload,
    client: ApiClient = apiClient,
  ): Promise<Fonction> => {
    const res = await client.request<{ data: Fonction }>(`${BASE_URL}/${payload.id}`, {
      method: 'PUT',
      body: payload,
    });
    return res.data;
  },

  remove: (id: number, client: ApiClient = apiClient): Promise<void> =>
    client.request<void>(`${BASE_URL}/${id}`, { method: 'DELETE' }),
};
