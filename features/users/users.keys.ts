/** TanStack Query key factory for the users (personnels) feature. */
export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
};