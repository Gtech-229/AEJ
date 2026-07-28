import { z } from 'zod';

/**
 * Centralized, validated environment variables.
 *
 * Import `env` (client-safe) or `getServerEnv()` (server-only) instead of
 * reading `process.env` directly. A missing/invalid value throws at startup
 * with a clear message rather than misbehaving silently.
 *
 * NEXT_PUBLIC_* variables are inlined by Next at build time, so they must be
 * referenced statically below (never via a dynamic `process.env[key]`).
 */

/** Accepts an absolute URL (https://…) or a root-relative path (/api). */
const baseUrl = z
  .string()
  .min(1)
  .refine((v) => v.startsWith('/') || /^https?:\/\//.test(v), {
    message:
      'doit être une URL absolue (https://…) ou un chemin relatif (ex : /api, proxifié par les rewrites)',
  });

const clientSchema = z.object({
  /**
   * Base path the BROWSER calls. With the Next rewrites this is relative
   * (`/api`) so requests stay same-origin (no CORS, first-party cookies).
   */
  NEXT_PUBLIC_API_URL: baseUrl,
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

const parsed = clientSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NODE_ENV: process.env.NODE_ENV,
});

function fail(issues: { path: PropertyKey[]; message: string }[]): never {
  const details = issues
    .map((issue) => `  • ${issue.path.join('.') || '(env)'} : ${issue.message}`)
    .join('\n');
  throw new Error(`\n❌ Variables d'environnement invalides ou manquantes :\n${details}\n`);
}

if (!parsed.success) fail(parsed.error.issues);

/** Typed, validated client-safe environment variables. */
export const env = parsed.data;

// ── Server-only ──────────────────────────────────────────────────────────────
const serverSchema = z.object({
  /** Absolute backend origin (no trailing slash), e.g. https://host/public. */
  BACKEND_ORIGIN: z.url('BACKEND_ORIGIN doit être une URL absolue (ex : https://apis.aej-ci.net/public)'),
});

let cachedServerEnv: z.infer<typeof serverSchema> | null = null;

/**
 * Server-only env. Never call this from client code — it is validated lazily so
 * the value never has to exist in the browser bundle.
 */
export function getServerEnv() {
  if (typeof window !== 'undefined') {
    throw new Error('getServerEnv() is server-only and must not be called in the browser.');
  }
  if (cachedServerEnv) return cachedServerEnv;
  const result = serverSchema.safeParse({ BACKEND_ORIGIN: process.env.BACKEND_ORIGIN });
  if (!result.success) fail(result.error.issues);
  cachedServerEnv = result.data;
  return cachedServerEnv;
}
