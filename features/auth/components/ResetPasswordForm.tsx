'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Eye, EyeOff, TriangleAlert } from 'lucide-react';
import Link from 'next/link';
import { resetPasswordSchema, type ResetPasswordInput } from '../reset-password.schema';
import { useResetPassword } from '../use-reset-password';
import { PasswordStrengthMeter } from './password-strength-meter';
import { AuthShell } from './auth-shell';


export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const uid = searchParams.get('uid') ?? '';
  const token = searchParams.get('token') ?? '';
  const emailForDisplay = searchParams.get('email');

  const resetPassword = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { uid, token, new_password: '', confirm_new_password: '' },
  });

  const password = watch('new_password');

  if (!uid || !token) {
    return (
      <AuthShell title="Lien invalide" subtitle="Ce lien de réinitialisation est incomplet ou a expiré.">
        <div className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
            <TriangleAlert size={22} className="text-amber-600" />
          </div>
          <p className="text-sm text-gray-600">
            Redemandez un lien de réinitialisation depuis la page de connexion.
          </p>
          <Link
            href="/auth/mot-de-passe-oublie"
            className="mt-6 inline-flex items-center justify-center gap-1.5 text-sm font-medium text-green-700 hover:underline"
          >
            Mot de passe oublié
          </Link>
        </div>
      </AuthShell>
    );
  }

  function onSubmit(values: ResetPasswordInput) {
    resetPassword.mutate(values);
  }

  return (
    <AuthShell
      title="Nouveau mot de passe"
      subtitle={emailForDisplay ? `Pour le compte ${emailForDisplay}` : undefined}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="new_password" className="block text-xs font-medium text-gray-600 mb-1.5">
            Nouveau mot de passe
          </label>
          <div className="relative">
            <input
              id="new_password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="new-password"
              className="w-full px-3.5 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm
                         focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/20 transition-all"
              {...register('new_password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.new_password && <p className="mt-1 text-xs text-red-600">{errors.new_password.message}</p>}
          <PasswordStrengthMeter password={password} />
        </div>

        <div>
          <label htmlFor="confirm_new_password" className="block text-xs font-medium text-gray-600 mb-1.5">
            Confirmation
          </label>
          <input
            id="confirm_new_password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="new-password"
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm
                       focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/20 transition-all"
            {...register('confirm_new_password')}
          />
          {errors.confirm_new_password && (
            <p className="mt-1 text-xs text-red-600">{errors.confirm_new_password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={resetPassword.isPending}
          className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#1a7a3c] py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {resetPassword.isPending ? 'Enregistrement…' : 'Définir le mot de passe'}
          {!resetPassword.isPending && <ArrowRight size={15} />}
        </button>
      </form>
    </AuthShell>
  );
}