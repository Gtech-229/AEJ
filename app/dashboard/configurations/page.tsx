import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query/get-query-client';
import { serverApiClient } from '@/lib/api/server';
import { configurationsKeys } from '@/features/configurations/configurations.keys';
import { configurationsService } from '@/features/configurations/configurations.service';
import { ConfigurationsClient } from '@/features/configurations/configurations.client';

// Prefetch the config on the server (injecting the cookie-forwarding client)
// and hydrate the client cache under the same key, so the page paints without a
// client refetch.
export default async function ConfigurationsPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: configurationsKeys.detail(),
    queryFn: () => configurationsService.getConfigurations(serverApiClient),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ConfigurationsClient />
    </HydrationBoundary>
  );
}
