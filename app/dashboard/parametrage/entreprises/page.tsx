import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query/get-query-client';
import { serverApiClient } from '@/lib/api/server';
import { entreprisesKeys } from '@/features/entreprises/entreprises.keys';
import { entreprisesService } from '@/features/entreprises/entreprises.service';
import { EntreprisesClient } from '@/features/entreprises/entreprises.client';

// Prefetch the entreprises list on the server (cookie-forwarding client) and hydrate.
export default async function EntreprisesPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: entreprisesKeys.lists(),
    queryFn: () => entreprisesService.getAll(serverApiClient),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EntreprisesClient />
    </HydrationBoundary>
  );
}
