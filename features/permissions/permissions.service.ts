import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type {
  CreatePermissionPayload,
  Permission,
  UpdatePermissionPayload,
} from './permissions.dto';

const BASE_URL = '/permissions';

/**
 * The flags come back inconsistently typed — the confirmed payload mixes number
 * `1`, string `"1"`, and number `0` across the three fields. `Boolean("0")` is
 * truthy, so coerce through the actual 0/1 value instead.
 */
function toBool(value: unknown): boolean {
  return value === true || value === 1 || value === '1';
}

function normalize(raw: Permission): Permission {
  return {
    ...raw,
    autorise: toBool(raw.autorise),
    acces: toBool(raw.acces),
    full_access: toBool(raw.full_access),
  };
}

function normalizeList(data: unknown): Permission[] {
  return Array.isArray(data) ? (data as Permission[]).map(normalize) : [];
}

/** Responses are enveloped: { Message, data: … } — methods unwrap `data`. */
export const permissionsService = {
  getAll: async (client: ApiClient = apiClient): Promise<Permission[]> => {
    const res = await client.request<{ data: Permission[] }>(BASE_URL);
    return normalizeList(res?.data);
  },

  /** Permissions of a single role — `GET /permissions?role_id=…`. */
  getByRole: async (roleId: number, client: ApiClient = apiClient): Promise<Permission[]> => {
    const res = await client.request<{ data: Permission[] }>(`${BASE_URL}?role_id=${roleId}`);
    return normalizeList(res?.data);
  },

  create: async (
    payload: CreatePermissionPayload,
    client: ApiClient = apiClient,
  ): Promise<Permission> => {
    const res = await client.request<{ data: Permission }>(BASE_URL, {
      method: 'POST',
      body: payload,
    });
    return normalize(res.data);
  },

  update: async (
    payload: UpdatePermissionPayload,
    client: ApiClient = apiClient,
  ): Promise<Permission> => {
    const res = await client.request<{ data: Permission }>(`${BASE_URL}/${payload.id}`, {
      method: 'PUT',
      body: payload,
    });
    return normalize(res.data);
  },

  remove: (id: number, client: ApiClient = apiClient): Promise<void> =>
    client.request<void>(`${BASE_URL}/${id}`, { method: 'DELETE' }),
};
