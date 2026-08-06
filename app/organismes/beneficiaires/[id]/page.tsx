import { Suspense } from 'react';
import { DossierBeneficiairePage } from '@/features/dossier-beneficiaire/DossierBeneficiairePage';

export const metadata = { title: 'Dossier bénéficiaire' };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Chargement…</div>}>
      <DossierBeneficiairePage beneficiaireId={Number(id)} />
    </Suspense>
  );
}
