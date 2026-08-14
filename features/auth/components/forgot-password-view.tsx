'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2, MailCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CharteShell, VERT, VERT_FONCE } from './charte-shell';

const forgotSchema = z.object({ email: z.email('Adresse e-mail invalide') });
type ForgotInput = z.infer<typeof forgotSchema>;

/**
 * Mot de passe oublié. Front-end only for now — the backend reset endpoint isn't
 * wired yet, so submit shows the standard security-safe confirmation (never
 * reveals whether the address has an account). When the endpoint exists, replace
 * the stubbed submit with the real mutation.
 */
export function ForgotPasswordView() {
  const [sent, setSent] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotInput>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  });

  function onSubmit() {
    // TODO(backend): call authService.requestPasswordReset(email) when available.
    setPending(true);
    setTimeout(() => {
      setPending(false);
      setSent(true);
    }, 400);
  }

  return (
    <CharteShell
      titre="Mot de passe oublié"
      sousTitre="Saisissez votre adresse e-mail pour recevoir un lien de réinitialisation."
      note={
        <>
          Vous vous souvenez de votre mot de passe ?{' '}
          <Link href="/auth/login" className="font-medium text-neutral-700 hover:text-[#00AC22] hover:underline">
            Se connecter
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="space-y-5">
          <div className="flex items-start gap-2.5 rounded-md border border-[#00AC22]/25 bg-[#00AC22]/10 px-3 py-3 text-sm text-neutral-700">
            <MailCheck className="mt-0.5 size-4 shrink-0" style={{ color: VERT }} />
            <span>
              Si un compte est associé à cette adresse, un lien de réinitialisation vient d’y être
              envoyé. Pensez à vérifier vos courriers indésirables.
            </span>
          </div>
          <Button
            asChild
            variant="outline"
            className="h-11 w-full border-neutral-300 text-neutral-700 hover:bg-neutral-50"
          >
            <Link href="/auth/login">
              <ArrowLeft className="size-4" />
              Retour à la connexion
            </Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="username"
              placeholder="prenom.nom@exemple.ci"
              disabled={pending}
              aria-invalid={!!errors.email}
              className="h-11 focus-visible:border-[#00AC22] focus-visible:ring-[#00AC22]/20"
              {...register('email')}
            />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <Button
            type="submit"
            disabled={pending}
            style={{ backgroundColor: pending ? VERT_FONCE : VERT }}
            className="h-11 w-full text-white shadow-sm transition-colors hover:brightness-95 focus-visible:ring-[#00AC22]/40"
          >
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Envoi…
              </>
            ) : (
              'Envoyer le lien'
            )}
          </Button>

          <Link
            href="/auth/login"
            className="flex items-center justify-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-[#00AC22]"
          >
            <ArrowLeft className="size-4" />
            Retour à la connexion
          </Link>
        </form>
      )}
    </CharteShell>
  );
}
