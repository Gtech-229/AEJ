/** Query-key factory for the users feature. */
export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  detail: (id: number) => [...usersKeys.all, 'detail', id] as const,
};
