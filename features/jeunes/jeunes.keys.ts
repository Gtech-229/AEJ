/** TanStack Query key factory for the jeunes feature. */
export const jeunesKeys = {
  all: ['jeunes'] as const,
  lists: () => [...jeunesKeys.all, 'list'] as const,
};
