import { Suspense } from 'react';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';

export const metadata = {
  title: 'Nouveau mot de passe',
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-svh flex items-center justify-center text-sm text-muted-foreground">Chargement…</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
