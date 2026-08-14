/** TanStack Query key factory for the workflow configuration module. */
export const workflowKeys = {
  all: ['workflow'] as const,
  models: () => [...workflowKeys.all, 'models'] as const,
  versions: () => [...workflowKeys.all, 'versions'] as const,
  roles: () => [...workflowKeys.all, 'roles'] as const,
  deliverables: () => [...workflowKeys.all, 'deliverables'] as const,
  decisionOutcomes: () => [...workflowKeys.all, 'decision-outcomes'] as const,
  etapes: () => [...workflowKeys.all, 'etapes'] as const,
  etapeSlas: () => [...workflowKeys.all, 'etape-slas'] as const,
  etapeDeliverables: () => [...workflowKeys.all, 'etape-deliverables'] as const,
  etapeRoles: () => [...workflowKeys.all, 'etape-roles'] as const,
  etapeDecisions: () => [...workflowKeys.all, 'etape-decisions'] as const,
};
