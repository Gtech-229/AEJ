import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type {
  CreateIndicateurPayload,
  CreateIndicateurSuiviPayload,
  Indicateur,
  IndicateurSuivi,
  UpdateIndicateurPayload,
} from './indicateurs.dto';

const BASE_URL = '/indicateurs';
// Values live under a FLAT resource `/indicateur-suivis` (verified live 2026-08):
// create takes `{ indicateur_id, valeur }`; the list isn't filtered server-side.
const SUIVI_URL = '/indicateur-suivis';

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

  // ── Renseignement (indicateur-suivis) ─────────────────────────────────────
  // The list endpoint returns all values (no server-side filter), so scope to
  // the indicateur client-side.
  listSuivi: async (indicateurId: number, client: ApiClient = apiClient): Promise<IndicateurSuivi[]> => {
    const res = await client.request<{ data: IndicateurSuivi[] }>(SUIVI_URL);
    const all = Array.isArray(res?.data) ? res.data : [];
    return all.filter((s) => s.indicateur_id === indicateurId);
  },

  addValeur: async (
    payload: CreateIndicateurSuiviPayload,
    client: ApiClient = apiClient,
  ): Promise<IndicateurSuivi> => {
    const res = await client.request<{ data: IndicateurSuivi }>(SUIVI_URL, {
      method: 'POST',
      body: payload,
    });
    return res.data;
  },
};
