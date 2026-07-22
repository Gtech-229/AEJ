import { AuthShell } from '@/features/auth/components/auth-shell';
import { OtpForm } from '@/features/auth/components/otp-form';

export default function OtpPage() {
  return (
    <AuthShell
      title="Vérification en deux étapes"
      subtitle="Saisissez le code à 6 chiffres envoyé par email."
    >
      <OtpForm />
    </AuthShell>
  );
}
