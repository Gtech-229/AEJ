'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import apiClient, { ApiError } from '@/lib/api/client';

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
// TODO(backend): remove this dev bypass once /auth/* endpoints exist.
// Until the backend is live, a login can't obtain a real httpOnly cookie, so we
// drop a temporary NON-httpOnly marker cookie purely so the route-guard
// middleware (proxy.ts) lets us into the prototype. This is NOT a token store.
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
    queryFn: () => apiClient.get<CurrentUser>('/auth/me'),
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
      queryClient.clear();
      router.push('/auth/login');
    },
  });

  async function login(email: string, password: string) {
    try {
      await loginMutation.mutateAsync({ email, password });
      router.push('/dashboard/dashboard');
    } catch (err) {
      // DEV fallback: let the prototype through while the backend is absent.
      // Remove together with GUARD_COOKIE once /auth/login is live.
      if (isBackendAbsent(err)) {
        setDevGuardCookie();
        router.push('/dashboard/dashboard');
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
    logout: () => logoutMutation.mutateAsync().catch(() => {}),
    changePassword,
  };
}
