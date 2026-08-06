'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/client';
import type { ChangePasswordFormValues } from './parametrage.schema';

function changePassword(values: ChangePasswordFormValues): Promise<void> {
  return apiClient.post<void>('/auth/change-password', {
    current_password: values.current_password,
    new_password: values.new_password,
    new_password_confirmation: values.new_password_confirmation,
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (values: ChangePasswordFormValues) => changePassword(values),
    onSuccess: () => {
      toast.success('Mot de passe mis à jour avec succès.');
    },
    onError: () => {
      toast.error('Mot de passe actuel incorrect, ou requête invalide.');
    },
  });
}