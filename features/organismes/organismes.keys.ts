/** TanStack Query key factory for the organismes feature. */
export const organismesKeys = {
  all: ['organismes'] as const,
  lists: () => [...organismesKeys.all, 'list'] as const,
};
