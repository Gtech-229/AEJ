/** TanStack Query key factory for the finances feature. */
export const operationsKeys = {
  all: ['finances'] as const,
  lists: () => [...operationsKeys.all, 'list'] as const,
};
