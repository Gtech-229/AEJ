import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import { toPaginated, type Paginated } from '@/lib/api/pagination';
import {
  PROMOTEUR_FK_PARAMS,
  PROMOTEUR_PROJET_PARAMS,
  type Promoteur,
  type PromoteurQuery,
} from './promoteurs.dto';

const LIST_URL = '/promoteurs';
const FILTER_URL = '/promoteurs/filter-with-projects';

/** `?page=&per_page=` — pagination is carried in the query string on both routes. */
function pageQuery(q: PromoteurQuery): string {
  const params = new URLSearchParams();
  params.set('page', String(q.page));
  params.set('per_page', String(q.perPage));
  return params.toString();
}

/**
 * Body for `POST /promoteurs/filter`. FK ids + statut go as numbers (matching the
 * confirmed contract); tranche_age / search / projet_* stay strings. The projet_*
 * and search keys are sent best-effort — the endpoint doesn't cover them yet, but
 * forwarding them means they light up the moment the backend does.
 */
function buildFilterBody(q: PromoteurQuery): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (q.search) body.search = q.search;
  if (q.tranche_age) body.tranche_age = q.tranche_age;
  if (q.statut) body.statut = Number(q.statut);
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
    const body = buildFilterBody(query);
    const raw =
      Object.keys(body).length > 0
        ? await client.request<unknown>(`${FILTER_URL}?${pageQuery(query)}`, {
            method: 'POST',
            body,
          })
        : await client.request<unknown>(`${LIST_URL}?${pageQuery(query)}`);
    return toPaginated<Promoteur>(raw, { page: query.page, perPage: query.perPage });
  },
};
