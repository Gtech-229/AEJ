import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query/get-query-client';
import { serverApiClient } from '@/lib/api/server';
import { projectsKeys } from '@/features/projects/projects.keys';
import { projectsService } from '@/features/projects/projects.service';
import { DEFAULT_PROJETS_PER_PAGE } from '@/features/projects/projects.dto';
import { ProjectsClient } from '@/features/projects/projects.client';

export const metadata = {
  title: 'Micro-projets',
};

// Prefetch the first page of micro-projets on the server and hydrate.
export default async function ProjetsPage() {
  const queryClient = getQueryClient();
  const query = { page: 1, perPage: DEFAULT_PROJETS_PER_PAGE };

  await queryClient.prefetchQuery({
    queryKey: projectsKeys.list(query),
    queryFn: () => projectsService.getPage(query, serverApiClient),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectsClient />
    </HydrationBoundary>
  );
}
