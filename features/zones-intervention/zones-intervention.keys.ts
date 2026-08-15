/** TanStack Query key factory for the zones d'intervention referential (§9). */
export const zonesKeys = {
  all: ['zones-intervention'] as const,
  lists: () => [...zonesKeys.all, 'list'] as const,
};
