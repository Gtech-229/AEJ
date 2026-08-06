import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import { toPaginated, type Paginated } from '@/lib/api/pagination';
import {
  PROMOTEUR_FK_PARAMS,
  PROMOTEUR_PROJET_PARAMS,
  type Promoteur,
  type PromoteurQuery,
} from './promoteurs.dto';

// Public endpoint on the main backend (apis.aej-ci.net) — reached through the
// existing `/api` rewrite, so `request('/promoteurs')` hits the right host.
const BASE_URL = '/promoteurs';

function buildQuery(q: PromoteurQuery): string {
  const params = new URLSearchParams();
  params.set('page', String(q.page));
  params.set('per_page', String(q.perPage));
  // NB: the filter params below are SENT but NOT YET honored by the API
  // (verified 2026-08 — `total` is unaffected). They're forwarded so filtering
  // works the moment the backend implements it; TODO(backend): confirm/implement.
  if (q.search) params.set('search', q.search);
  if (q.statut) params.set('statut', q.statut);
  if (q.tranche_age) params.set('tranche_age', q.tranche_age);
  for (const param of [...PROMOTEUR_FK_PARAMS, ...PROMOTEUR_PROJET_PARAMS]) {
    const value = q[param];
    if (value) params.set(param, value);
  }
  return params.toString();
}

/** `GET /promoteurs` — normalizes the Laravel paginator into `Paginated<T>`. */
export const promoteursService = {
  getPage: async (
    query: PromoteurQuery,
    client: ApiClient = apiClient,
  ): Promise<Paginated<Promoteur>> => {
    const raw = await client.request<unknown>(`${BASE_URL}?${buildQuery(query)}`);
    return toPaginated<Promoteur>(raw, { page: query.page, perPage: query.perPage });
  },
};
