import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query/get-query-client';
import { serverApiClient } from '@/lib/api/server';
import { agencesDashboardKeys } from '@/features/agences-dashboard/agences-dashboard.keys';
import { agencesDashboardService } from '@/features/agences-dashboard/agences-dashboard.service';
import { AgencesDashboardClient } from '@/features/agences-dashboard/agences-dashboard.client';

// Prefetch the 3 confirmed-shape endpoints on the server (kpis, alertes,
// projets-statut). The 3 unconfirmed ones (projets-agence, financement-agence,
// classement) still fetch client-side via their hooks — same data source,
// just not blocking the initial paint since they're currently empty anyway.
export default async function AgencesPage() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: agencesDashboardKeys.kpis(),
      queryFn: () => agencesDashboardService.kpis(serverApiClient),
    }),
    queryClient.prefetchQuery({
      queryKey: agencesDashboardKeys.alertes(),
      queryFn: () => agencesDashboardService.alertes(serverApiClient),
    }),
    queryClient.prefetchQuery({
      queryKey: agencesDashboardKeys.projetsStatut(),
      queryFn: () => agencesDashboardService.projetsStatut(serverApiClient),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AgencesDashboardClient />
    </HydrationBoundary>
  );
}
