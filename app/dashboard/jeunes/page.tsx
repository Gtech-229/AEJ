import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query/get-query-client';
import { serverApiClient } from '@/lib/api/server';
import { jeunesKeys } from '@/features/jeunes/jeunes.keys';
import { jeunesService } from '@/features/jeunes/jeunes.service';
import { JeunesClient } from '@/features/jeunes/jeunes.client';

// Prefetch the jeunes list on the server (cookie-forwarding client) and hydrate.
export default async function JeunesPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: jeunesKeys.lists(),
    queryFn: () => jeunesService.getAll(serverApiClient),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <JeunesClient />
    </HydrationBoundary>
  );
}
