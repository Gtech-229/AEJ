/**
 * Server-side fetch instance (Server Components / Route Handlers / Server
 * Actions only).
 *
 * Server-side fetch has no browser cookie jar, so we must read the incoming
 * request's cookies via `next/headers` and forward them explicitly on the
 * outgoing `Cookie` header. Cookie *values* are never logged or exposed.
 *
 * There is no refresh-and-retry here: a Server Component has no shared browser
 * session to update mid-render. A 401 throws `AuthError` immediately and the
 * calling Server Component is expected to `redirect('/login')`.
 *
 * Exposes the same signature as the client `apiFetch` (see `ApiFetch`) so a
 * service can be called with either instance interchangeably.
 */
import { cookies } from 'next/headers';
import { getServerEnv } from '@/env';
import { ApiError, AuthError } from './errors';
import { toRequestInit } from './serialize';
import type { ApiClient, ApiFetch, ApiRequestOptions } from './types';

/**
 * Server-side fetch can't use the browser's relative `/api` base (there is no
 * origin to resolve it against, and the Next rewrite only applies to browser
 * requests). So we call the backend directly and forward the cookies.
 */
const API_BASE_URL = `${getServerEnv().BACKEND_ORIGIN}/api`;

async function readText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return res.statusText;
  }
}

export const serverApiFetch: ApiFetch = async <T>(
  path: string,
  options?: RequestInit,
): Promise<T> => {
  const cookieStore = await cookies();
  // Serialized "name=value; name2=value2" — forwarded verbatim, never logged.
  const cookieHeader = cookieStore.toString();

  const isFormData = options?.body instanceof FormData;
  const res = await fetch(`${API_BASE_URL}${path}`, {
    // Server render data should not be implicitly cached unless a caller opts in.
    cache: 'no-store',
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...options?.headers,
    },
  });

  if (res.status === 401) {
    // No server-side refresh — hand off to the Server Component to redirect.
    throw new AuthError('Unauthenticated on the server.');
  }

  if (!res.ok) {
    throw new ApiError(res.status, await readText(res));
  }

  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
};

/**
 * High-level server API surface (same shape as the browser `apiClient`).
 * Inject this into a feature service during a server prefetch so it forwards
 * the request's cookies. Handles JSON + multipart bodies.
 */
export const serverApiClient: ApiClient = {
  request: <T>(path: string, options?: ApiRequestOptions): Promise<T> =>
    serverApiFetch<T>(path, toRequestInit(options)),
};

export { ApiError, AuthError } from './errors';
export type { ApiFetch } from './types';
