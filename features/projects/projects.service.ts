import { apiClient } from '@/lib/api/client';
import type { ApiClient } from '@/lib/api/types';
import { toPaginated, type Paginated } from '@/lib/api/pagination';
import type { Projet, ProjetQuery } from './projects.dto';

const BASE_URL = '/projets';

/** `?page=&per_page=` + forwarded filters (the filters are backend-side TODO). */
function buildParams(q: ProjetQuery): string {
  const p = new URLSearchParams();
  p.set('page', String(q.page));
  p.set('per_page', String(q.perPage));
  if (q.search) p.set('search', q.search);
  if (q.statut) p.set('statut', q.statut);
  if (q.stade_projet) p.set('stade_projet', q.stade_projet);
  if (q.type_projet) p.set('type_projet', q.type_projet);
  return p.toString();
}

/**
 * `/projets` is a Laravel paginator (~10 000 rows, `page`/`per_page` honored).
 * A single project is `GET /projets/{id}`. `?promoteur_id=` is NOT honored yet,
 * so the promoteur sheet still derives its projects from a page of the list
 * (stopgap — see `getAll` + backend-asks).
 */
export const projectsService = {
  getPage: async (query: ProjetQuery, client: ApiClient = apiClient): Promise<Paginated<Projet>> => {
    const raw = await client.request<unknown>(`${BASE_URL}?${buildParams(query)}`);
    return toPaginated<Projet>(raw, { page: query.page, perPage: query.perPage });
  },

  getById: async (id: number, client: ApiClient = apiClient): Promise<Projet | null> => {
    const res = await client.request<{ data: Projet }>(`${BASE_URL}/${id}`);
    return res?.data ?? null;
  },

  /**
   * Stopgap for the promoteur sheet: `/projets` doesn't honor `?promoteur_id=`,
   * so we pull a large page and filter client-side. Incomplete against 10k rows —
   * remove once the backend scopes by promoteur (see backend-asks).
   */
  getAll: async (client: ApiClient = apiClient): Promise<Projet[]> => {
    const res = await client.request<{ data: Projet[] }>(`${BASE_URL}?per_page=200`);
    return Array.isArray(res?.data) ? res.data : [];
  },
};
