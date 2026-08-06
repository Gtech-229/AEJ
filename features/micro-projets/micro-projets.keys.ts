/** TanStack Query key factory for the micro-projets feature. */
export const microProjetsKeys = {
  all: ['micro-projets'] as const,
  lists: () => [...microProjetsKeys.all, 'list'] as const,
};