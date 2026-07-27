/**
 * Routes reachable without a session.
 *
 * Single source of truth shared by the middleware (`proxy.ts`) and the
 * client-side guard in `AuthProvider` — if these drift apart you get redirect
 * loops (the guard bouncing you to a page the guard then bounces you off).
 */
export const PUBLIC_AUTH_PATHS = ['/auth/login', '/auth/otp'] as const;

export function isPublicAuthPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return PUBLIC_AUTH_PATHS.some((p) => pathname.startsWith(p));
}
