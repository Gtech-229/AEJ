import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query/get-query-client';
import { serverApiClient } from '@/lib/api/server';
import { rolesKeys } from '@/features/roles/roles.keys';
import { rolesService } from '@/features/roles/roles.service';
import { RolesClient } from '@/features/roles/roles.client';

export const metadata = {
  title: 'Rôles & permissions',
};

// Prefetch the roles list on the server (cookie-forwarding client) and hydrate.
export default async function RolesPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: rolesKeys.lists(),
    queryFn: () => rolesService.getAll(serverApiClient),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RolesClient />
    </HydrationBoundary>
  );
}
