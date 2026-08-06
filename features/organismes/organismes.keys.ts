export const organismesKeys = {
  all: ['organismes'] as const,

  lists: () => [...organismesKeys.all, 'list'] as const,

  detail: (id: number) => [...organismesKeys.all, id] as const,
};