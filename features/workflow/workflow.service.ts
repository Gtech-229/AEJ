import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type { CreateDossierPayload, Dossier, UpdateDossierPayload } from './workflow.dto';

// NB: endpoint /workflow pas encore confirmé côté backend (module gelé) —
// comportement de repli calqué sur localites.service.ts en attendant.
const BASE_URL = '/workflow';

const isDev = process.env.NODE_ENV !== 'production';

const SEED_DOSSIERS: Dossier[] = [
  { id: 1, nom: "Élevage avicole Bouaké", etape: "Validation régionale", responsable: "Koné S.", depuis: "3 jours", statut: 'attente' },
  { id: 2, nom: "Atelier couture Yopougon", etape: "Décaissement", responsable: "Bamba I.", depuis: "1 jour", statut: 'valide' },
  { id: 3, nom: "Cybercafé Daloa", etape: "Instruction", responsable: "N'Guessan A.", depuis: "9 jours", statut: 'rejete' },
];

let devStore: Dossier[] | null = null;
function store(): Dossier[] {
  if (!devStore) devStore = [...SEED_DOSSIERS];
  return devStore;
}

export const dossiersService = {
  getAll: async (client: ApiClient = apiClient): Promise<Dossier[]> => {
    try {
      const res = await client.request<Dossier[] | { data: Dossier[] }>(BASE_URL);
      if (Array.isArray(res)) return res;
      if (res && Array.isArray((res as { data: Dossier[] }).data)) {
        return (res as { data: Dossier[] }).data;
      }
      return [];
    } catch (err) {
      if (isDev) return [...store()];
      throw err;
    }
  },

  create: async (payload: CreateDossierPayload, client: ApiClient = apiClient): Promise<Dossier> => {
    try {
      return await client.request<Dossier>(BASE_URL, { method: 'POST', body: payload });
    } catch (err) {
      if (isDev) {
        const created: Dossier = {
          ...payload,
          depuis: payload.depuis ?? null,
          id: Date.now(),
        };
        store().unshift(created);
        return created;
      }
      throw err;
    }
  },

  update: async (payload: UpdateDossierPayload, client: ApiClient = apiClient): Promise<Dossier> => {
    try {
      return await client.request<Dossier>(`${BASE_URL}/${payload.id}`, { method: 'PUT', body: payload });
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
