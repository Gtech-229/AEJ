import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query/get-query-client';
import { serverApiClient } from '@/lib/api/server';
import { secteursKeys } from '@/features/secteurs/secteurs.keys';
import { secteursService } from '@/features/secteurs/secteurs.service';
import { SecteursClient } from '@/features/secteurs/secteurs.client';

// Prefetch the default tab (secteurs) on the server and hydrate.
export default async function SecteursPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: secteursKeys.secteurs(),
    queryFn: () => secteursService.secteurs(serverApiClient),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SecteursClient />
    </HydrationBoundary>
  );
}
