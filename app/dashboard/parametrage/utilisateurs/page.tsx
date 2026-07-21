import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query/get-query-client';
import { serverApiClient } from '@/lib/api/server';
import { usersKeys } from '@/features/users/users.keys';
import { usersService } from '@/features/users/users.service';
import { UsersClient } from '@/features/users/users.client';

// Prefetch the users list on the server (cookie-forwarding client) and hydrate.
export default async function UtilisateursPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: usersKeys.lists(),
    queryFn: () => usersService.getAll(serverApiClient),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersClient />
    </HydrationBoundary>
  );
}
