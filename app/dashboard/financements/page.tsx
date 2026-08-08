import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query/get-query-client';
import { serverApiClient } from '@/lib/api/server';
import {
  budgetsKeys,
  comptesKeys,
  decaissementsKeys,
  remboursementsKeys,
} from '@/features/financements/financements.keys';
import {
  budgetsService,
  comptesService,
  decaissementsService,
  remboursementsService,
} from '@/features/financements/financements.service';
import { FinancementsClient } from '@/features/financements/financements.client';

export const metadata = {
  title: 'Financements',
};

export default async function FinancementsPage() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: budgetsKeys.lists(),
      queryFn: () => budgetsService.getAll(serverApiClient),
    }),
    queryClient.prefetchQuery({
      queryKey: comptesKeys.lists(),
      queryFn: () => comptesService.getAll(serverApiClient),
    }),
    queryClient.prefetchQuery({
      queryKey: decaissementsKeys.lists(),
      queryFn: () => decaissementsService.getAll(serverApiClient),
    }),
    queryClient.prefetchQuery({
      queryKey: remboursementsKeys.lists(),
      queryFn: () => remboursementsService.getAll(serverApiClient),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FinancementsClient />
    </HydrationBoundary>
  );
}
