import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type { CreateIndicateurPayload, Indicateur, UpdateIndicateurPayload } from './indicateurs.dto';

// NB: endpoint /indicateurs pas encore confirmé côté backend (module gelé) —
// comportement de repli calqué sur localites.service.ts en attendant.
const BASE_URL = '/indicateurs';

const isDev = process.env.NODE_ENV !== 'production';

const SEED_INDICATEURS: Indicateur[] = [
  { id: 1, nom: "Jeunes insérés", cible: "5 000", valeurActuelle: "3 640", ecart: "-1 360", statut: 'dessous' },
  { id: 2, nom: "Micro-projets financés", cible: "150", valeurActuelle: "94", ecart: "-56", statut: 'dessous' },
  { id: 3, nom: "Taux de remboursement", cible: "25 %", valeurActuelle: "28 %", ecart: "+3 %", statut: 'atteinte' },
  { id: 4, nom: "Femmes bénéficiaires", cible: "40 %", valeurActuelle: "44 %", ecart: "+4 %", statut: 'atteinte' },
];

let devStore: Indicateur[] | null = null;
function store(): Indicateur[] {
  if (!devStore) devStore = [...SEED_INDICATEURS];
  return devStore;
}

export const indicateursService = {
  getAll: async (client: ApiClient = apiClient): Promise<Indicateur[]> => {
    try {
      const res = await client.request<Indicateur[] | { data: Indicateur[] }>(BASE_URL);
      if (Array.isArray(res)) return res;
      if (res && Array.isArray((res as { data: Indicateur[] }).data)) {
        return (res as { data: Indicateur[] }).data;
      }
      return [];
    } catch (err) {
      if (isDev) return [...store()];
      throw err;
    }
  },

  create: async (payload: CreateIndicateurPayload, client: ApiClient = apiClient): Promise<Indicateur> => {
    try {
      return await client.request<Indicateur>(BASE_URL, { method: 'POST', body: payload });
    } catch (err) {
      if (isDev) {
        const created: Indicateur = {
          ...payload,
          ecart: payload.ecart ?? null,
          id: Date.now(),
        };
        store().unshift(created);
        return created;
      }
      throw err;
    }
  },

  update: async (payload: UpdateIndicateurPayload, client: ApiClient = apiClient): Promise<Indicateur> => {
    try {
      return await client.request<Indicateur>(`${BASE_URL}/${payload.id}`, { method: 'PUT', body: payload });
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
