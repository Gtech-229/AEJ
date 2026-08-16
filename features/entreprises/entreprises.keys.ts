/** TanStack Query key factory for the entreprises feature. */
export const entreprisesKeys = {
  all: ['entreprises'] as const,
  lists: () => [...entreprisesKeys.all, 'list'] as const,
};
