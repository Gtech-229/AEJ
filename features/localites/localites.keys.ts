/** TanStack Query key factory for the AEJ geographic referentials. */
export const localitesKeys = {
  all: ['localites'] as const,
  divisionsRegionales: () => [...localitesKeys.all, 'divisions-regionales'] as const,
  villes: () => [...localitesKeys.all, 'villes'] as const,
  communes: () => [...localitesKeys.all, 'communes'] as const,
  lieuxHabitation: () => [...localitesKeys.all, 'lieux-habitation'] as const,
};
