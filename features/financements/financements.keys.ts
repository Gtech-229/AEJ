/** TanStack Query key factories for the financing entities. */
export const budgetsKeys = {
  all: ['budgets'] as const,
  lists: () => [...budgetsKeys.all, 'list'] as const,
};

export const comptesKeys = {
  all: ['compte-financements'] as const,
  lists: () => [...comptesKeys.all, 'list'] as const,
};

export const decaissementsKeys = {
  all: ['decaissements'] as const,
  lists: () => [...decaissementsKeys.all, 'list'] as const,
};

export const remboursementsKeys = {
  all: ['remboursements'] as const,
  lists: () => [...remboursementsKeys.all, 'list'] as const,
};
