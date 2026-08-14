import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import { toPaginated, type Paginated } from '@/lib/api/pagination';
import type { Projet, ProjetQuery } from './projects.dto';

const LIST_URL = '/projets';
const FILTER_URL = '/projets/filter';

/** `?page=&per_page=` — carried in the query string (GET list and filter POST). */
function pageQuery(q: ProjetQuery): string {
  const p = new URLSearchParams();
  p.set('page', String(q.page));
  p.set('per_page', String(q.perPage));
  return p.toString();
}

/**
 * Body for `POST /projets/filter`. `statut` / `stade_projet` / `type_projet` are
 * honored (verified live); `search` is forwarded best-effort (not honored yet).
 */
function buildFilterBody(q: ProjetQuery): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (q.statut) body.statut = q.statut;
  if (q.stade_projet) body.stade_projet = q.stade_projet;
  if (q.type_projet) body.type_projet = q.type_projet;
  if (q.search) body.search = q.search;
  return body;
}

/**
 * `/projets` is a Laravel paginator (~10 000 rows, `page`/`per_page` honored). When
 * a filter is active we `POST /projets/filter` (same paginator, pagination in the
 * query string); otherwise the plain GET list. A single project is `GET /projets/{id}`.
 */
export const projectsService = {
  getPage: async (query: ProjetQuery, client: ApiClient = apiClient): Promise<Paginated<Projet>> => {
    const body = buildFilterBody(query);
    const raw =
      Object.keys(body).length > 0
        ? await client.request<unknown>(`${FILTER_URL}?${pageQuery(query)}`, {
            method: 'POST',
            body,
          })
        : await client.request<unknown>(`${LIST_URL}?${pageQuery(query)}`);
    return toPaginated<Projet>(raw, { page: query.page, perPage: query.perPage });
  },

  getById: async (id: number, client: ApiClient = apiClient): Promise<Projet | null> => {
    const res = await client.request<{ data: Projet }>(`${LIST_URL}/${id}`);
    return res?.data ?? null;
  },
};
