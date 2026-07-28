'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { PasswordInput } from './password.schema';

/**
 * SIMULATED — intégrations API suspendues (directive équipe). Aucune route
 * de changement de mot de passe pour un utilisateur déjà connecté n'a été
 * confirmée côté backend à ce jour (seuls /password/reset et /password/set,
 * pour le flux "mot de passe oublié" par email, sont documentés).
 *
 * Point de branchement unique : remplacer le corps de `mutationFn` une fois
 * la route confirmée par l'équipe backend.
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: async (payload: PasswordInput) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return payload;
    },
    onSuccess: () => {
      toast.success('Mot de passe modifié (simulation — non connecté au backend)');
    },
    onError: () => {
      toast.error('Échec de la modification du mot de passe');
    },
  });
}