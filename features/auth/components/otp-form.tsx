'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useAuth } from '../auth.context';
import { useResendOtp, useVerifyOtp } from '../auth.hooks';

export function OtpForm() {
  const router = useRouter();
  const { pendingUserId, clearPending, markSignedIn, refreshMe } = useAuth();
  const verify = useVerifyOtp();
  const resend = useResendOtp();
  const [code, setCode] = useState('');

  // Guard: no pending user (deep link / refresh) → back to sign-in.
  useEffect(() => {
    if (pendingUserId == null) router.replace('/auth/login');
  }, [pendingUserId, router]);

  async function submit(value: string) {
    if (pendingUserId == null || verify.isPending) return;
    try {
      await verify.mutateAsync({ code: value, id_personnel_perso: pendingUserId });
      markSignedIn();
      await refreshMe();
      clearPending();
      router.replace('/dashboard');
    } catch {
      toast.error('Code invalide ou expiré');
      setCode('');
    }
  }

  function onChange(value: string) {
    setCode(value);
    if (value.length === 6) void submit(value); // auto-submit on completion
  }

  function onResend() {
    if (pendingUserId == null) return;
    resend.mutate(
      { userId: pendingUserId },
      {
        onSuccess: () => toast.success('Code envoyé par email'),
        onError: () => toast.error("Échec de l'envoi du code"),
      },
    );
  }

  if (pendingUserId == null) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3">
        <InputOTP maxLength={6} value={code} onChange={onChange} disabled={verify.isPending}>
          <InputOTPGroup>
            {Array.from({ length: 6 }).map((_, i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
        {verify.isPending && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Vérification…
          </p>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={() => router.replace('/auth/login')}
          className="text-muted-foreground hover:text-foreground"
        >
          Retour à la connexion
        </button>
        <button
          type="button"
          onClick={onResend}
          disabled={resend.isPending}
          className="font-medium text-primary hover:underline disabled:opacity-60"
        >
          Renvoyer le code
        </button>
      </div>
    </div>
  );
}
