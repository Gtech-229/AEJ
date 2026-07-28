/** TanStack Query key factory for the directions feature. */
export const directionsKeys = {
  all: ['directions'] as const,
  lists: () => [...directionsKeys.all, 'list'] as const,
};
