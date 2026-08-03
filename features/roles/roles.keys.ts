/** TanStack Query key factory for the roles feature. */
export const rolesKeys = {
  all: ['roles'] as const,
  lists: () => [...rolesKeys.all, 'list'] as const,
};
