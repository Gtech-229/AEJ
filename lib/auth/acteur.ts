import type { User } from '@/features/auth/auth.dto';
import { AGENCE_ROLES } from './roles';
import { INSTITUTION_ROLES } from './roles.institution';
import { ENTREPRISE_ROLES } from './roles.entreprise';

export type ActeurType = 'agence' | 'institution_financiere' | 'entreprise';

/**
 * Map a role *slug* to its acteur space. The teammate's dashboards are keyed by
 * these slugs; the new auth (`/personnel/me`) only returns `role_id`, so the
 * slug is resolved from the id via `ROLE_ID_TO_SLUG` below.
 */
export function getActeurTypeForRole(role: string | undefined): ActeurType | null {
    if (!role) return null;
    if ((AGENCE_ROLES as readonly string[]).includes(role)) return 'agence';
    if ((INSTITUTION_ROLES as readonly string[]).includes(role)) return 'institution_financiere';
    if ((ENTREPRISE_ROLES as readonly string[]).includes(role)) return 'entreprise';
    return null;
}

/**
 * Single source of truth mapping the backend's numeric `role_id` to a role slug.
 *
 * TODO(backend): `/personnel/me` returns only `role_id` today and the Rôles
 * module isn't live yet — `admin_general` (role_id 1, the super-admin) is the
 * only id confirmed so far. Fill in the entreprise/institution ids here (or,
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

/** Resolve the acteur space (agence / institution / entreprise) for a user. */
export function getActeurTypeForUser(user: User | null | undefined): ActeurType | null {
    return getActeurTypeForRole(getRoleSlug(user));
}

export function getHomeRouteForActeur(acteurType: ActeurType): string {
    switch (acteurType) {
        case 'agence':
            return '/dashboard';
        case 'institution_financiere':
            return '/institution/dashboard';
        case 'entreprise':
            return '/entreprise/dashboard';
    }
}
