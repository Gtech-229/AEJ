import { Suspense } from 'react';
import { ProjetsParametrageClient } from '@/features/projets-parametrage/projets-parametrage.client';

export const metadata = {
  title: 'Projets & dispositifs',
};

export default function ProjetsParametragePage() {
  // GenericTable reads pagination from the URL (useSearchParams) → needs a
  // Suspense boundary so static prerender doesn't bail.
  return (
    <Suspense fallback={null}>
      <ProjetsParametrageClient />
    </Suspense>
  );
}
