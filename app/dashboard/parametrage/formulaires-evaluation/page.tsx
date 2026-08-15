import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query/get-query-client';
import { serverApiClient } from '@/lib/api/server';
import { formulairesEvaluationKeys } from '@/features/formulaires-evaluation/formulaires-evaluation.keys';
import { formulairesEvaluationService } from '@/features/formulaires-evaluation/formulaires-evaluation.service';
import { FormulairesEvaluationClient } from '@/features/formulaires-evaluation/formulaires-evaluation.client';

export const metadata = {
  title: "Formulaires d'évaluation",
};

export default async function FormulairesEvaluationPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: formulairesEvaluationKeys.lists(),
    queryFn: () => formulairesEvaluationService.getAll(serverApiClient),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FormulairesEvaluationClient />
    </HydrationBoundary>
  );
}
