/** TanStack Query key factory for the observations feature. */
export const observationsKeys = {
  all: ['observations'] as const,
  lists: () => [...observationsKeys.all, 'list'] as const,
};
