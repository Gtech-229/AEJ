import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type {
  BeneficiairePrevu,
  CreateBeneficiairePrevuPayload,
  UpdateBeneficiairePrevuPayload,
} from './beneficiaires-prevus.dto';

// NB: assumed from the /type-organismes convention (no trailing slash). Not
// yet confirmed against Postman/backend routes — adjust if it differs.
const BASE_URL = '/beneficiaires-prevus';

/** Responses are enveloped: { Message, data: … } — methods unwrap `data`. */
export const beneficiairesPrevusService = {
  getAll: async (client: ApiClient = apiClient): Promise<BeneficiairePrevu[]> => {
    const res = await client.request<{ data: BeneficiairePrevu[] }>(BASE_URL);
    return Array.isArray(res?.data) ? res.data : [];
  },

  create: async (
    payload: CreateBeneficiairePrevuPayload,
    client: ApiClient = apiClient,
  ): Promise<BeneficiairePrevu> => {
    const res = await client.request<{ data: BeneficiairePrevu }>(BASE_URL, {
      method: 'POST',
      body: payload,
    });
    return res.data;
  },

  update: async (
    payload: UpdateBeneficiairePrevuPayload,
    client: ApiClient = apiClient,
  ): Promise<BeneficiairePrevu> => {
    const res = await client.request<{ data: BeneficiairePrevu }>(`${BASE_URL}/${payload.id}`, {
      method: 'PUT',
      body: payload,
    });
    return res.data;
  },

  remove: (id: number, client: ApiClient = apiClient): Promise<void> =>
    client.request<void>(`${BASE_URL}/${id}`, { method: 'DELETE' }),
};
