/**
 * Tiny client for the EXISTING AEJ programme API (v1.0), proxied under `/api-v1`
 * (see next.config.ts). Used only for reading public referentials, so it does
 * NOT send credentials or the Sanctum CSRF header — it's a plain same-origin GET.
 */
const AEJ_BASE = '/api-v1';

export async function aejGet<T>(path: string): Promise<T> {
  const res = await fetch(`${AEJ_BASE}${path}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`AEJ referential ${path} failed (${res.status})`);
  }
  return (await res.json()) as T;
}
