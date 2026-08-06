/** TanStack Query key factory for the indicateur-suivis feature. */
export const indicateurSuivisKeys = {
  all: ['indicateur-suivis'] as const,
  lists: () => [...indicateurSuivisKeys.all, 'list'] as const,
};
