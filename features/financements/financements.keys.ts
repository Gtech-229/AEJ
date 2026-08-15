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

export const plansKeys = {
  all: ['plan-decaissements'] as const,
  lists: () => [...plansKeys.all, 'list'] as const,
};

export const transactionsKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionsKeys.all, 'list'] as const,
};

export const decaissementDeclarationsKeys = {
  all: ['decaissements-declarations'] as const,
  lists: () => [...decaissementDeclarationsKeys.all, 'list'] as const,
};

export const remboursementDeclarationsKeys = {
  all: ['remboursements-declarations'] as const,
  lists: () => [...remboursementDeclarationsKeys.all, 'list'] as const,
};

export const categoriesTransactionsKeys = {
  all: ['categories-transactions'] as const,
  lists: () => [...categoriesTransactionsKeys.all, 'list'] as const,
};
