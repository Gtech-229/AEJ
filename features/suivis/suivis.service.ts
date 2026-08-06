import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type { CreateSuiviPayload, Suivi, UpdateSuiviPayload } from './suivis.dto';

// NB: endpoint /suivis pas encore confirmé côté backend (module gelé) —
// comportement de repli calqué sur localites.service.ts en attendant.
const BASE_URL = '/suivis';

const isDev = process.env.NODE_ENV !== 'production';

const SEED_SUIVIS: Suivi[] = [
  { id: 1, projet: "Élevage avicole Bouaké", agent: "N'Guessan A.", dateVisite: "2026-07-12", type: "Trimestrielle", statut: 'realisee' },
  { id: 2, projet: "Atelier couture Yopougon", agent: "Koné S.", dateVisite: "2026-07-18", type: "Ponctuelle", statut: 'realisee' },
  { id: 3, projet: "Transformation manioc", agent: "Bamba I.", dateVisite: "2026-08-02", type: "Trimestrielle", statut: 'retard' },
  { id: 4, projet: "Élevage porcin San Pedro", agent: "N'Guessan A.", dateVisite: "2026-08-10", type: "Trimestrielle", statut: 'planifiee' },
];

let devStore: Suivi[] | null = null;
function store(): Suivi[] {
  if (!devStore) devStore = [...SEED_SUIVIS];
  return devStore;
}

export const suivisService = {
  getAll: async (client: ApiClient = apiClient): Promise<Suivi[]> => {
    try {
      const res = await client.request<Suivi[] | { data: Suivi[] }>(BASE_URL);
      if (Array.isArray(res)) return res;
      if (res && Array.isArray((res as { data: Suivi[] }).data)) {
        return (res as { data: Suivi[] }).data;
      }
      return [];
    } catch (err) {
      if (isDev) return [...store()];
      throw err;
    }
  },

  create: async (payload: CreateSuiviPayload, client: ApiClient = apiClient): Promise<Suivi> => {
    try {
      return await client.request<Suivi>(BASE_URL, { method: 'POST', body: payload });
    } catch (err) {
      if (isDev) {
        const created: Suivi = {
          ...payload,

          id: Date.now(),
        };
        store().unshift(created);
        return created;
      }
      throw err;
    }
  },

  update: async (payload: UpdateSuiviPayload, client: ApiClient = apiClient): Promise<Suivi> => {
    try {
      return await client.request<Suivi>(`${BASE_URL}/${payload.id}`, { method: 'PUT', body: payload });
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
