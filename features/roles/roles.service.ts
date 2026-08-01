import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type { CreateRolePayload, Role, UpdateRolePayload } from './roles.dto';

const BASE_URL = '/roles';

/** Responses are enveloped: { Message, data: … } — methods unwrap `data`. */
export const rolesService = {
  getAll: async (client: ApiClient = apiClient): Promise<Role[]> => {
    const res = await client.request<{ data: Role[] }>(BASE_URL);
    return Array.isArray(res?.data) ? res.data : [];
  },

  create: async (payload: CreateRolePayload, client: ApiClient = apiClient): Promise<Role> => {
    const res = await client.request<{ data: Role }>(BASE_URL, {
      method: 'POST',
      body: payload,
    });
    return res.data;
  },

  update: async (payload: UpdateRolePayload, client: ApiClient = apiClient): Promise<Role> => {
    const res = await client.request<{ data: Role }>(`${BASE_URL}/${payload.id}`, {
      method: 'PUT',
      body: payload,
    });
    return res.data;
  },

  remove: (id: number, client: ApiClient = apiClient): Promise<void> =>
    client.request<void>(`${BASE_URL}/${id}`, { method: 'DELETE' }),
};
