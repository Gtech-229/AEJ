/**
 * Shared, typed errors for the API layer.
 *
 * These live in one place so that both the client instance (`lib/api/client.ts`)
 * and the server instance (`lib/api/server.ts`) throw the *same* classes — a
 * caller can `instanceof`-check either one regardless of which context produced
 * it.
 */

/**
 * Thrown on any non-2xx response once the refresh/retry logic has been
 * exhausted. Carries the HTTP status and a message extracted from the response
 * body.
 */
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    // Preserve prototype chain when targeting ES5-ish output.
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Thrown when authentication cannot be recovered:
 * - client: a 401 whose refresh attempt also failed (invalid/expired refresh
 *   token) — the caller (error boundary / auth hook) should redirect to /login.
 * - server: any 401 (we never refresh server-side) — the calling Server
 *   Component should `redirect('/login')`.
 *
 * The fetch wrappers intentionally do NOT redirect themselves.
 */
export class AuthError extends Error {
  constructor(message = 'Authentication required') {
    super(message);
    this.name = 'AuthError';
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}
