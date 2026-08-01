import type { NextConfig } from "next";

/**
 * Backend origin, proxied through Next rewrites so the BROWSER only ever talks
 * to our own origin. That makes every API/Sanctum call same-origin:
 *  - no CORS at all (the API's `Access-Control-Allow-Origin: *` can't be used
 *    with `credentials: 'include'` anyway),
 *  - the Laravel session + XSRF cookies are first-party (no SameSite=None).
 *
 * Server-side code (RSC prefetch) can't use a relative URL, so it calls
 * `${BACKEND_ORIGIN}/api` directly — see `lib/api/server.ts`.
 */
const BACKEND_ORIGIN =
  process.env.BACKEND_ORIGIN ?? "https://apis.aej-ci.net/public";

/**
 * The EXISTING AEJ programme API (v1.0). We reuse some of its referentials
 * (secteurs, sous-secteurs, niveaux-études, agences, pièces d'identité,
 * situations matrimoniales) as-is instead of rewriting those routes. Proxied
 * under `/api-v1` so the browser stays same-origin (no CORS). The `api-v1`
 * prefix is intentionally NOT matched by the auth middleware (proxy.ts).
 */
const PROGRAMME_ORIGIN =
  process.env.PROGRAMME_ORIGIN ?? "https://agenceemploijeunes.ci";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      // Sanctum CSRF / session handshake (GET /sanctum/csrf-cookie)
      {
        source: "/sanctum/:path*",
        destination: `${BACKEND_ORIGIN}/sanctum/:path*`,
      },
      // REST API
      {
        source: "/api/:path*",
        destination: `${BACKEND_ORIGIN}/api/:path*`,
      },
      // Existing AEJ programme API v1.0 (referentials reused as-is)
      {
        source: "/api-v1/:path*",
        destination: `${PROGRAMME_ORIGIN}/api/v1.0/:path*`,
      },
    ];
  },
};

export default nextConfig;
