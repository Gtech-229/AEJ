import type { PromoteurQuery } from './promoteurs.dto';

/** TanStack Query key factory for the promoteurs feature. */
export const promoteursKeys = {
  all: ['promoteurs'] as const,
  lists: () => [...promoteursKeys.all, 'list'] as const,
  /** One cache entry per page/filter combination. */
  list: (query: PromoteurQuery) => [...promoteursKeys.lists(), query] as const,
};
