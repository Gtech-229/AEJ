/** TanStack Query key factory for the workflow-instances runtime (§8.2). */
export const workflowInstancesKeys = {
  all: ['workflow-instances'] as const,
  instances: () => [...workflowInstancesKeys.all, 'instances'] as const,
  histories: () => [...workflowInstancesKeys.all, 'histories'] as const,
  deliverables: () => [...workflowInstancesKeys.all, 'deliverables'] as const,
  comments: () => [...workflowInstancesKeys.all, 'comments'] as const,
};
