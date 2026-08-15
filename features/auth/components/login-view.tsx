'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getApiErrorMessage } from '@/lib/api/errors';
import { useLogin } from '../auth.hooks';
import { loginSchema, type LoginInput } from '../auth.schema';
import { CharteShell, VERT, VERT_FONCE } from './charte-shell';

export type Espace = 'AEJ' | 'ORGANISME' | 'ENTREPRISE';

const ESPACES: Record<Espace, { titre: string; sousTitre: string }> = {
  AEJ: {
    titre: 'Espace AEJ',
    sousTitre: 'Connectez-vous pour accéder au suivi des dossiers.',
  },
  ORGANISME: {
    titre: 'Espace organismes',
    sousTitre: 'Connectez-vous pour traiter les dossiers qui vous sont transmis.',
  },
  ENTREPRISE: {
    titre: 'Espace entreprises',
    sousTitre: 'Connectez-vous pour déclarer vos embauches.',
  },
};

/**
 * Login form (in the AEJ charte shell). The submit, error handling, 2FA branch
 * and post-login redirect all live in `useLogin`. The generic error message
 * never reveals which of email / mot de passe / compte / espace failed.
 */
export function LoginView({
  espace = 'AEJ',
  motDePasseOublieHref = '/auth/mot-de-passe-oublie',
}: {
  espace?: Espace;
  motDePasseOublieHref?: string;
}) {
  const { titre, sousTitre } = ESPACES[espace];
  const login = useLogin();
  const [visible, setVisible] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', mot_de_passe: '' },
  });

  const chargement = login.isPending;

  return (
    <CharteShell
      titre={titre}
      sousTitre={sousTitre}
      note={
        <>
          Accès réservé. Les comptes sont créés par l’Agence Emploi Jeunes.
          <br />
          Contactez votre administrateur en cas de difficulté.
        </>
      }
    >
      <form onSubmit={handleSubmit((data) => login.mutate(data))} noValidate className="space-y-5">
        {login.error && (
          <div
            role="alert"
            aria-live="polite"
            className="flex items-start gap-2.5 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{getApiErrorMessage(login.error, 'Identifiants invalides.')}</span>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Adresse e-mail</Label>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="username"
            placeholder="prenom.nom@exemple.ci"
            disabled={chargement}
            aria-invalid={!!errors.email}
            className="h-11 focus-visible:border-[#00AC22] focus-visible:ring-[#00AC22]/20 text-foreground"
            {...register('email')}
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="motDePasse">Mot de passe</Label>
            <a
              href={motDePasseOublieHref}
              className="text-sm font-medium text-neutral-600 underline-offset-4 transition-colors hover:text-[#00AC22] hover:underline"
            >
              Mot de passe oublié ?
            </a>
          </div>
          <div className="relative">
            <Input
              id="motDePasse"
              type={visible ? 'text' : 'password'}
              autoComplete="current-password"
              disabled={chargement}
              aria-invalid={!!errors.mot_de_passe}
              className="h-11 pr-11 focus-visible:border-[#00AC22] focus-visible:ring-[#00AC22]/20 text-foreground"
              {...register('mot_de_passe')}
            />
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              tabIndex={-1}
              aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-neutral-400 transition-colors hover:text-neutral-700"
            >
              {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.mot_de_passe && (
            <p className="text-sm text-red-600">{errors.mot_de_passe.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={chargement}
          style={{ backgroundColor: chargement ? VERT_FONCE : VERT }}
          className="h-11 w-full text-white shadow-sm transition-colors hover:brightness-95 focus-visible:ring-[#00AC22]/40"
        >
          {chargement ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Connexion…
            </>
          ) : (
            'Se connecter'
          )}
        </Button>
      </form>
    </CharteShell>
  );
}
