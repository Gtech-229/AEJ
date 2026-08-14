import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query/get-query-client';
import { serverApiClient } from '@/lib/api/server';
import { workflowInstancesKeys } from '@/features/workflow-instances/workflow-instances.keys';
import { workflowInstancesService } from '@/features/workflow-instances/workflow-instances.service';
import { WorkflowExecutionsClient } from '@/features/workflow-instances/executions.client';

export const metadata = {
  title: 'Exécutions',
};

export default async function ExecutionsPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: workflowInstancesKeys.instances(),
    queryFn: () => workflowInstancesService.getInstances(serverApiClient),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WorkflowExecutionsClient />
    </HydrationBoundary>
  );
}
