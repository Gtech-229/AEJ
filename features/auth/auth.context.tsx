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
import { ApiError, AuthError } from '@/lib/api/errors';
import { authKeys } from './auth.keys';
import { authService } from './auth.service';
import { isPublicAuthPath } from './auth.routes';
import type { User } from './auth.dto';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  /** Pending personnel id during the 2FA step (survives sign-in → OTP nav). */
  pendingUserId: number | null;
  setPending: (id: number) => void;
  clearPending: () => void;
  /** Re-check `/auth/me` after a cookie was set (reflects the new session). */
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
 * Owns auth state (React Context only). `user`/`isAuthenticated` come from
 * `GET /auth/me` (React Query); `pendingUserId` is plain state so the 2FA flow
 * survives the client nav from sign-in to the OTP page.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  // The `me` query lives here (not in auth.hooks) so the dependency stays
  // one-way: hooks → context. Otherwise the two modules import each other.
  const meQuery = useQuery({
    queryKey: authKeys.me(),
    queryFn: () => authService.me(),
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const [pendingUserId, setPendingUserId] = useState<number | null>(null);

  const user = meQuery.data ?? null;

  const pathname = usePathname();
  const redirectedRef = useRef(false);

  /**
   * Real route protection: `GET /personnel/me` is the source of truth, so a 401
   * means the session is gone → bounce to sign-in, preserving the destination.
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
    const target = pathname ?? '/dashboard';
    router.replace(`/auth/login?redirect=${encodeURIComponent(target)}`);
  }, [meQuery.isSuccess, meQuery.isError, meQuery.error, pathname, router]);

  const refreshMe = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: authKeys.me() });
  }, [queryClient]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Clear locally even if the server call fails.
    }
    // The backend clears the accessToken/refreshToken cookies on logout.
    setPendingUserId(null);
    queryClient.clear();
    router.replace('/auth/login');
  }, [queryClient, router]);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    loading: meQuery.isLoading,
    pendingUserId,
    setPending: setPendingUserId,
    clearPending: () => setPendingUserId(null),
    refreshMe,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
