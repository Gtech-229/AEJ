import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type { CreateMicroProjetPayload, MicroProjet, UpdateMicroProjetPayload } from './micro-projets.dto';

// NB: endpoint /micro-projets pas encore confirmé côté backend (module
// gelé) — comportement de repli calqué sur localites.service.ts en
// attendant. À vérifier (trailing slash, forme de l'enveloppe) une fois
// l'API disponible.
const BASE_URL = '/micro-projets';

const isDev = process.env.NODE_ENV !== 'production';

const SEED_MICRO_PROJETS: MicroProjet[] = [
  { id: 1, nom: 'Élevage avicole Bouaké', promoteur: 'Awa Koffi', secteur: 'Agro-élevage', montant: 2500000, dateDepot: '2026-03-05', statut: 'finance' },
  { id: 2, nom: 'Atelier couture Yopougon', promoteur: 'Fatou Diarra', secteur: 'Artisanat', montant: 1800000, dateDepot: '2026-05-14', statut: 'instruction' },
  { id: 3, nom: 'Transformation manioc', promoteur: 'Jean Kouassi', secteur: 'Agroalimentaire', montant: 3200000, dateDepot: '2026-02-20', statut: 'finance' },
  { id: 4, nom: 'Cybercafé Daloa', promoteur: 'Salimata Touré', secteur: 'Services', montant: 1500000, dateDepot: '2026-06-02', statut: 'rejete' },
  { id: 5, nom: 'Élevage porcin San Pedro', promoteur: 'Ibrahim Cissé', secteur: 'Agro-élevage', montant: 2100000, dateDepot: '2025-11-18', statut: 'cloture' },
];

let devStore: MicroProjet[] | null = null;
function store(): MicroProjet[] {
  if (!devStore) devStore = [...SEED_MICRO_PROJETS];
  return devStore;
}

export const microProjetsService = {
  getAll: async (client: ApiClient = apiClient): Promise<MicroProjet[]> => {
    try {
      const res = await client.request<MicroProjet[] | { data: MicroProjet[] }>(BASE_URL);
      if (Array.isArray(res)) return res;
      if (res && Array.isArray((res as { data: MicroProjet[] }).data)) {
        return (res as { data: MicroProjet[] }).data;
      }
      return [];
    } catch (err) {
      if (isDev) return [...store()];
      throw err;
    }
  },

  create: async (payload: CreateMicroProjetPayload, client: ApiClient = apiClient): Promise<MicroProjet> => {
    try {
      return await client.request<MicroProjet>(BASE_URL, { method: 'POST', body: payload });
    } catch (err) {
      if (isDev) {
        const created: MicroProjet = {
          ...payload,
          secteur: payload.secteur ?? null,
          id: Date.now(),
        };
        store().unshift(created);
        return created;
      }
      throw err;
    }
  },

  update: async (payload: UpdateMicroProjetPayload, client: ApiClient = apiClient): Promise<MicroProjet> => {
    try {
      return await client.request<MicroProjet>(`${BASE_URL}/${payload.id}`, { method: 'PUT', body: payload });
    } catch (err) {
      if (isDev) {
        devStore = store().map((p) => (p.id === payload.id ? payload : p));
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
        devStore = store().filter((p) => p.id !== id);
        return;
      }
      throw err;
    }
  },
};