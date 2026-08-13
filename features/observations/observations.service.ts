import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type { CreateObservationPayload, Observation } from './observations.dto';

const BASE_URL = '/observations';

/** Responses are enveloped: { message, data: … } — methods unwrap `data`. */
export const observationsService = {
  getAll: async (client: ApiClient = apiClient): Promise<Observation[]> => {
    const res = await client.request<{ data: Observation[] }>(BASE_URL);
    return Array.isArray(res?.data) ? res.data : [];
  },

  create: async (
    payload: CreateObservationPayload,
    client: ApiClient = apiClient,
  ): Promise<Observation> => {
    const res = await client.request<{ data: Observation }>(BASE_URL, {
      method: 'POST',
      body: payload,
    });
    return res.data;
  },
};
