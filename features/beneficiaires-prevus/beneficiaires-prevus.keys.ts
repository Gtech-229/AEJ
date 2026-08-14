/** TanStack Query key factory for the bénéficiaires-prévus referential. */
export const beneficiairesPrevusKeys = {
  all: ['beneficiaires-prevus'] as const,
  lists: () => [...beneficiairesPrevusKeys.all, 'list'] as const,
};
