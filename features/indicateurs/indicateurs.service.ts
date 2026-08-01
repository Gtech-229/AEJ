import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type {
  CreateIndicateurPayload,
  CreateIndicateurSuiviPayload,
  Indicateur,
  IndicateurSuivi,
  UpdateIndicateurPayload,
} from './indicateurs.dto';

// TODO(backend): confirm routes (assumed /indicateurs, values nested under
// /indicateurs/{id}/suivi) + the { Message, data } envelope.
const BASE_URL = '/indicateurs';

/** Responses are enveloped: { Message, data: … } — methods unwrap `data`. */
export const indicateursService = {
  getAll: async (client: ApiClient = apiClient): Promise<Indicateur[]> => {
    const res = await client.request<{ data: Indicateur[] }>(BASE_URL);
    return Array.isArray(res?.data) ? res.data : [];
  },

  create: async (
    payload: CreateIndicateurPayload,
    client: ApiClient = apiClient,
  ): Promise<Indicateur> => {
    const res = await client.request<{ data: Indicateur }>(BASE_URL, {
      method: 'POST',
      body: payload,
    });
    return res.data;
  },

  update: async (
    payload: UpdateIndicateurPayload,
    client: ApiClient = apiClient,
  ): Promise<Indicateur> => {
    const res = await client.request<{ data: Indicateur }>(`${BASE_URL}/${payload.id}`, {
      method: 'PUT',
      body: payload,
    });
    return res.data;
  },

  remove: (id: number, client: ApiClient = apiClient): Promise<void> =>
    client.request<void>(`${BASE_URL}/${id}`, { method: 'DELETE' }),

  // ── Renseignement (indicateurs_suivi) ─────────────────────────────────────
  listSuivi: async (indicateurId: number, client: ApiClient = apiClient): Promise<IndicateurSuivi[]> => {
    const res = await client.request<{ data: IndicateurSuivi[] }>(`${BASE_URL}/${indicateurId}/suivi`);
    return Array.isArray(res?.data) ? res.data : [];
  },

  addValeur: async (
    indicateurId: number,
    payload: CreateIndicateurSuiviPayload,
    client: ApiClient = apiClient,
  ): Promise<IndicateurSuivi> => {
    const res = await client.request<{ data: IndicateurSuivi }>(`${BASE_URL}/${indicateurId}/suivi`, {
      method: 'POST',
      body: payload,
    });
    return res.data;
  },
};
