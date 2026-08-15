import { Suspense } from 'react';
import { LoginView } from '@/features/auth/components/login-view';

export default function LoginPage() {
  // useLogin() reads `?redirect=` via useSearchParams → needs a Suspense boundary.
  return (
    <Suspense fallback={null}>
      <LoginView espace="AEJ" />
    </Suspense>
  );
}
