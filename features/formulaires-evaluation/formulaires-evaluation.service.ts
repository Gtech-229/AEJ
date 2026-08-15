import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type {
  CreateFormulairePayload,
  FormulaireEvaluation,
  UpdateFormulairePayload,
} from './formulaires-evaluation.dto';

const BASE_URL = '/formulaires-evaluation';

/** List is a Laravel paginator (`{ data: [...] }`); a formulaire embeds its `questions[]`. */
export const formulairesEvaluationService = {
  getAll: async (client: ApiClient = apiClient): Promise<FormulaireEvaluation[]> => {
    const res = await client.request<{ data: FormulaireEvaluation[] }>(`${BASE_URL}?per_page=200`);
    return Array.isArray(res?.data) ? res.data : [];
  },

  create: async (
    payload: CreateFormulairePayload,
    client: ApiClient = apiClient,
  ): Promise<FormulaireEvaluation> => {
    const res = await client.request<{ data: FormulaireEvaluation }>(BASE_URL, {
      method: 'POST',
      body: payload,
    });
    return res.data;
  },

  update: async (
    payload: UpdateFormulairePayload,
    client: ApiClient = apiClient,
  ): Promise<FormulaireEvaluation> => {
    const { id, ...body } = payload;
    const res = await client.request<{ data: FormulaireEvaluation }>(`${BASE_URL}/${id}`, {
      method: 'PUT',
      body,
    });
    return res.data;
  },

  remove: (id: number, client: ApiClient = apiClient): Promise<void> =>
    client.request<void>(`${BASE_URL}/${id}`, { method: 'DELETE' }),
};
