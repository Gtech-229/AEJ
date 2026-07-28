import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type {
  CreateDirectionPayload,
  Direction,
  UpdateDirectionPayload,
} from './directions.dto';

// TODO(backend): confirm the real path. Assumed /directions (no trailing slash,
// like /fonctions). Same dev-store fallback as fonctions.service.ts while the
// CORS/auth issue on the real API is being resolved — remove once it's live.
const BASE_URL = '/directions';
const isDev = process.env.NODE_ENV !== 'production';

const SEED_DIRECTIONS: Direction[] = [
  { id: 1, nom: 'Direction Générale', code: 'DG', description: "Pilotage stratégique de l'agence" },
  { id: 2, nom: 'Direction des Finances et Partenariats', code: 'DFP', description: 'Gestion financière et relations partenaires' },
  { id: 3, nom: "Direction des Systèmes d'Information", code: 'DSI', description: 'Infrastructure et applications métier' },
  { id: 4, nom: 'Direction du Suivi-Évaluation', code: 'DSE', description: 'Suivi des indicateurs et reporting' },
];

let devStore: Direction[] | null = null;
function store(): Direction[] {
  if (!devStore) devStore = [...SEED_DIRECTIONS];
  return devStore;
}

export const directionsService = {
  getAll: async (client: ApiClient = apiClient): Promise<Direction[]> => {
    try {
      const data = await client.request<Direction[]>(BASE_URL);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      if (isDev) return [...store()];
      throw err;
    }
  },

  create: async (
    payload: CreateDirectionPayload,
    client: ApiClient = apiClient,
  ): Promise<Direction> => {
    try {
      return await client.request<Direction>(BASE_URL, { method: 'POST', body: payload });
    } catch (err) {
      if (isDev) {
        const created: Direction = {
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

  update: async (
    payload: UpdateDirectionPayload,
    client: ApiClient = apiClient,
  ): Promise<Direction> => {
    try {
      return await client.request<Direction>(`${BASE_URL}/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
    } catch (err) {
      if (isDev) {
        devStore = store().map((d) => (d.id === payload.id ? payload : d));
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
        devStore = store().filter((d) => d.id !== id);
        return;
      }
      throw err;
    }
  },
};
