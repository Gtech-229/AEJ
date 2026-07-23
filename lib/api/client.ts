/**
 * Client-side fetch instance (browser).
 *
 * Auth model: access + refresh tokens are BOTH httpOnly/Secure/SameSite=Strict
 * cookies set by the backend. JS never reads or writes a token — the browser
 * carries the cookies automatically on same-site requests, which is why every
 * request here uses `credentials: 'include'` and nothing touches
 * localStorage/sessionStorage.
 *
 * On a 401 we attempt a single-flight refresh (see `handleRefresh`) and replay
 * the original request exactly once. We never hard-redirect from inside the
 * wrapper — instead we throw `AuthError` and let a top-level error boundary /
 * the auth hook own the redirect to /login.
 */
import { env } from '@/env';
import { signalActivity } from '@/lib/activity';
import { ApiError, AuthError } from './errors';
import { toRequestInit } from './serialize';
import type { ApiClient, ApiFetch, ApiRequestOptions } from './types';

const API_BASE_URL = env.NEXT_PUBLIC_API_URL;

/**
 * Holds the in-flight refresh call, if any. This is the "single flight" latch:
 * the first 401 starts a refresh and stores its promise here; every other 401
 * that arrives while it's pending awaits this same promise instead of firing a
 * second `/auth/refresh`. Cleared as soon as the refresh settles.
 */
let refreshPromise: Promise<void> | null = null;

function buildRequest(path: string, options?: RequestInit): Promise<Response> {
  // For FormData, let the browser set `Content-Type` (with the multipart
  // boundary) — forcing application/json would corrupt the upload.
  const isFormData = options?.body instanceof FormData;
  return fetch(`${API_BASE_URL}${path}`, {
    // credentials: 'include' → httpOnly cookies ride along automatically.
    // credentials: 'include',
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options?.headers,
    },
  });
}

async function readText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return res.statusText;
  }
}

async function parseBody<T>(res: Response): Promise<T> {
  // 204 / empty body → nothing to parse.
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

/**
 * Performs the actual `POST /auth/refresh`. Relies solely on the httpOnly
 * refresh-token cookie; on success the backend sets a fresh access-token cookie
 * and we have nothing to read from the (empty) body.
 *
 * TODO(backend): `/auth/refresh` does not exist yet. Until it lands we branch
 * on 404 explicitly so "endpoint not built" is never mistaken for "refresh
 * token expired". Remove the 404 branch once the contract is live.
 */
async function performRefresh(): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  if (res.status === 404) {
    // Not built yet — surface a distinct, non-auth error so dev doesn't read
    // this as a real logout.
    throw new ApiError(
      404,
      '/auth/refresh is not implemented on the backend yet (dev stub).',
    );
  }

  if (res.status === 401) {
    // The refresh token itself is invalid/expired → hard logout.
    throw new AuthError('Refresh token invalid or expired.');
  }

  if (!res.ok) {
    throw new ApiError(res.status, await readText(res));
  }

  // 200: new access-token cookie is now set by the backend. Done.
}

/**
 * Single-flight wrapper around {@link performRefresh}. Concurrent 401s share
 * one refresh; the latch is cleared regardless of outcome so a later 401 can
 * start a fresh attempt.
 */
function handleRefresh(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = performRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

/**
 * Endpoints where a 401 means "bad credentials" / "session gone", NOT "access
 * token expired" — they must not trigger the refresh-and-retry flow.
 */
const NO_REFRESH_PREFIXES = [
  '/personnels/login',
  '/auth/login',
  '/auth/refresh',
  '/auth/logout',
  '/auth/verify-otp',
  '/auth/2fa',
  '/auth/me',
];

function shouldAttemptRefresh(path: string): boolean {
  return !NO_REFRESH_PREFIXES.some((prefix) => path.startsWith(prefix));
}

export const apiFetch: ApiFetch = async <T>(
  path: string,
  options?: RequestInit,
): Promise<T> => {
  const res = await buildRequest(path, options);

  if (res.status === 401 && shouldAttemptRefresh(path)) {
    // Await the shared refresh (starts one if none in flight). If it rejects
    // (AuthError / dev-stub ApiError) the error propagates to the caller — we
    // do NOT redirect here.
    await handleRefresh();

    // Refresh succeeded → replay the original request exactly once.
    const retry = await buildRequest(path, options);
    if (retry.status === 401) {
      // Still unauthorized after a successful refresh → treat as auth failure.
      throw new AuthError('Still unauthorized after token refresh.');
    }
    if (!retry.ok) {
      throw new ApiError(retry.status, await readText(retry));
    }
    signalActivity(); // successful response = user activity
    return parseBody<T>(retry);
  }

  if (!res.ok) {
    throw new ApiError(res.status, await readText(res));
  }

  signalActivity(); // successful response = user activity
  return parseBody<T>(res);
};

// ---------------------------------------------------------------------------
// Convenience verb helpers — client-only sugar over `apiFetch`.
//
// `apiFetch` remains the documented, service-facing shape. These helpers just
// JSON-encode the request body and return the parsed response *directly* —
// NOTE: unlike axios there is no `.data` wrapper; the resolved value IS the body.
// ---------------------------------------------------------------------------
function withJsonBody(
  method: string,
  body?: unknown,
  options?: RequestInit,
): RequestInit {
  // FormData / raw bodies pass through untouched; plain objects are JSON-encoded.
  const encoded =
    body === undefined
      ? options?.body
      : body instanceof FormData
        ? (body as BodyInit)
        : JSON.stringify(body);
  return { ...options, method, body: encoded };
}

export const apiClient: ApiClient & {
  get: <T>(path: string, options?: RequestInit) => Promise<T>;
  post: <T>(path: string, body?: unknown, options?: RequestInit) => Promise<T>;
  put: <T>(path: string, body?: unknown, options?: RequestInit) => Promise<T>;
  patch: <T>(path: string, body?: unknown, options?: RequestInit) => Promise<T>;
  delete: <T = void>(path: string, options?: RequestInit) => Promise<T>;
} = {
  // Primary, service-facing entry point. Handles JSON + multipart bodies.
  request: <T>(path: string, options?: ApiRequestOptions): Promise<T> =>
    apiFetch<T>(path, toRequestInit(options)),
  get: <T>(path: string, options?: RequestInit): Promise<T> =>
    apiFetch<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestInit): Promise<T> =>
    apiFetch<T>(path, withJsonBody('POST', body, options)),
  put: <T>(path: string, body?: unknown, options?: RequestInit): Promise<T> =>
    apiFetch<T>(path, withJsonBody('PUT', body, options)),
  patch: <T>(path: string, body?: unknown, options?: RequestInit): Promise<T> =>
    apiFetch<T>(path, withJsonBody('PATCH', body, options)),
  delete: <T = void>(path: string, options?: RequestInit): Promise<T> =>
    apiFetch<T>(path, { ...options, method: 'DELETE' }),
};

/**
 * Fetch a binary payload (report/file export) with cookies attached. Separate
 * from `apiFetch`, which always JSON-parses the response body.
 */
export async function apiDownload(path: string): Promise<Blob> {
  const res = await fetch(`${API_BASE_URL}${path}`, { credentials: 'include' });
  if (!res.ok) {
    throw new ApiError(res.status, await readText(res));
  }
  return res.blob();
}

export default apiClient;

export { ApiError, AuthError } from './errors';
export type { ApiFetch } from './types';
