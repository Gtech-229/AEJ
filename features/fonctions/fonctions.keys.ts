/** TanStack Query key factory for the fonctions feature. */
export const fonctionsKeys = {
  all: ['fonctions'] as const,
  lists: () => [...fonctionsKeys.all, 'list'] as const,
};