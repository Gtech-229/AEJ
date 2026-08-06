/** TanStack Query key factory for the autres feature. */
export const elementsKeys = {
  all: ['autres'] as const,
  lists: () => [...elementsKeys.all, 'list'] as const,
};
