'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { ApiError, AuthError } from '@/lib/api/errors';
import { authKeys } from './auth.keys';
import { authService } from './auth.service';
import { isPublicAuthPath } from './auth.routes';
import { SPACES, DEFAULT_SPACE, spaceForPath, type SpaceKey } from './auth.spaces';
import type { User } from './auth.dto';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  /** The web space the current route belongs to (agence / organismes / entreprise). */
  space: SpaceKey;
  /** Pending personnel id during the 2FA step (survives sign-in → OTP nav). */
  pendingUserId: number | null;
  setPending: (id: number) => void;
  clearPending: () => void;
  /** Re-check `/me` after a cookie was set (reflects the new session). */
  refreshMe: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

/**
 * Owns auth state (React Context only). Auth is PER-SPACE: the current space is
 * derived from the route, and `/me` is fetched for that space's session. Only
 * `agence` (backoffice) has live backend auth today, so a not-yet-live space
 * falls back to the backoffice session (which is also what the `FORCE_ACTEUR`
 * preview relies on). `pendingUserId` is plain state so the 2FA flow survives
 * the client nav from sign-in to the OTP page.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname();

  // Space of the current route; the session we actually authenticate against is
  // that space's — but only if its backend auth is live, else the backoffice.
  const space = spaceForPath(pathname);
  const activeSpace: SpaceKey = SPACES[space].authLive ? space : DEFAULT_SPACE;

  // The `me` query lives here (not in auth.hooks) so the dependency stays
  // one-way: hooks → context. Otherwise the two modules import each other.
  const meQuery = useQuery({
    queryKey: authKeys.me(activeSpace),
    queryFn: () => authService.me(apiClient, activeSpace),
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const [pendingUserId, setPendingUserId] = useState<number | null>(null);

  const user = meQuery.data ?? null;
  const redirectedRef = useRef(false);

  /**
   * Real route protection: `GET /me` is the source of truth, so a 401 means the
   * session is gone → bounce to the space's sign-in, preserving the destination.
   *
   * Two guards keep this from misfiring:
   *  - never redirect from a public auth route (that would loop), and
   *  - only redirect on an actual 401 — a network/500 error means the API is
   *    down, which is not the same as being logged out.
   */
  useEffect(() => {
    if (meQuery.isSuccess) {
      redirectedRef.current = false; // allow a later 401 to redirect again
      return;
    }
    if (!meQuery.isError || redirectedRef.current) return;
    if (isPublicAuthPath(pathname)) return;

    const err = meQuery.error;
    const unauthenticated =
      err instanceof AuthError || (err instanceof ApiError && err.status === 401);
    if (!unauthenticated) return;

    redirectedRef.current = true;
    const target = pathname ?? SPACES[activeSpace].homePath;
    router.replace(`${SPACES[activeSpace].loginPath}?redirect=${encodeURIComponent(target)}`);
  }, [meQuery.isSuccess, meQuery.isError, meQuery.error, pathname, router, activeSpace]);

  const refreshMe = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: authKeys.me(activeSpace) });
  }, [queryClient, activeSpace]);

  const logout = useCallback(async () => {
    try {
      await authService.logout(activeSpace);
    } catch {
      // Clear locally even if the server call fails.
    }
    setPendingUserId(null);
    queryClient.clear();
    router.replace(SPACES[activeSpace].loginPath);
  }, [queryClient, router, activeSpace]);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    loading: meQuery.isLoading,
    space,
    pendingUserId,
    setPending: setPendingUserId,
    clearPending: () => setPendingUserId(null),
    refreshMe,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
