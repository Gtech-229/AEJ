/** TanStack Query key factory for the emplois-prévus referential. */
export const emploisPrevusKeys = {
  all: ['emplois-prevus'] as const,
  lists: () => [...emploisPrevusKeys.all, 'list'] as const,
};
