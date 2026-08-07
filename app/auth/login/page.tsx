import { Suspense } from 'react';
import { AuthShell } from '@/features/auth/components/auth-shell';
import { LoginForm } from '@/features/auth/components/login-form';

export default function LoginPage() {
  return (
    // <AuthShell
    //   title="Connexion"
    //   subtitle="Accédez à votre espace de gestion"
    //   stats={[
    //     { value: 12723, label: 'Jeunes accompagnés' },
    //     { value: 5933, suffix: '+', label: 'Emplois obtenus' },
    //     { value: 84, suffix: '%', label: "Taux d'insertion" },
    //   ]}
    // >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    // </AuthShell>
  );
}
