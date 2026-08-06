import { Suspense } from 'react';
import { BeneficiairesPage } from '@/features/beneficiaires/BeneficiairesPage';

export const metadata = { title: 'Bénéficiaires' };

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Chargement…</div>}>
      <BeneficiairesPage />
    </Suspense>
  );
}
