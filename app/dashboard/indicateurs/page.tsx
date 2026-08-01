import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query/get-query-client';
import { serverApiClient } from '@/lib/api/server';
import { indicateursKeys } from '@/features/indicateurs/indicateurs.keys';
import { indicateursService } from '@/features/indicateurs/indicateurs.service';
import { IndicateursClient } from '@/features/indicateurs/indicateurs.client';

// Prefetch the indicateurs list on the server (cookie-forwarding client) and hydrate.
export default async function IndicateursPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: indicateursKeys.lists(),
    queryFn: () => indicateursService.getAll(serverApiClient),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <IndicateursClient />
    </HydrationBoundary>
  );
}
