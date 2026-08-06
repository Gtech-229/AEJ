import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type { CreateIndicateurSuiviPayload, IndicateurSuivi, UpdateIndicateurSuiviPayload } from './indicateur-suivis.dto';

// NB: endpoint /indicateur-suivis pas encore confirmé côté backend (module gelé) —
// comportement de repli calqué sur localites.service.ts en attendant.
const BASE_URL = '/indicateur-suivis';

const isDev = process.env.NODE_ENV !== 'production';

const SEED_INDICATEURSUIVIS: IndicateurSuivi[] = [
  { id: 1, indicateur: "Jeunes insérés", periode: "Juil. 2026", valeur: "3 640", evolution: "+180", statut: 'hausse' },
  { id: 2, indicateur: "Taux de remboursement", periode: "Juil. 2026", valeur: "28 %", evolution: "+1 %", statut: 'hausse' },
  { id: 3, indicateur: "Micro-projets financés", periode: "Juil. 2026", valeur: "94", evolution: "-4", statut: 'baisse' },
];

let devStore: IndicateurSuivi[] | null = null;
function store(): IndicateurSuivi[] {
  if (!devStore) devStore = [...SEED_INDICATEURSUIVIS];
  return devStore;
}

export const indicateurSuivisService = {
  getAll: async (client: ApiClient = apiClient): Promise<IndicateurSuivi[]> => {
    try {
      const res = await client.request<IndicateurSuivi[] | { data: IndicateurSuivi[] }>(BASE_URL);
      if (Array.isArray(res)) return res;
      if (res && Array.isArray((res as { data: IndicateurSuivi[] }).data)) {
        return (res as { data: IndicateurSuivi[] }).data;
      }
      return [];
    } catch (err) {
      if (isDev) return [...store()];
      throw err;
    }
  },

  create: async (payload: CreateIndicateurSuiviPayload, client: ApiClient = apiClient): Promise<IndicateurSuivi> => {
    try {
      return await client.request<IndicateurSuivi>(BASE_URL, { method: 'POST', body: payload });
    } catch (err) {
      if (isDev) {
        const created: IndicateurSuivi = {
          ...payload,
          evolution: payload.evolution ?? null,
          id: Date.now(),
        };
        store().unshift(created);
        return created;
      }
      throw err;
    }
  },

  update: async (payload: UpdateIndicateurSuiviPayload, client: ApiClient = apiClient): Promise<IndicateurSuivi> => {
    try {
      return await client.request<IndicateurSuivi>(`${BASE_URL}/${payload.id}`, { method: 'PUT', body: payload });
    } catch (err) {
      if (isDev) {
        devStore = store().map((x) => (x.id === payload.id ? payload : x));
        return payload;
      }
      throw err;
    }
  },

  remove: async (id: number, client: ApiClient = apiClient): Promise<void> => {
    try {
      await client.request<void>(`${BASE_URL}/${id}`, { method: 'DELETE' });
    } catch (err) {
      if (isDev) {
        devStore = store().filter((x) => x.id !== id);
        return;
      }
      throw err;
    }
  },
};
