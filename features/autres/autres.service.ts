import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type { CreateElementPayload, Element, UpdateElementPayload } from './autres.dto';

// NB: endpoint /autres pas encore confirmé côté backend (module gelé) —
// comportement de repli calqué sur localites.service.ts en attendant.
const BASE_URL = '/autres';

const isDev = process.env.NODE_ENV !== 'production';

const SEED_ELEMENTS: Element[] = [
  { id: 1, nom: "Export bénéficiaires Q2", type: "Export", dateModification: "2026-08-01", responsable: "T. Julien", statut: 'termine' },
  { id: 2, nom: "Import liste promoteurs", type: "Import", dateModification: "2026-07-29", responsable: "T. Julien", statut: 'termine' },
  { id: 3, nom: "Synchronisation Kobo", type: "Système", dateModification: "2026-08-05", responsable: "Automatique", statut: 'encours' },
];

let devStore: Element[] | null = null;
function store(): Element[] {
  if (!devStore) devStore = [...SEED_ELEMENTS];
  return devStore;
}

export const elementsService = {
  getAll: async (client: ApiClient = apiClient): Promise<Element[]> => {
    try {
      const res = await client.request<Element[] | { data: Element[] }>(BASE_URL);
      if (Array.isArray(res)) return res;
      if (res && Array.isArray((res as { data: Element[] }).data)) {
        return (res as { data: Element[] }).data;
      }
      return [];
    } catch (err) {
      if (isDev) return [...store()];
      throw err;
    }
  },

  create: async (payload: CreateElementPayload, client: ApiClient = apiClient): Promise<Element> => {
    try {
      return await client.request<Element>(BASE_URL, { method: 'POST', body: payload });
    } catch (err) {
      if (isDev) {
        const created: Element = {
          ...payload,
          responsable: payload.responsable ?? null,
          id: Date.now(),
        };
        store().unshift(created);
        return created;
      }
      throw err;
    }
  },

  update: async (payload: UpdateElementPayload, client: ApiClient = apiClient): Promise<Element> => {
    try {
      return await client.request<Element>(`${BASE_URL}/${payload.id}`, { method: 'PUT', body: payload });
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
