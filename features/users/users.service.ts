import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type { CreateUserPayload, UpdateUserPayload, User } from './users.dto';

// NB: confirmé via la doc Postman officielle — SANS trailing slash (comme
// /api/fonctions ; /api/localites fait exception avec un slash final).
const BASE_URL = '/personnels';

// ---------------------------------------------------------------------------
// Fallback dev en mémoire — nécessaire tant que le blocage CORS identifié sur
// l'API (Access-Control-Allow-Origin: '*' incompatible avec credentials:
// 'include') n'est pas résolu côté backend. Chaque méthode essaie l'API
// réelle en premier et ne bascule sur le store qu'en développement.
// Remove this block once CORS is fixed and the endpoints are reachable.
// ---------------------------------------------------------------------------
const isDev = process.env.NODE_ENV !== 'production';

const SEED_USERS: User[] = [
  { id: 1, nom: 'Koné', prenom: 'Awa', email: 'awa.kone@aej.ci', telephone: '+2250700000001', adresse: 'Abidjan', role_id: 1, fonction_id: 1, is_active: true },
  { id: 2, nom: "N'Guessan", prenom: 'Yao', email: 'yao.nguessan@aej.ci', telephone: '+2250700000002', adresse: 'Yamoussoukro', role_id: 2, fonction_id: 2, is_active: true },
  { id: 3, nom: 'Traoré', prenom: 'Fatou', email: 'fatou.traore@aej.ci', telephone: '+2250700000003', adresse: 'Bouaké', role_id: 3, fonction_id: 3, is_active: false },
  { id: 4, nom: 'Aka', prenom: 'Koffi', email: 'koffi.aka@aej.ci', telephone: '+2250700000004', adresse: 'Korhogo', role_id: 2, fonction_id: 4, is_active: true },
  { id: 5, nom: 'Diallo', prenom: 'Mariam', email: 'mariam.diallo@aej.ci', telephone: '+2250700000005', adresse: 'San-Pédro', role_id: 3, fonction_id: 1, is_active: true },
];

let devStore: User[] | null = null;
function store(): User[] {
  if (!devStore) devStore = [...SEED_USERS];
  return devStore;
}

export const usersService = {
  getAll: async (client: ApiClient = apiClient): Promise<User[]> => {
    try {
      const data = await client.request<User[]>(BASE_URL);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      if (isDev) return [...store()];
      throw err;
    }
  },

  create: async (payload: CreateUserPayload, client: ApiClient = apiClient): Promise<User> => {
    try {
      return await client.request<User>(BASE_URL, { method: 'POST', body: payload });
    } catch (err) {
      if (isDev) {
        // NB: mot_de_passe n'est jamais renvoyé/stocké tel quel dans le store dev.
        const { mot_de_passe: _mot_de_passe, ...rest } = payload;
        const created: User = { ...rest, id: Date.now(), is_active: true };
        store().unshift(created);
        return created;
      }
      throw err;
    }
  },

  update: async (payload: UpdateUserPayload, client: ApiClient = apiClient): Promise<User> => {
    try {
      return await client.request<User>(`${BASE_URL}/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
    } catch (err) {
      if (isDev) {
        const current = store().find((u) => u.id === payload.id);
        const updated: User = { ...current, ...payload, is_active: current?.is_active ?? true };
        devStore = store().map((u) => (u.id === payload.id ? updated : u));
        return updated;
      }
      throw err;
    }
  },

  remove: async (id: number, client: ApiClient = apiClient): Promise<void> => {
    try {
      await client.request<void>(`${BASE_URL}/${id}`, { method: 'DELETE' });
    } catch (err) {
      if (isDev) {
        devStore = store().filter((u) => u.id !== id);
        return;
      }
      throw err;
    }
  },
};