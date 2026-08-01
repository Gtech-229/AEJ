import { aejGet } from '@/lib/api/aej';
import type { RefItem } from './referentials.types';

/**
 * Existing AEJ programme API (v1.0) referential endpoints — reused as-is.
 * Confirmed by the team:
 *  /secteurs · /sous-secteurs · /niveaux-etudes · /list-agence-regionale
 *  /types-pieces-identites · /situations-matrimoniale
 */
export const REFERENTIAL_ENDPOINTS = {
  secteurs: '/secteurs',
  sousSecteurs: '/sous-secteurs',
  niveauxEtudes: '/niveaux-etudes',
  agencesRegionales: '/list-agence-regionale',
  typesPiecesIdentites: '/types-pieces-identites',
  situationsMatrimoniales: '/situations-matrimoniale',
} as const;

/** Unwrap the possible AEJ response shapes (bare array or `{ data: [...] }`). */
function toList(raw: unknown): RefItem[] {
  if (Array.isArray(raw)) return raw as RefItem[];
  const data = (raw as { data?: unknown })?.data;
  return Array.isArray(data) ? (data as RefItem[]) : [];
}

async function fetchRef(path: string): Promise<RefItem[]> {
  return toList(await aejGet<unknown>(path));
}

export const referentialsService = {
  secteurs: () => fetchRef(REFERENTIAL_ENDPOINTS.secteurs),
  sousSecteurs: () => fetchRef(REFERENTIAL_ENDPOINTS.sousSecteurs),
  niveauxEtudes: () => fetchRef(REFERENTIAL_ENDPOINTS.niveauxEtudes),
  agencesRegionales: () => fetchRef(REFERENTIAL_ENDPOINTS.agencesRegionales),
  typesPiecesIdentites: () => fetchRef(REFERENTIAL_ENDPOINTS.typesPiecesIdentites),
  situationsMatrimoniales: () => fetchRef(REFERENTIAL_ENDPOINTS.situationsMatrimoniales),
};
