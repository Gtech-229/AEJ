/** TanStack Query key factory for the evaluation forms feature. */
export const formulairesEvaluationKeys = {
  all: ['formulaires-evaluation'] as const,
  lists: () => [...formulairesEvaluationKeys.all, 'list'] as const,
};
