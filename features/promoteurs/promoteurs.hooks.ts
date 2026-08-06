'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { PromoteurQuery } from './promoteurs.dto';
import { promoteursKeys } from './promoteurs.keys';
import { promoteursService } from './promoteurs.service';

/**
 * Paginated promoteurs list. `keepPreviousData` keeps the current page visible
 * while the next one loads, so paging/filtering doesn't flash an empty table.
 */
export function usePromoteurs(query: PromoteurQuery) {
  return useQuery({
    queryKey: promoteursKeys.list(query),
    queryFn: () => promoteursService.getPage(query),
    placeholderData: keepPreviousData,
  });
}
