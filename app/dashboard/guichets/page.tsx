import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query/get-query-client';
import { serverApiClient } from '@/lib/api/server';
import { guichetsKeys } from '@/features/guichets/guichets.keys';
import { guichetsService } from '@/features/guichets/guichets.service';
import { GuichetsClient } from '@/features/guichets/guichets.client';

export const metadata = {
  title: 'Guichets',
};

export default async function GuichetsPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: guichetsKeys.lists(),
    queryFn: () => guichetsService.getAll(serverApiClient),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GuichetsClient />
    </HydrationBoundary>
  );
}
