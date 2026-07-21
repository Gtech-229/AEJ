import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type { CreateUserPayload, User } from './users.dto';

const BASE_URL = '/users';

// ---------------------------------------------------------------------------
// TODO(backend): dev in-memory store so the page is fully usable (list + CRUD)
// before the /users API exists. Each method tries the real API first and only
// falls back to the store in development. Remove this block once the endpoints
// are live.
// ---------------------------------------------------------------------------
const isDev = process.env.NODE_ENV !== 'production';

const SEED_USERS: User[] = [
  { id: 1, nom: 'Koné', prenom: 'Awa', email: 'awa.kone@aej.ci', telephone: '+2250700000001', role: 'admin', statut: 'actif' },
  { id: 2, nom: "N'Guessan", prenom: 'Yao', email: 'yao.nguessan@aej.ci', telephone: '+2250700000002', role: 'gestionnaire', statut: 'actif' },
  { id: 3, nom: 'Traoré', prenom: 'Fatou', email: 'fatou.traore@aej.ci', telephone: '+2250700000003', role: 'consultant', statut: 'inactif' },
  { id: 4, nom: 'Aka', prenom: 'Koffi', email: 'koffi.aka@aej.ci', telephone: '+2250700000004', role: 'gestionnaire', statut: 'actif' },
  { id: 5, nom: 'Diallo', prenom: 'Mariam', email: 'mariam.diallo@aej.ci', telephone: '+2250700000005', role: 'consultant', statut: 'actif' },
];

let devStore: User[] | null = null;
function store(): User[] {
  if (!devStore) devStore = [...SEED_USERS];
  return devStore;
}

export const usersService = {
  getAll: async (client: ApiClient = apiClient): Promise<User[]> => {
    try {
      const data = await client.request<User[]>(`${BASE_URL}/`);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      if (isDev) return [...store()];
      throw err;
    }
  },

  create: async (payload: CreateUserPayload, client: ApiClient = apiClient): Promise<User> => {
    try {
      return await client.request<User>(`${BASE_URL}/`, { method: 'POST', body: payload });
    } catch (err) {
      if (isDev) {
        const created: User = { ...payload, id: Date.now() };
        store().unshift(created);
        return created;
      }
      throw err;
    }
  },

  update: async (payload: User, client: ApiClient = apiClient): Promise<User> => {
    try {
      return await client.request<User>(`${BASE_URL}/${payload.id}/`, {
        method: 'PUT',
        body: payload,
      });
    } catch (err) {
      if (isDev) {
        devStore = store().map((u) => (u.id === payload.id ? payload : u));
        return payload;
      }
      throw err;
    }
  },

  remove: async (id: number, client: ApiClient = apiClient): Promise<void> => {
    try {
      await client.request<void>(`${BASE_URL}/${id}/`, { method: 'DELETE' });
    } catch (err) {
      if (isDev) {
        devStore = store().filter((u) => u.id !== id);
        return;
      }
      throw err;
    }
  },
};
