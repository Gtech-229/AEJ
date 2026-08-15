/** TanStack Query key factory for the dispositifs referential (§11). */
export const dispositifsKeys = {
  all: ['dispositifs'] as const,
  lists: () => [...dispositifsKeys.all, 'list'] as const,
};
