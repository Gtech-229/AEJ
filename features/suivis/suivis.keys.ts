/** TanStack Query key factory for the suivis feature. */
export const suivisKeys = {
  all: ['suivis'] as const,
  lists: () => [...suivisKeys.all, 'list'] as const,
};
