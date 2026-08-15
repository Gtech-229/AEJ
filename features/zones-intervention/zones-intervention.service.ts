import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type { CreateZonePayload, UpdateZonePayload, ZoneIntervention } from './zones-intervention.dto';

const BASE_URL = '/zones-intervention';

export const zonesService = {
  getAll: async (client: ApiClient = apiClient): Promise<ZoneIntervention[]> => {
    const res = await client.request<{ data: ZoneIntervention[] }>(BASE_URL);
    return Array.isArray(res?.data) ? res.data : [];
  },
  create: async (payload: CreateZonePayload, client: ApiClient = apiClient): Promise<ZoneIntervention> => {
    const res = await client.request<{ data: ZoneIntervention }>(BASE_URL, {
      method: 'POST',
      body: payload,
    });
    return res.data;
  },
  update: async (
    { id, ...body }: UpdateZonePayload,
    client: ApiClient = apiClient,
  ): Promise<ZoneIntervention> => {
    const res = await client.request<{ data: ZoneIntervention }>(`${BASE_URL}/${id}`, {
      method: 'PUT',
      body,
    });
    return res.data;
  },
  remove: (id: number, client: ApiClient = apiClient): Promise<void> =>
    client.request<void>(`${BASE_URL}/${id}`, { method: 'DELETE' }),
};
