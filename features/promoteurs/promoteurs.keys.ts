/** TanStack Query key factory for the promoteurs feature. */
export const promoteursKeys = {
  all: ['promoteurs'] as const,
  lists: () => [...promoteursKeys.all, 'list'] as const,
};
