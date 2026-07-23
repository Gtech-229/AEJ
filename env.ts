import { z } from 'zod';

/**
 * Centralized, validated environment variables.
 *
 * Import `env` from here instead of reading `process.env` directly. If a
 * required variable is missing or malformed, the app throws at startup with a
 * clear message (fail fast) rather than misbehaving silently.
 *
 * NEXT_PUBLIC_* variables are inlined by Next at build time, so they must be
 * referenced statically below (never via a dynamic `process.env[key]`).
 *
 * NOTE: this module is safe to import on the client because it only reads
 * public (NEXT_PUBLIC_*) values. If you add server-only secrets, validate them
 * in a `typeof window === 'undefined'` guarded block so they never reach the
 * client bundle.
 */
const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url(
    'NEXT_PUBLIC_API_URL doit être une URL valide (ex : http://localhost:8000/api)',
  ),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NODE_ENV: process.env.NODE_ENV,
});

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `  • ${issue.path.join('.') || '(env)'} : ${issue.message}`)
    .join('\n');
  throw new Error(
    `\n❌ Variables d'environnement invalides ou manquantes :\n${details}\n`,
  );
}

/** Typed, validated environment variables. */
export const env = parsed.data;
