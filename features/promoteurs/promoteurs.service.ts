import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type { CreatePromoteurPayload, Promoteur, UpdatePromoteurPayload } from './promoteurs.dto';

// NB: endpoint /promoteurs pas encore confirmé côté backend (module gelé) —
// comportement de repli calqué sur localites.service.ts en attendant.
const BASE_URL = '/promoteurs';

const isDev = process.env.NODE_ENV !== 'production';

const SEED_PROMOTEURS: Promoteur[] = [
  { id: 1, nom: "Awa Koffi", localite: "Bouaké", telephone: "+225 07 01 23 45 67", nombreProjets: 1, statut: 'actif' },
  { id: 2, nom: "Fatou Diarra", localite: "Abidjan", telephone: "+225 05 44 12 98 76", nombreProjets: 2, statut: 'actif' },
  { id: 3, nom: "Jean Kouassi", localite: "Daloa", telephone: "+225 01 22 33 44 55", nombreProjets: 1, statut: 'attente' },
  { id: 4, nom: "Salimata Touré", localite: "San Pedro", telephone: "+225 07 88 99 00 11", nombreProjets: 1, statut: 'inactif' },
];

let devStore: Promoteur[] | null = null;
function store(): Promoteur[] {
  if (!devStore) devStore = [...SEED_PROMOTEURS];
  return devStore;
}

export const promoteursService = {
  getAll: async (client: ApiClient = apiClient): Promise<Promoteur[]> => {
    try {
      const res = await client.request<Promoteur[] | { data: Promoteur[] }>(BASE_URL);
      if (Array.isArray(res)) return res;
      if (res && Array.isArray((res as { data: Promoteur[] }).data)) {
        return (res as { data: Promoteur[] }).data;
      }
      return [];
    } catch (err) {
      if (isDev) return [...store()];
      throw err;
    }
  },

  create: async (payload: CreatePromoteurPayload, client: ApiClient = apiClient): Promise<Promoteur> => {
    try {
      return await client.request<Promoteur>(BASE_URL, { method: 'POST', body: payload });
    } catch (err) {
      if (isDev) {
        const created: Promoteur = {
          ...payload,
          telephone: payload.telephone ?? null,
          id: Date.now(),
        };
        store().unshift(created);
        return created;
      }
      throw err;
    }
  },

  update: async (payload: UpdatePromoteurPayload, client: ApiClient = apiClient): Promise<Promoteur> => {
    try {
      return await client.request<Promoteur>(`${BASE_URL}/${payload.id}`, { method: 'PUT', body: payload });
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
