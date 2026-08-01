import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query/get-query-client';
import { serverApiClient } from '@/lib/api/server';
import { personnelsKeys } from '@/features/personnels/personnels.keys';
import { personnelsService } from '@/features/personnels/personnels.service';
import { PersonnelsClient } from '@/features/personnels/personnels.client';

// Prefetch the personnels list on the server (cookie-forwarding client) and hydrate.
export default async function PersonnelsPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: personnelsKeys.lists(),
    queryFn: () => personnelsService.getAll(serverApiClient),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PersonnelsClient />
    </HydrationBoundary>
  );
}
