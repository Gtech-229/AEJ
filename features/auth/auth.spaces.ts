/**
 * Per-space auth registry — the single source of truth for the three web spaces
 * (see `.claude/system_purpoes.md` / `.claude/backend-asks.md`).
 *
 * Architecture decision (2026-07): authentication is PER-SPACE — each space has
 * its own login endpoint, session cookie and `/me`, so the dashboard space is
 * known structurally (which login the session came through), not from the role.
 *
 * Today only `agence` (the AEJ backoffice) has live backend auth; `organismes`
 * and `entreprise` are declared here with best-guess endpoints and
 * `authLive: false` until the backend auth tables/endpoints land — flip the flag
 * (and confirm the paths/cookie) then, with no other frontend change.
 */

import type { ActeurType } from '@/lib/auth/acteur';

/** A space key is exactly an acteur/dashboard type. */
export type SpaceKey = ActeurType; // 'agence' | 'organismes' | 'entreprise'

export interface SpaceConfig {
  key: SpaceKey;
  label: string;
  /** URL prefix that identifies routes belonging to this space. */
  routePrefix: string;
  /** Where unauthenticated users of this space sign in. */
  loginPath: string;
  /** Landing route once authenticated. */
  homePath: string;
  /** Backend endpoints for this space's session. */
  endpoints: { login: string; me: string; logout: string };
  /**
   * Cookie the middleware checks to gate this space's routes. Sanctum issues one
   * session cookie per guard; TODO(backend) confirm the per-space names.
   */
  sessionCookie: string;
  /** True once the backend auth for this space exists. Others are preview-only. */
  authLive: boolean;
}

export const SPACES: Record<SpaceKey, SpaceConfig> = {
  agence: {
    key: 'agence',
    label: 'Backoffice AEJ',
    routePrefix: '/dashboard',
    loginPath: '/auth/login',
    homePath: '/dashboard',
    endpoints: { login: '/personnels/login', me: '/personnel/me', logout: '/personnel/logout' },
    sessionCookie: 'laravel-session',
    authLive: true,
  },
  organismes: {
    key: 'organismes',
    label: 'Espace organismes',
    routePrefix: '/organismes',
    loginPath: '/organismes/login',
    homePath: '/organismes/dashboard',
    // TODO(backend): confirm endpoints + cookie once the organismes auth table is live.
    endpoints: {
      login: '/organismes/auth/login',
      me: '/organismes/auth/me',
      logout: '/organismes/auth/logout',
    },
    sessionCookie: 'laravel-session', // TODO(backend)
    authLive: false,
  },
  entreprise: {
    key: 'entreprise',
    label: 'Espace entreprises',
    routePrefix: '/entreprise',
    loginPath: '/entreprise/login',
    homePath: '/entreprise/dashboard',
    // TODO(backend): confirm — the existing prototype assumed `/entreprise/auth/login`.
    endpoints: {
      login: '/entreprise/auth/login',
      me: '/entreprise/auth/me',
      logout: '/entreprise/auth/logout',
    },
    sessionCookie: 'laravel-session', // TODO(backend)
    authLive: false,
  },
};

export const DEFAULT_SPACE: SpaceKey = 'agence';

/** The space a pathname belongs to (by route prefix); defaults to the backoffice. */
export function spaceForPath(pathname: string | null | undefined): SpaceKey {
  if (pathname) {
    for (const space of Object.values(SPACES)) {
      if (space.key !== DEFAULT_SPACE && pathname.startsWith(space.routePrefix)) {
        return space.key;
      }
    }
  }
  return DEFAULT_SPACE;
}
