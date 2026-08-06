import { Suspense } from 'react';
import { RemboursementPage } from '@/features/remboursement/RemboursementPage';

export const metadata = { title: 'Plan de remboursement' };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Chargement…</div>}>
      <RemboursementPage creditId={id} />
    </Suspense>
  );
}
