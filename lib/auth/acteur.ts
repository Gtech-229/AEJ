import type { User } from '@/features/auth/auth.dto';
import { AGENCE_ROLES } from './roles';
import { ORGANISME_ROLES } from './roles.organismes';
import { ENTREPRISE_ROLES } from './roles.entreprise';

export type ActeurType = 'agence' | 'organismes' | 'entreprise';

/**
 * ── DEV / PREVIEW LEVER ──────────────────────────────────────────────────────
 * When set to an ActeurType, EVERY dashboard guard resolves to this profile
 * (bypassing the real role_id → acteur mapping) AND each dashboard renders its
 * FULL data (the `*-dashboard.config.ts` getters short-circuit on it). Flip it
 * to preview a profile — 'agence' | 'organismes' | 'entreprise' — then open (or
 * get routed to) that profile's dashboard.
 *
 * Set back to `null` to restore real routing + role-filtered data.
 *
 * NOTE: routing is moving to PER-SPACE auth (space known from the login channel),
 * so once each space has its own session this lever + the role_id map retire.
 */
export const FORCE_ACTEUR: ActeurType | null = 'agence';

/**
 * Map a role *slug* to its acteur space. The teammate's dashboards are keyed by
 * these slugs; the new auth (`/personnel/me`) only returns `role_id`, so the
 * slug is resolved from the id via `ROLE_ID_TO_SLUG` below.
 */
export function getActeurTypeForRole(role: string | undefined): ActeurType | null {
    if (!role) return null;
    if ((AGENCE_ROLES as readonly string[]).includes(role)) return 'agence';
    if ((ORGANISME_ROLES as readonly string[]).includes(role)) return 'organismes';
    if ((ENTREPRISE_ROLES as readonly string[]).includes(role)) return 'entreprise';
    return null;
}

/**
 * Single source of truth mapping the backend's numeric `role_id` to a role slug.
 *
 * TODO(backend): `/personnel/me` returns only `role_id` today and the Rôles
 * module isn't live yet — `admin_general` (role_id 1, the super-admin) is the
 * only id confirmed so far. Fill in the entreprise/organismes ids here (or,
 * better, have the API return a `role` slug directly) to light up per-profile
 * routing. Until then every other id resolves to `undefined` → the acteur type
 * is unknown and the guard stays permissive (see `useActeurGuard`).
 */
const ROLE_ID_TO_SLUG: Record<number, string> = {
    1: 'admin_general',
};

/** Resolve the role slug for the current user from its `role_id`. */
export function getRoleSlug(user: User | null | undefined): string | undefined {
    if (!user || user.role_id == null) return undefined;
    return ROLE_ID_TO_SLUG[user.role_id];
}

const ACTEUR_TYPES: readonly ActeurType[] = ['agence', 'organismes', 'entreprise'];

/** Resolve the acteur space (agence / organismes / entreprise) for a user. */
export function getActeurTypeForUser(user: User | null | undefined): ActeurType | null {
    if (FORCE_ACTEUR) return FORCE_ACTEUR; // preview override — see FORCE_ACTEUR above

    // Preferred: the stable, backend-owned dashboard space on the user's role.
    // Once `/personnel/me` returns `role.space`, delete FORCE_ACTEUR and this
    // wins — routing "just works" with no other change.
    const space = user?.role?.space;
    if (space && ACTEUR_TYPES.includes(space)) return space;

    // Fallback until `role.space` is live: legacy role_id → slug mapping.
    return getActeurTypeForRole(getRoleSlug(user));
}

export function getHomeRouteForActeur(acteurType: ActeurType): string {
    switch (acteurType) {
        case 'agence':
            return '/dashboard';
        case 'organismes':
            return '/organismes/dashboard';
        case 'entreprise':
            return '/entreprise/dashboard';
    }
}
