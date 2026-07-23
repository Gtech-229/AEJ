'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { authKeys } from './auth.keys';
import { authService } from './auth.service';
import { useMe } from './auth.hooks';
import type { User } from './auth.dto';

// ---------------------------------------------------------------------------
// TODO(backend): the guard cookie is a temporary bridge. `/personnels/login`
// currently returns the token in the JSON body and does NOT set a cookie, so we
// drop a NON-httpOnly marker cookie purely so the route-guard middleware
// (proxy.ts) lets us into the dashboard. Once the backend sets a Secure httpOnly
// session cookie, delete this and the middleware will read the real cookie.
// ---------------------------------------------------------------------------
const GUARD_COOKIE = 'aej_token';

function setGuardCookie() {
  document.cookie = `${GUARD_COOKIE}=session; path=/; max-age=604800; samesite=strict`;
}

function clearGuardCookie() {
  document.cookie = `${GUARD_COOKIE}=; path=/; max-age=0`;
}

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
  /** Bridge: drop the guard cookie so middleware lets us in (until httpOnly). */
  markSignedIn: () => void;
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
  const meQuery = useMe();
  const [pendingUserId, setPendingUserId] = useState<number | null>(null);

  const user = meQuery.data ?? null;

  const refreshMe = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: authKeys.me() });
  }, [queryClient]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Clear locally even if the server call fails.
    }
    setPendingUserId(null);
    clearGuardCookie();
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
    markSignedIn: setGuardCookie,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
