/** TanStack Query key factory for the documents feature. */
export const documentsKeys = {
  all: ['documents'] as const,
  lists: () => [...documentsKeys.all, 'list'] as const,
};
