import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type { CreateServicePayload, Service, UpdateServicePayload } from './services.dto';

// TODO(backend): confirm the exact route (assumed /services, no trailing slash).
const BASE_URL = '/services';

/** Responses are enveloped: { Message, data: … } — methods unwrap `data`. */
export const servicesService = {
  getAll: async (client: ApiClient = apiClient): Promise<Service[]> => {
    const res = await client.request<{ data: Service[] }>(BASE_URL);
    return Array.isArray(res?.data) ? res.data : [];
  },

  create: async (
    payload: CreateServicePayload,
    client: ApiClient = apiClient,
  ): Promise<Service> => {
    const res = await client.request<{ data: Service }>(BASE_URL, {
      method: 'POST',
      body: payload,
    });
    return res.data;
  },

  update: async (
    payload: UpdateServicePayload,
    client: ApiClient = apiClient,
  ): Promise<Service> => {
    const res = await client.request<{ data: Service }>(`${BASE_URL}/${payload.id}`, {
      method: 'PUT',
      body: payload,
    });
    return res.data;
  },

  remove: (id: number, client: ApiClient = apiClient): Promise<void> =>
    client.request<void>(`${BASE_URL}/${id}`, { method: 'DELETE' }),
};
