'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import type { ChangePasswordFormValues } from './parametrage.schema';


export function useChangePassword() {
    const { changePassword } = useAuth();

    return useMutation({
        mutationFn: (values: ChangePasswordFormValues) =>
            changePassword(
                values.current_password,
                values.new_password,
                values.new_password_confirmation,
            ),
        onSuccess: () => {
            toast.success('Mot de passe mis à jour avec succès.');
        },
        onError: () => {
            toast.error('Mot de passe actuel incorrect, ou requête invalide.');
        },
    });
}