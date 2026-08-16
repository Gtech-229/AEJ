/** TanStack Query key factory for the mega-projets (programmes) referential. */
export const megaProjetsKeys = {
  all: ['mega-projets'] as const,
  lists: () => [...megaProjetsKeys.all, 'list'] as const,
};
