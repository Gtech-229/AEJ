'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api/errors';
import { authService } from './auth.service';
import { useAuth } from './auth.context';
import type {
  LoginPayload,
  LoginResponse,
  ResendOtpPayload,
  VerifyOtpPayload,
} from './auth.dto';

/**
 * Auth mutations own their side effects — feedback (toast), error handling and
 * the conditional redirect all live here, so the forms stay presentational.
 * Same pattern as the other feature hooks (useCreateUser, useUpdateConfigurations…).
 *
 * NOTE: `useLogin` reads `useSearchParams()` for the post-login `?redirect=`,
 * so any component using it must sit under a <Suspense> boundary (the sign-in
 * page already does).
 */

/** Step 1 — submit credentials, then branch on 2FA. */
export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setPending, refreshMe } = useAuth();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: async (res: LoginResponse) => {
      // 2FA pending → no session cookie yet; stash the id, go enter the code.
      if (res.otp_required) {
        setPending(res.user_id);
        toast.info('Un code de vérification vous a été envoyé par email.');
        router.push('/auth/otp');
        return;
      }
      // No 2FA → the backend has set the session cookies.
    const resRefresh =  await refreshMe();
   
      toast.success(res.message || 'Connexion réussie');
      console.log("refresh res ", resRefresh);
      router.push('/dashboard')
      router.replace(searchParams.get('redirect') || '/dashboard');
   
    },
   
  });
}

/** Step 2 — verify the emailed code; the server sets the session cookie. */
export function useVerifyOtp() {
  const router = useRouter();
  const { clearPending, refreshMe } = useAuth();

  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => authService.verifyOtp(payload),
    onSuccess: async () => {
      await refreshMe();
      clearPending();
      toast.success('Connexion réussie');
      router.replace('/dashboard');
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Code invalide ou expiré'));
    },
  });
}

/** Resend the emailed OTP. */
export function useResendOtp() {
  return useMutation({
    mutationFn: (payload: ResendOtpPayload) => authService.resendOtp(payload),
    onSuccess: () => toast.success('Code envoyé par email'),
    onError: (err) => {
      toast.error(getApiErrorMessage(err, "Échec de l'envoi du code"));
    },
  });
}
