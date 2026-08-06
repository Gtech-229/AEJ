import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type { CreateOperationPayload, Operation, UpdateOperationPayload } from './finances.dto';

// NB: endpoint /finances pas encore confirmé côté backend (module gelé) —
// comportement de repli calqué sur localites.service.ts en attendant.
const BASE_URL = '/finances';

const isDev = process.env.NODE_ENV !== 'production';

const SEED_OPERATIONS: Operation[] = [
  { id: 1, beneficiaire: "Awa Koffi", montant: 2500000, typeOperation: "Décaissement", date: "2026-03-05", statut: 'effectue' },
  { id: 2, beneficiaire: "Fatou Diarra", montant: 300000, typeOperation: "Remboursement", date: "2026-07-20", statut: 'effectue' },
  { id: 3, beneficiaire: "Jean Kouassi", montant: 3200000, typeOperation: "Décaissement", date: "2026-07-28", statut: 'attente' },
  { id: 4, beneficiaire: "Ibrahim Cissé", montant: 150000, typeOperation: "Remboursement", date: "2026-08-01", statut: 'rejete' },
];

let devStore: Operation[] | null = null;
function store(): Operation[] {
  if (!devStore) devStore = [...SEED_OPERATIONS];
  return devStore;
}

export const operationsService = {
  getAll: async (client: ApiClient = apiClient): Promise<Operation[]> => {
    try {
      const res = await client.request<Operation[] | { data: Operation[] }>(BASE_URL);
      if (Array.isArray(res)) return res;
      if (res && Array.isArray((res as { data: Operation[] }).data)) {
        return (res as { data: Operation[] }).data;
      }
      return [];
    } catch (err) {
      if (isDev) return [...store()];
      throw err;
    }
  },

  create: async (payload: CreateOperationPayload, client: ApiClient = apiClient): Promise<Operation> => {
    try {
      return await client.request<Operation>(BASE_URL, { method: 'POST', body: payload });
    } catch (err) {
      if (isDev) {
        const created: Operation = {
          ...payload,

          id: Date.now(),
        };
        store().unshift(created);
        return created;
      }
      throw err;
    }
  },

  update: async (payload: UpdateOperationPayload, client: ApiClient = apiClient): Promise<Operation> => {
    try {
      return await client.request<Operation>(`${BASE_URL}/${payload.id}`, { method: 'PUT', body: payload });
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
