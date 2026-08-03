/** TanStack Query key factory for the indicateurs feature. */
export const indicateursKeys = {
  all: ['indicateurs'] as const,
  lists: () => [...indicateursKeys.all, 'list'] as const,
  /** Value history for one indicateur (`indicateurs_suivi`). */
  suivi: (indicateurId: number) => [...indicateursKeys.all, 'suivi', indicateurId] as const,
};
