import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type { CreateLocalitePayload, Localite, UpdateLocalitePayload } from './localites.dto';

// NB: confirmé via la doc Postman officielle — la liste ("Get all") a un
// trailing slash (/api/localites/), contrairement à /api/fonctions qui n'en a
// pas. Incohérence entre ressources côté backend, respectée telle quelle ici.
const BASE_URL = '/localites';

// ---------------------------------------------------------------------------
// Fallback dev en mémoire — nécessaire tant que le blocage CORS identifié sur
// l'API (Access-Control-Allow-Origin: '*' incompatible avec credentials:
// 'include') n'est pas résolu côté backend. Chaque méthode essaie l'API
// réelle en premier et ne bascule sur le store qu'en développement.
// Remove this block once CORS is fixed and the endpoints are reachable.
// ---------------------------------------------------------------------------
const isDev = process.env.NODE_ENV !== 'production';

const SEED_LOCALITES: Localite[] = [
  { id: 1, nom: 'Abidjan', code: 'ABJ01', couche_cartographique: 'zone_urbaine', niveau_localite_id: 1 },
  { id: 2, nom: 'Yamoussoukro', code: 'YAM01', couche_cartographique: 'zone_urbaine', niveau_localite_id: 1 },
  { id: 3, nom: 'Bouaké', code: 'BKE01', couche_cartographique: 'zone_urbaine', niveau_localite_id: 1 },
  { id: 4, nom: 'Korhogo', code: 'KOR01', couche_cartographique: 'zone_rurale', niveau_localite_id: 2 },
  { id: 5, nom: 'San-Pédro', code: 'SPD01', couche_cartographique: 'zone_urbaine', niveau_localite_id: 1 },
];

let devStore: Localite[] | null = null;
function store(): Localite[] {
  if (!devStore) devStore = [...SEED_LOCALITES];
  return devStore;
}

export const localitesService = {
  getAll: async (client: ApiClient = apiClient): Promise<Localite[]> => {
    try {
      const data = await client.request<Localite[]>(`${BASE_URL}/`);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      if (isDev) return [...store()];
      throw err;
    }
  },

  create: async (payload: CreateLocalitePayload, client: ApiClient = apiClient): Promise<Localite> => {
    try {
      return await client.request<Localite>(BASE_URL, { method: 'POST', body: payload });
    } catch (err) {
      if (isDev) {
        const created: Localite = {
          ...payload,
          code: payload.code ?? null,
          couche_cartographique: payload.couche_cartographique ?? null,
          id: Date.now(),
        };
        store().unshift(created);
        return created;
      }
      throw err;
    }
  },

  update: async (payload: UpdateLocalitePayload, client: ApiClient = apiClient): Promise<Localite> => {
    try {
      return await client.request<Localite>(`${BASE_URL}/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
    } catch (err) {
      if (isDev) {
        devStore = store().map((l) => (l.id === payload.id ? payload : l));
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
        devStore = store().filter((l) => l.id !== id);
        return;
      }
      throw err;
    }
  },
};