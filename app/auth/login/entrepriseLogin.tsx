import { LoginForm } from '@/features/auth/components/login-form';
import { Suspense } from 'react';

export const metadata = {
  title: 'Connexion — Entreprises partenaires',
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-svh flex items-center justify-center text-sm text-muted-foreground">Chargement…</div>}>
      <LoginForm
        space="entreprise"
        homeRoute="/entreprises/dashboard"
        brandTitle="ENTREPRISES PARTENAIRES"
        brandTagline="Espace dédié aux entreprises partenaires"
        stats={[
          { value: 121,  label: 'Emploi créé' },
          { value: 91, suffix: '%', label: 'Taux de satisfaction' },
          { value: 1250, suffix: 'N', label: 'Stagiaires' },
          { value: 1250, suffix: 'N', label: 'Projets financés' },

        ]}
        showPartnerLogos={false}
      />
    </Suspense>
  );
}