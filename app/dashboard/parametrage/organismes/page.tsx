import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query/get-query-client';
import { serverApiClient } from '@/lib/api/server';
import { organismesKeys } from '@/features/organismes/organismes.keys';
import { organismesService } from '@/features/organismes/organismes.service';
import { OrganismesClient } from '@/features/organismes/organismes.client';

// Prefetch the organismes list on the server (cookie-forwarding client) and hydrate.
export default async function OrganismesPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: organismesKeys.lists(),
    queryFn: () => organismesService.getAll(serverApiClient),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrganismesClient />
    </HydrationBoundary>
  );
}
