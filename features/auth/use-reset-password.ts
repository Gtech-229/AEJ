'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api/errors';
import { authService } from './auth.service';
import type { ResetPasswordInput } from './reset-password.schema';

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ResetPasswordInput) => authService.setPassword(payload),
    onSuccess: () => {
      toast.success('Mot de passe défini avec succès. Vous pouvez vous connecter.');
      router.push('/auth/login');
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(err, "Ce lien n'est plus valide ou a expiré. Refaites une demande de réinitialisation."),
      );
    },
  });
}
