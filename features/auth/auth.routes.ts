import { SPACES } from './auth.spaces';

/**
 * Routes reachable without a session.
 *
 * Single source of truth shared by the middleware (`proxy.ts`) and the
 * client-side guard in `AuthProvider` — if these drift apart you get redirect
 * loops (the guard bouncing you to a page the guard then bounces you off).
 *
 * Every space's `loginPath` (agence/organismes/entreprise) is public by
 * construction — deriving the list from `SPACES` means a new space's sign-in
 * page can't be forgotten here. `/auth/otp` is backoffice-only today (2FA
 * isn't wired for the other spaces yet).
 */
export const PUBLIC_AUTH_PATHS = [
  ...Object.values(SPACES).map((s) => s.loginPath),
  '/auth/otp',
] as const;

export function isPublicAuthPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return PUBLIC_AUTH_PATHS.some((p) => pathname.startsWith(p));
}
