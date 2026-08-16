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

/**
 * Human-readable message from an API error.
 *
 * `ApiError.message` holds the raw response body. Laravel answers validation
 * failures (422) as `{"message":"Validation failed","errors":{"field":["…"]}}`
 * — the top-level `message` is generic, so the first field-level message
 * under `errors` is far more useful when present (e.g. "The email has
 * already been taken." instead of "Validation failed"). Falls back to
 * `message`/`Message`/`error`, then the caller-provided default.
 */
export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) {
    try {
      const body = JSON.parse(err.message) as {
        message?: string;
        Message?: string;
        error?: string;
        errors?: Record<string, string[]>;
      };
      const firstFieldError = body.errors && Object.values(body.errors)[0]?.[0];
      return firstFieldError ?? body.message ?? body.Message ?? body.error ?? fallback;
    } catch {
      return err.message?.trim() || fallback;
    }
  }
  return fallback;
}