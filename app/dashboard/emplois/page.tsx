import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query/get-query-client';
import { serverApiClient } from '@/lib/api/server';
import { embauchesKeys } from '@/features/embauches/embauches.keys';
import { embauchesService } from '@/features/embauches/embauches.service';
import { EmbauchesClient } from '@/features/embauches/embauches.client';

export const metadata = {
  title: 'Emplois générés',
};

export default async function EmploisPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: embauchesKeys.lists(),
    queryFn: () => embauchesService.getAll(serverApiClient),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EmbauchesClient />
    </HydrationBoundary>
  );
}
