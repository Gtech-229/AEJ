import { Suspense } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query/get-query-client';
import { serverApiClient } from '@/lib/api/server';
import { promoteursKeys } from '@/features/promoteurs/promoteurs.keys';
import { promoteursService } from '@/features/promoteurs/promoteurs.service';
import { DEFAULT_PER_PAGE } from '@/features/promoteurs/promoteurs.dto';
import { PromoteursClient } from '@/features/promoteurs/promoteurs.client';

export const metadata = {
  title: 'Promoteurs',
};

// Prefetch the first page on the server and hydrate — matches the client's
// default query (page 1, no filters) so the table paints without a refetch.
const DEFAULT_QUERY = { page: 1, perPage: DEFAULT_PER_PAGE };

export default async function PromoteursPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: promoteursKeys.list(DEFAULT_QUERY),
    queryFn: () => promoteursService.getPage(DEFAULT_QUERY, serverApiClient),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* useSearchParams (pagination + filters) needs a Suspense boundary above it. */}
      <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Chargement…</div>}>
        <PromoteursClient />
      </Suspense>
    </HydrationBoundary>
  );
}
