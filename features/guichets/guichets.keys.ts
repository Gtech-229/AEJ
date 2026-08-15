/** TanStack Query key factory for the guichets referential (§10). */
export const guichetsKeys = {
  all: ['guichets'] as const,
  lists: () => [...guichetsKeys.all, 'list'] as const,
};
