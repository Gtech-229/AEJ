import type { User } from './auth.dto';

/**
 * Known role ids.
 * TODO(backend): confirm these against the Rôles module when it ships — today
 * we only get a numeric `role_id` with no labels.
 */
export const ROLE_IDS = {
  superAdmin: 1,
} as const;

/**
 * Roles allowed to keep using the app while maintenance mode is ON.
 *
 * ⚠️ This list is a UX affordance ONLY — the backend is the enforcement point
 * and MUST mirror it (reject non-exempt roles at login and on every request,
 * ideally with a 503). If the two lists diverge you get the worst outcome: the
 * UI lets someone in and every API call fails.
 *
 * Adding a role later = add its id here (and on the backend). Nothing else
 * needs to change.
 */
export const MAINTENANCE_ALLOWED_ROLE_IDS: number[] = [ROLE_IDS.superAdmin];

/**
 * Whether this user may use the app during maintenance.
 *
 * Prefers the server's resolved decision when present — the day
 * `/personnel/me` returns `can_bypass_maintenance`, the local allow-list above
 * becomes dead code and the policy lives in exactly one place (the backend).
 */
export function canBypassMaintenance(user: User | null | undefined): boolean {
  if (!user) return false;
  if (typeof user.can_bypass_maintenance === 'boolean') {
    return user.can_bypass_maintenance;
  }
  if (user.role_id == null) return false;
  return MAINTENANCE_ALLOWED_ROLE_IDS.includes(user.role_id);
}
