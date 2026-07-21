/**
 * Query-key factory for the configurations feature. Shared between the server
 * prefetch and the client hook so invalidation stays consistent.
 */
export const configurationsKeys = {
  all: ['configurations'] as const,
  detail: () => [...configurationsKeys.all, 'detail'] as const,
};
