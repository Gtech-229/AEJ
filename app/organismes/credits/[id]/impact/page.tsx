import { Suspense } from 'react';
import { ImpactPage } from '@/features/impact/ImpactPage';

export const metadata = { title: "Indicateurs d'impact" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Chargement…</div>}>
      <ImpactPage creditId={id} />
    </Suspense>
  );
}
