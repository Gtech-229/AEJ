import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import { toPaginated, type Paginated } from '@/lib/api/pagination';
import {
  PROMOTEUR_FK_PARAMS,
  PROMOTEUR_PROJET_PARAMS,
  type Promoteur,
  type PromoteurQuery,
} from './promoteurs.dto';

const FILTER_URL = '/promoteurs/filter-with-projects';

/** `?page=&per_page=` — pagination is carried in the query string on both routes. */
function pageQuery(q: PromoteurQuery): string {
  const params = new URLSearchParams();
  params.set('page', String(q.page));
  params.set('per_page', String(q.perPage));
  return params.toString();
}

/**
 * Body for `POST /promoteurs/filter-with-projects`. FK ids go as numbers; the
 * project filters (`statut` / `stade_projet` / `type_projet`) and `tranche_age`
 * stay strings — all verified honored live (2026-08). `search` is forwarded
 * best-effort — the endpoint doesn't cover it yet, but sending it means it lights
 * up the moment the backend does.
 */
function buildFilterBody(q: PromoteurQuery): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (q.search) body.search = q.search;
  if (q.tranche_age) body.tranche_age = q.tranche_age;
  for (const param of PROMOTEUR_FK_PARAMS) {
    const value = q[param];
    if (value) body[param] = Number(value);
  }
  for (const param of PROMOTEUR_PROJET_PARAMS) {
    const value = q[param];
    if (value) body[param] = value;
  }
  return body;
}

export const promoteursService = {
  /**
   * Paginated promoteurs. When any filter is active we POST the filter body to
   * `/promoteurs/filter`; otherwise we GET the plain paginated list. Both return
   * a Laravel paginator, normalized by `toPaginated`.
   */
  getPage: async (
    query: PromoteurQuery,
    client: ApiClient = apiClient,
  ): Promise<Paginated<Promoteur>> => {
    // Always POST `filter-with-projects` (empty body = full list) so every row
    // embeds the promoteur's `micro_projets` — the detail sheet reads them directly,
    // no per-promoteur fetch needed.
    const raw = await client.request<unknown>(`${FILTER_URL}?${pageQuery(query)}`, {
      method: 'POST',
      body: buildFilterBody(query),
    });
    return toPaginated<Promoteur>(raw, { page: query.page, perPage: query.perPage });
  },
};
