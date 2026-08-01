/**
 * Per-(role, module) access rights (`/permissions`). One row grants a role a
 * level of access to a functional module of the backoffice.
 *
 * Flag semantics (our interpretation — TODO(backend): confirm):
 *  - `autorise`    — master switch: the row is active. False ⇒ no access at all.
 *  - `acces`       — may view / read the module.
 *  - `full_access` — may write (create / edit / delete) in the module.
 */
export interface Permission {
  id: number;
  role_id: number;
  module: string;
  autorise: boolean;
  acces: boolean;
  full_access: boolean;
  created_at?: string;
  updated_at?: string;
}

/** Create a permission — `POST /permissions`. */
export interface CreatePermissionPayload {
  role_id: number;
  module: string;
  autorise: boolean;
  acces: boolean;
  full_access: boolean;
}

/** Update a permission — `PUT /permissions/{id}`. */
export interface UpdatePermissionPayload extends CreatePermissionPayload {
  id: number;
}
