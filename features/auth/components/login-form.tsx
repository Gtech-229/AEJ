'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ApiError } from '@/lib/api/client';
import { useLogin } from '../auth.hooks';
import { useAuth } from '../auth.context';
import { loginSchema, type LoginInput } from '../auth.schema';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useLogin();
  const { setPending, markSignedIn, refreshMe } = useAuth();
  const [error, setError] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', mot_de_passe: '' },
  });

  const redirect = searchParams.get('redirect') || '/dashboard';

  async function onSubmit(data: LoginInput) {
    setError('');
    try {
      const res = await login.mutateAsync(data);
      // 2FA pending → stash the id and go to the OTP screen (no session yet).
      if (res?.otp_required && res.personnel) {
        setPending(res.personnel.id_personnel_perso);
        router.push('/auth/otp');
        return;
      }
      // No 2FA → session granted (or bridge cookie) → in.
      markSignedIn();
      await refreshMe();
      router.replace(redirect);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Identifiants incorrects');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="email">Adresse email</Label>
        <Input id="email" type="email" placeholder="admin@aej.ci" {...register('email')} />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="mot_de_passe">Mot de passe</Label>
        <div className="relative">
          <Input
            id="mot_de_passe"
            type={showPwd ? 'text' : 'password'}
            placeholder="••••••••"
            className="pr-10"
            {...register('mot_de_passe')}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPwd((s) => !s)}
            aria-label={showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.mot_de_passe && (
          <p className="text-sm text-destructive">{errors.mot_de_passe.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={login.isPending}>
        {login.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
        Se connecter
      </Button>
    </form>
  );
}
