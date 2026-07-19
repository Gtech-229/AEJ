import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

/**
 * Returns the right QueryClient for the current execution context:
 *
 * - **Server**: a *per-request* client, memoized with React's `cache()` so it's
 *   shared within a single request/render but never across requests — a
 *   module-level singleton on the server would leak one user's data into
 *   another's response.
 * - **Client**: a lazily-created singleton, reused across every render for the
 *   lifetime of the tab.
 */
function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Avoids immediate client refetch of data hydrated from the server.
        staleTime: 60 * 1000,
      },
    },
  });
}

// Per-request on the server: `cache()` scopes one instance to one request.
const getServerQueryClient = cache(makeQueryClient);

// Singleton on the client.
let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    return getServerQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
