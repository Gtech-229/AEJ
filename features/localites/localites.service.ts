import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type { Commune, DivisionRegionale, LieuHabitation, Ville } from './localites.dto';

/**
 * AEJ geographic referentials — READ-ONLY, under `/aej/*` on the main API
 * (reached via the `/api` rewrite), enveloped as `{ message, data: [...] }`.
 * The old CRUD `/localites` endpoint was dropped backend-side; there is no
 * write path, so this service only reads.
 */
const ENDPOINTS = {
  divisionsRegionales: '/aej/division-regionale',
  villes: '/aej/villes',
  communes: '/aej/communes',
  lieuxHabitation: '/aej/lieu-habitations',
} as const;

/** Unwrap the `{ message, data: [...] }` envelope (tolerates a bare array too). */
function toList<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  const data = (raw as { data?: unknown } | null | undefined)?.data;
  return Array.isArray(data) ? (data as T[]) : [];
}

export const localitesService = {
  divisionsRegionales: async (client: ApiClient = apiClient): Promise<DivisionRegionale[]> =>
    toList<DivisionRegionale>(await client.request<unknown>(ENDPOINTS.divisionsRegionales)),

  villes: async (client: ApiClient = apiClient): Promise<Ville[]> =>
    toList<Ville>(await client.request<unknown>(ENDPOINTS.villes)),

  communes: async (client: ApiClient = apiClient): Promise<Commune[]> =>
    toList<Commune>(await client.request<unknown>(ENDPOINTS.communes)),

  lieuxHabitation: async (client: ApiClient = apiClient): Promise<LieuHabitation[]> =>
    toList<LieuHabitation>(await client.request<unknown>(ENDPOINTS.lieuxHabitation)),
};
