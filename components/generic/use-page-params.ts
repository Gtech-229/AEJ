'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import type { PageParams } from '@/lib/api/pagination';

/**
 * Reads the page/size/search/sort that `GenericTable` writes to the URL and
 * returns them as `PageParams` for a server-paginated query hook. The URL keys
 * mirror `GenericTable` (`page`, `size`, `q`, `sort`) so the table and the hook
 * stay in sync off the same source of truth. Client-side features don't need
 * this — it's only for the opt-in server pagination path.
 */
export function usePageParams(defaults?: { perPage?: number }): PageParams {
  const searchParams = useSearchParams();
  const perPageDefault = defaults?.perPage ?? 10;

  const page = Math.max(1, num(searchParams.get('page'), 1));
  const perPage = num(searchParams.get('size'), perPageDefault);
  const q = searchParams.get('q') ?? undefined;
  const sort = searchParams.get('sort') ?? undefined;

  // Stable identity while the URL is unchanged, so it's safe in a query key.
  return useMemo<PageParams>(
    () => ({ page, perPage, q, sort }),
    [page, perPage, q, sort],
  );
}

function num(value: string | null, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && value !== null && value !== '' ? n : fallback;
}
