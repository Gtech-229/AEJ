'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api/errors';
import { authService } from './auth.service';
import type { PasswordResetPayload } from './auth.dto';

/**
 * Volontairement pas de branche d'erreur "email inconnu" ici — par bonne
 * pratique de sécurité, on affiche le même message de succès que l'email
 * existe ou non (ne pas révéler si un compte est associé à l'adresse). Seules
 * les vraies erreurs réseau/serveur remontent un toast.
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: PasswordResetPayload) => authService.requestPasswordReset(payload),
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Une erreur est survenue. Réessayez dans un instant.'));
    },
  });
}
