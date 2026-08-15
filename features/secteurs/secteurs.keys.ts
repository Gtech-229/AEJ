/** TanStack Query key factory for the AEJ sector referentials. */
export const secteursKeys = {
  all: ['secteurs-ref'] as const,
  secteurs: () => [...secteursKeys.all, 'secteurs'] as const,
  sousSecteurs: () => [...secteursKeys.all, 'sous-secteurs'] as const,
};
