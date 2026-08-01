/** TanStack Query key factory for the permissions feature. */
export const permissionsKeys = {
  all: ['permissions'] as const,
  lists: () => [...permissionsKeys.all, 'list'] as const,
  byRole: (roleId: number) => [...permissionsKeys.all, 'byRole', roleId] as const,
};
