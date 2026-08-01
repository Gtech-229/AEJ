/** TanStack Query key factory for the type-organismes referential. */
export const typeOrganismesKeys = {
  all: ['type-organismes'] as const,
  lists: () => [...typeOrganismesKeys.all, 'list'] as const,
};
