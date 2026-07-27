/**
 * The single React ↔ non-React bridge for user activity.
 *
 * The API client (`lib/api/client.ts`) has no React access, so on every
 * successful response it fires a `window` event. The `SessionProvider` listens
 * for it and resets the inactivity countdown. SSR-guarded — the client fetch
 * only runs in the browser, but the guard keeps it safe if imported elsewhere.
 */
export const ACTIVITY_EVENT = 'app:activity';

export function signalActivity(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(ACTIVITY_EVENT));
  }
}
