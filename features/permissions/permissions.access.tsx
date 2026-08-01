'use client';

import { useAuth } from '@/features/auth/auth.context';
import { usePermissionsByRole } from './permissions.hooks';

/**
 * Master switch for UI gating. Kept OFF until the backend actually serves
 * per-role permissions — while off, `can()` returns `true` for everything, so
 * the whole mechanism is wired but hides nothing (no risk of locking the app
 * out during development). Flip to `true` to enforce the matrix.
 *
 * TODO(backend): turn on once `/permissions` is live and `/personnel/me`
 * resolves a role with a meaningful `code`.
 */
export const GATING_ENABLED = false;

/** Role codes that always get full access, regardless of the matrix. */
const SUPER_ADMIN_CODES = ['ADMIN', 'ADMIN_GENERAL', 'SUPER_ADMIN'];

export type PermissionAction = 'view' | 'write';

/**
 * Resolves what the *current* user may do, from their role's permission rows.
 * `can(module)` → may view; `can(module, 'write')` → may create/edit/delete.
 */
export function usePermissions() {
  const { user } = useAuth();
  const roleId = user?.role_id;
  const { data: permissions } = usePermissionsByRole(roleId);

  const isSuperAdmin =
    !!user?.role?.code && SUPER_ADMIN_CODES.includes(user.role.code);

  function can(module: string, action: PermissionAction = 'view'): boolean {
    if (!GATING_ENABLED) return true; // dormant — nothing is hidden yet
    if (isSuperAdmin) return true;
    // Not loaded yet (or unavailable): don't flash-hide the UI.
    if (!permissions) return true;

    const p = permissions.find((row) => row.module === module);
    if (!p || !p.autorise) return false;
    return action === 'write' ? p.full_access : p.acces || p.full_access;
  }

  return { can, isSuperAdmin, permissions: permissions ?? [] };
}

interface CanProps {
  /** Module key from `MODULES` (e.g. `"jeunes"`). */
  module: string;
  /** `"view"` (default) gates display; `"write"` gates create/edit/delete UI. */
  action?: PermissionAction;
  /** Rendered when access is denied (defaults to nothing). */
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Conditionally renders `children` based on the current user's rights. Wrap any
 * interface, button or option:
 *
 *   <Can module="jeunes" action="write"><Button>Ajouter</Button></Can>
 */
export function Can({ module, action = 'view', fallback = null, children }: CanProps) {
  const { can } = usePermissions();
  return <>{can(module, action) ? children : fallback}</>;
}
