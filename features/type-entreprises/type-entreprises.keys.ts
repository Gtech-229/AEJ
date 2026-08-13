/** TanStack Query key factory for the type-entreprises referential. */
export const typeEntreprisesKeys = {
  all: ['type-entreprises'] as const,
  lists: () => [...typeEntreprisesKeys.all, 'list'] as const,
};
