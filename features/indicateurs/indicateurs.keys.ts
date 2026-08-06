/** TanStack Query key factory for the indicateurs feature. */
export const indicateursKeys = {
  all: ['indicateurs'] as const,
  lists: () => [...indicateursKeys.all, 'list'] as const,
};
