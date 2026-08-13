import { Suspense } from 'react';
import { AuthShell } from '@/features/auth/components/auth-shell';
import { LoginForm } from '@/features/auth/components/login-form';

export default function OrganismesLoginPage() {
  return (
    <AuthShell title="Connexion" subtitle="Accédez à votre espace organisme">
      <Suspense fallback={null}>
        <LoginForm space="organismes" />
      </Suspense>
    </AuthShell>
  );
}
