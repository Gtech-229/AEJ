import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type { CreateFonctionPayload, Fonction, UpdateFonctionPayload } from './fonctions.dto';

// NB: confirmé via la doc Postman officielle — SANS trailing slash, contrairement
// à /users/ qui en a un. Vérifié en testant réellement /api/fonctions/{id}.
const BASE_URL = '/fonctions';

// ---------------------------------------------------------------------------
// TODO(backend): l'API réelle est actuellement inaccessible depuis le navigateur
// à cause d'un conflit CORS (Access-Control-Allow-Origin: '*' + credentials:
// 'include' — combinaison interdite par les navigateurs). Le sujet a été
// remonté à l'équipe/au chef de projet. En attendant, chaque méthode essaie
// l'API réelle en premier et bascule sur un store en mémoire en dev seulement,
// pour ne pas bloquer le développement front. Retirer ce bloc une fois le
// problème CORS + auth réglé côté backend. Pattern repris de users.service.ts.
// ---------------------------------------------------------------------------
const isDev = process.env.NODE_ENV !== 'production';

const SEED_FONCTIONS: Fonction[] = [
  { id: 1, nom: "Chef d'agence régionale", code: 'CHEF_AGR', description: "Responsable d'une agence régionale AEJ", service_id: 1 },
  { id: 2, nom: 'Conseiller en insertion pro', code: 'CONS_INSERTION', description: "Accompagne les promoteurs dans leur parcours d'insertion", service_id: 1 },
  { id: 3, nom: 'Chef de service développement des ressources de financement', code: 'CHEF_DRF', description: 'Pilote la transmission des dossiers aux partenaires financiers', service_id: 2 },
  { id: 4, nom: 'Développeur Backend', code: 'DEV_BACK', description: 'Responsable du développement des APIs et de la logique serveur', service_id: 3 },
  { id: 5, nom: 'Développeur Frontend', code: 'DEV_FRONT', description: 'Responsable des interfaces utilisateur', service_id: 3 },
];

let devStore: Fonction[] | null = null;
function store(): Fonction[] {
  if (!devStore) devStore = [...SEED_FONCTIONS];
  return devStore;
}

export const fonctionsService = {
  getAll: async (client: ApiClient = apiClient): Promise<Fonction[]> => {
    try {
      const data = await client.request<Fonction[]>(BASE_URL);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      if (isDev) return [...store()];
      throw err;
    }
  },

  create: async (payload: CreateFonctionPayload, client: ApiClient = apiClient): Promise<Fonction> => {
    try {
      return await client.request<Fonction>(BASE_URL, { method: 'POST', body: payload });
    } catch (err) {
      if (isDev) {
        const created: Fonction = {
          ...payload,
          code: payload.code ?? null,
          description: payload.description ?? null,
          id: Date.now(),
        };
        store().unshift(created);
        return created;
      }
      throw err;
    }
  },

  update: async (payload: UpdateFonctionPayload, client: ApiClient = apiClient): Promise<Fonction> => {
    try {
      return await client.request<Fonction>(`${BASE_URL}/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
    } catch (err) {
      if (isDev) {
        devStore = store().map((f) => (f.id === payload.id ? payload : f));
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
        devStore = store().filter((f) => f.id !== id);
        return;
      }
      throw err;
    }
  },
};