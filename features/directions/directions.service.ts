import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type {
  CreateDirectionPayload,
  Direction,
  UpdateDirectionPayload,
} from './directions.dto';

// TODO(backend): confirm the exact route (assumed /directions, no trailing slash).
const BASE_URL = '/directions';

/** Responses are enveloped: { Message, data: … } — methods unwrap `data`. */
export const directionsService = {
  getAll: async (client: ApiClient = apiClient): Promise<Direction[]> => {
    const res = await client.request<{ data: Direction[] }>(BASE_URL);
    return Array.isArray(res?.data) ? res.data : [];
  },

  create: async (
    payload: CreateDirectionPayload,
    client: ApiClient = apiClient,
  ): Promise<Direction> => {
    const res = await client.request<{ data: Direction }>(BASE_URL, {
      method: 'POST',
      body: payload,
    });
    return res.data;
  },

  update: async (
    payload: UpdateDirectionPayload,
    client: ApiClient = apiClient,
  ): Promise<Direction> => {
    const res = await client.request<{ data: Direction }>(`${BASE_URL}/${payload.id}`, {
      method: 'PUT',
      body: payload,
    });
    return res.data;
  },

  remove: (id: number, client: ApiClient = apiClient): Promise<void> =>
    client.request<void>(`${BASE_URL}/${id}`, { method: 'DELETE' }),
};
