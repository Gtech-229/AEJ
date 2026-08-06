/** TanStack Query key factory for the workflow feature. */
export const dossiersKeys = {
  all: ['workflow'] as const,
  lists: () => [...dossiersKeys.all, 'list'] as const,
};
