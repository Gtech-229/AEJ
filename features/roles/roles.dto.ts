import type { Role } from '@/features/auth/auth.dto';

/**
 * Roles are the backoffice-personnel roles (`/roles`). The canonical `Role`
 * shape lives in `auth.dto` (it's what `/personnel/me` embeds and what drives
 * space routing) — re-exported here so the feature is self-contained.
 */
export type { Role };

/** Create a role — `POST /roles`. */
export interface CreateRolePayload {
  code: string;
  libelle: string;
  description?: string;
}

/** Update a role — `PUT /roles/{id}`. */
export interface UpdateRolePayload extends CreateRolePayload {
  id: number;
}
