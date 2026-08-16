import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import type { Secteur, SousSecteur } from './secteurs.dto';

/**
 * AEJ sector referentials — READ-ONLY, under `/aej/*` on the main API (reached
 * via the `/api` rewrite), enveloped as `{ message, data: [...] }`. There is no
 * write path.
 */
const ENDPOINTS = {
  secteurs: '/aej/secteurs',
  sousSecteurs: '/aej/sous-secteurs',
} as const;

/** Unwrap the `{ message, data: [...] }` envelope (tolerates a bare array too). */
function toList<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  const data = (raw as { data?: unknown } | null | undefined)?.data;
  return Array.isArray(data) ? (data as T[]) : [];
}

export const secteursService = {
  secteurs: async (client: ApiClient = apiClient): Promise<Secteur[]> =>
    toList<Secteur>(await client.request<unknown>(ENDPOINTS.secteurs)),

  sousSecteurs: async (client: ApiClient = apiClient): Promise<SousSecteur[]> =>
    toList<SousSecteur>(await client.request<unknown>(ENDPOINTS.sousSecteurs)),
};
