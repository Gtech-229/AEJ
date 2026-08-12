import { LoginForm } from '@/features/auth/components/login-form';
import { Suspense } from 'react';

export const metadata = {
  title: 'Connexion — Organismes financiers',
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-svh flex items-center justify-center text-sm text-muted-foreground">Chargement…</div>}>
      <LoginForm
        space="organismes"
        homeRoute="/organismes/dashboard"
        brandTitle="ORGANISMES FINANCIERS"
        brandTagline="Espace dédié aux banques et institutions de microfinance partenaires"
        stats={[
          { value: 3421, label: 'Crédits actifs' },
          { value: 91, suffix: '%', label: 'Taux de remboursement' },
          { value: 1250, suffix: 'M', label: 'Portefeuille (FCFA)' },
        ]}
        showPartnerLogos={false}
      />
    </Suspense>
  );
}