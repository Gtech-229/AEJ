'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { changePasswordSchema, type ChangePasswordFormValues } from './parametrage.schema';
import { useChangePassword } from './use-change-password';

export function ChangePasswordForm() {
    const changePassword = useChangePassword();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
    });

    async function onSubmit(values: ChangePasswordFormValues) {
        await changePassword.mutateAsync(values);
        reset();
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
                <Label htmlFor="current_password">Mot de passe actuel</Label>
                <Input id="current_password" type="password" {...register('current_password')} />
                {errors.current_password && (
                    <p className="text-xs text-destructive">{errors.current_password.message}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="new_password">Nouveau mot de passe</Label>
                    <Input id="new_password" type="password" {...register('new_password')} />
                    {errors.new_password && (
                        <p className="text-xs text-destructive">{errors.new_password.message}</p>
                    )}
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="new_password_confirmation">Confirmation</Label>
                    <Input id="new_password_confirmation" type="password" {...register('new_password_confirmation')} />
                    {errors.new_password_confirmation && (
                        <p className="text-xs text-destructive">{errors.new_password_confirmation.message}</p>
                    )}
                </div>
            </div>

            <Button type="submit" disabled={changePassword.isPending}>
                {changePassword.isPending ? 'Mise à jour…' : 'Mettre à jour le mot de passe'}
            </Button>
        </form>
    );
}