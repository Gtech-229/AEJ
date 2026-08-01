/** TanStack Query key factory for the personnels feature. */
export const personnelsKeys = {
  all: ['personnels'] as const,
  lists: () => [...personnelsKeys.all, 'list'] as const,
};
