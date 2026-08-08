import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type {
  Budget,
  CompteFinancement,
  CreateBudgetPayload,
  Decaissement,
  Remboursement,
  UpdateBudgetPayload,
} from './financements.dto';

/** Enveloped list: { message, data: [...] } (also tolerates a paginator — `data`
 *  is the array either way). */
async function getList<T>(url: string, client: ApiClient): Promise<T[]> {
  const res = await client.request<{ data: T[] }>(url);
  return Array.isArray(res?.data) ? res.data : [];
}

export const budgetsService = {
  getAll: (client: ApiClient = apiClient) => getList<Budget>('/budgets', client),

  create: async (payload: CreateBudgetPayload, client: ApiClient = apiClient): Promise<Budget> => {
    const res = await client.request<{ data: Budget }>('/budgets', { method: 'POST', body: payload });
    return res.data;
  },

  update: async (payload: UpdateBudgetPayload, client: ApiClient = apiClient): Promise<Budget> => {
    const res = await client.request<{ data: Budget }>(`/budgets/${payload.id}`, {
      method: 'PUT',
      body: payload,
    });
    return res.data;
  },

  remove: (id: number, client: ApiClient = apiClient): Promise<void> =>
    client.request<void>(`/budgets/${id}`, { method: 'DELETE' }),
};

export const comptesService = {
  getAll: (client: ApiClient = apiClient) =>
    getList<CompteFinancement>('/compte-financements', client),
};

export const decaissementsService = {
  getAll: (client: ApiClient = apiClient) => getList<Decaissement>('/decaissements', client),
};

export const remboursementsService = {
  getAll: (client: ApiClient = apiClient) => getList<Remboursement>('/remboursements', client),
};
