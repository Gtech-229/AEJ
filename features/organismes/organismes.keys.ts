export const organismesKeys = {
  all: ['organismes'] as const,
  lists: () => [...organismesKeys.all, 'list'] as const,
};