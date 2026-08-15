import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query/get-query-client';
import { serverApiClient } from '@/lib/api/server';
import { workflowKeys } from '@/features/workflows/workflow.keys';
import { workflowModelsService } from '@/features/workflows/workflow.service';
import { WorkflowsClient } from '@/features/workflows/workflows.client';

export const metadata = {
  title: 'Workflows',
};

// Prefetch the workflow models on the server and hydrate.
export default async function WorkflowsPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: workflowKeys.models(),
    queryFn: () => workflowModelsService.getAll(serverApiClient),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WorkflowsClient />
    </HydrationBoundary>
  );
}
