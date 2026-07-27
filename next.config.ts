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
    ];
  },
};

export default nextConfig;
