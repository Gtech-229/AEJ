'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import apiClient, { ApiError, AuthError } from '@/lib/api/client';
import { findMockAccount, setMockSession, clearMockSession, readMockSession } from '../lib/api/mock-auth';

/**
 * Cookie-only auth. The access/refresh tokens are httpOnly cookies set by the
 * backend — JS never reads or writes a token, and there is no localStorage
 * involved. The current user is resolved from the API (`GET /auth/me`), not
 * from a decoded token, and login/logout go through the cookie endpoints.
 */
export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export const authKeys = {
  me: ['auth', 'me'] as const,
};

// ---------------------------------------------------------------------------
// TODO(backend): remove this whole dev bypass once /auth/* endpoints exist.
// Until the backend is live, login/me are served from an in-memory mock
// account directory (see mock-auth.ts) instead of real httpOnly cookies —
// GUARD_COOKIE / mock-session below are NOT a token store, just a way to
// remember which mock user is "logged in" across a page refresh.
// ---------------------------------------------------------------------------
const GUARD_COOKIE = 'aej_token';

function setDevGuardCookie() {
  document.cookie = `${GUARD_COOKIE}=dev; path=/; max-age=604800; samesite=strict`;
}

function clearDevGuardCookie() {
  document.cookie = `${GUARD_COOKIE}=; path=/; max-age=0`;
}

/** Backend not built yet: connection refused surfaces as a TypeError from
 * fetch, and a 404 means the route isn't implemented. Either way it's "not
 * built", not "bad credentials". */
function isBackendAbsent(err: unknown): boolean {
  return err instanceof TypeError || (err instanceof ApiError && err.status === 404);
}

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: authKeys.me,
    queryFn: async (): Promise<CurrentUser | null> => {
      try {
        return await apiClient.get<CurrentUser>('/auth/me');
      } catch (err) {
        if (isBackendAbsent(err)) {
          // Backend absent → fall back to whichever mock account "logged in".
          // No mock session cookie means nobody is logged in (not an error).
          return readMockSession();
        }
        throw err;
      }
    },
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const loginMutation = useMutation({
    mutationFn: (creds: { email: string; password: string }) =>
      apiClient.post<void>('/auth/login', creds),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.me });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiClient.post<void>('/auth/logout'),
    // Clear client cache + redirect regardless of whether the call succeeded.
    onSettled: () => {
      clearDevGuardCookie();
      clearMockSession();
      queryClient.clear();
      router.push('/auth/login');
    },
  });

  async function login(email: string, password: string) {
    try {
      await loginMutation.mutateAsync({ email, password });
      router.push('/dashboard');
    } catch (err) {
      // DEV fallback: while the backend is absent, check the mock account
      // directory instead of trusting any credentials.
      // Remove together with mock-auth.ts once /auth/login is live.
      if (isBackendAbsent(err)) {
        const mockUser = findMockAccount(email, password);
        if (!mockUser) {
          throw new AuthError('Identifiants invalides (mode démo — backend indisponible).');
        }
        setDevGuardCookie();
        setMockSession(mockUser);
        await queryClient.invalidateQueries({ queryKey: authKeys.me });
        router.push('/dashboard');
        return;
      }
      throw err;
    }
  }

  function changePassword(
    current_password: string,
    new_password: string,
    new_password_confirmation: string,
  ) {
    return apiClient.post<void>('/auth/change-password', {
      current_password,
      new_password,
      new_password_confirmation,
    });
  }

  return {
    user: userQuery.data ?? null,
    loading: userQuery.isLoading,
    login,
    logout: () => logoutMutation.mutateAsync().catch(() => { }),
    changePassword,
  };
}
