/** TanStack Query key factory for the embauches feature. */
export const embauchesKeys = {
  all: ['embauches'] as const,
  lists: () => [...embauchesKeys.all, 'list'] as const,
};
