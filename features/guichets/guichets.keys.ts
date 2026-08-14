/** TanStack Query key factory for the guichets referential. */
export const guichetsKeys = {
  all: ['guichets'] as const,
  lists: () => [...guichetsKeys.all, 'list'] as const,
};
