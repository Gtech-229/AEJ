/** TanStack Query key factory for the localites feature. */
export const localitesKeys = {
  all: ['localites'] as const,
  lists: () => [...localitesKeys.all, 'list'] as const,
};