/**
 * Server-side pagination helpers.
 *
 * Currently UNUSED — every feature paginates client-side (fetch the whole list,
 * `GenericTable` slices it in the browser). Wire these the day a backend list
 * endpoint returns a paginated envelope. The per-feature change is small:
 *
 *   // service — return the page + metadata instead of a bare array
 *   getPage: (params: PageParams, client: ApiClient = apiClient) =>
 *     client
 *       .request<unknown>(`/jeunes?page=${params.page}&per_page=${params.perPage}` +
 *         (params.q ? `&q=${encodeURIComponent(params.q)}` : ''))
 *       .then((raw) => toPaginated<Jeune>(raw, params)),
 *
 *   // keys — include the params so each page is cached separately
 *   list: (params: PageParams) => [...jeunesKeys.all, 'list', params] as const,
 *
 *   // hook — read the URL params, keep the previous page visible while fetching
 *   export function useJeunes(params: PageParams) {
 *     return useQuery({
 *       queryKey: jeunesKeys.list(params),
 *       queryFn: () => jeunesService.getPage(params),
 *       placeholderData: keepPreviousData,
 *     });
 *   }
 *
 *   // client — drive the params from the URL and flip the table to server mode
 *   const params = usePageParams();
 *   const { data, isLoading } = useJeunes(params);
 *   <GenericTable
 *     data={data?.items ?? []}
 *     manualPagination={{ pageCount: data?.lastPage ?? 1, rowCount: data?.total }}
 *     ...
 *   />
 */

/** Query params sent to a server-paginated list endpoint. */
export interface PageParams {
  page: number;
  perPage: number;
  q?: string;
  sort?: string;
}

/** Normalized page result consumed by the UI. */
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  lastPage: number;
}

function num(value: unknown, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Normalize the common Laravel paginated shapes into `Paginated<T>`:
 *  - `{ data: T[], meta: { current_page, last_page, per_page, total } }`  (API Resource)
 *  - `{ current_page, data: T[], last_page, per_page, total }`            (LengthAwarePaginator)
 *  - `{ Message, data: <either of the above> }`                          (our app envelope)
 *
 * `params` supplies fallbacks when the backend omits a field. Defensive on
 * purpose — TODO(backend): confirm the real shape and tighten this.
 */
export function toPaginated<T>(raw: unknown, params: PageParams): Paginated<T> {
  const root = (raw ?? {}) as Record<string, unknown>;

  // Unwrap our `{ Message, data }` envelope when `data` holds the paginator object
  // (not the row array itself).
  const body: Record<string, unknown> =
    root.data && typeof root.data === 'object' && !Array.isArray(root.data)
      ? (root.data as Record<string, unknown>)
      : root;

  const items = (
    Array.isArray(body.data)
      ? body.data
      : Array.isArray(root.data)
        ? root.data
        : Array.isArray(raw)
          ? raw
          : []
  ) as T[];

  const meta = ((body.meta as Record<string, unknown>) ?? body) as Record<string, unknown>;
  const total = num(meta.total, items.length);
  const perPage = num(meta.per_page ?? meta.perPage, params.perPage);
  const page = num(meta.current_page ?? meta.page, params.page);
  const lastPage = num(
    meta.last_page ?? meta.lastPage,
    Math.max(1, Math.ceil(total / Math.max(1, perPage))),
  );

  return { items, total, page, perPage, lastPage };
}
