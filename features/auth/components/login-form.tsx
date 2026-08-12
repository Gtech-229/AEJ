'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { getApiErrorMessage } from '@/lib/api/errors';
import { loginSchema, type LoginInput } from '../auth.schema';
import type { SpaceKey } from '../auth.spaces';
import { PasswordStrengthMeter } from './password-strength-meter';
import { AuthIllustration, FloatingParticles } from './auth-background';
import { StatCard } from './stat-card';
import { useLogin } from '../auth.hooks';

const REMEMBER_ME_KEY_PREFIX = 'aej_remember_email';

const PARTNER_LOGOS = [
  { name: 'PSGouv', src: '/logo-aej.jpg' },
  { name: 'BAD', src: '/partenaire/logo-BAD.jpg' },
  { name: 'NSIA', src: '/partenaire/nsia_banque.png' },
  { name: 'Ecobank', src: '/partenaire/ecobank_ci_0.jpg' },
];

interface StatItem {
  value: number;
  suffix?: string;
  label: string;
}

export interface LoginFormProps {
  space: SpaceKey;
  homeRoute: string;
  brandTitle?: string;
  brandTagline?: string;
  stats?: StatItem[];
  showPartnerLogos?: boolean;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  return hour >= 5 && hour < 18 ? 'Bonjour' : 'Bonsoir';
}

const DEFAULT_STATS: StatItem[] = [
  { value: 12723, label: 'Jeunes accompagnés' },
  { value: 5933, suffix: '+', label: 'Emplois obtenus' },
  { value: 84, suffix: '%', label: "Taux d'insertion" },
];


export function LoginForm({
  space,
  homeRoute,
  brandTitle = 'AGENCE EMPLOI JEUNES',
  brandTagline = "Le Guichet Unique de l'Emploi en Côte d'Ivoire",
  stats = DEFAULT_STATS,
  showPartnerLogos = true,
}: LoginFormProps) {
  const login = useLogin(space, homeRoute);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [greeting, setGreeting] = useState('Bonjour');

  const rememberMeKey = `${REMEMBER_ME_KEY_PREFIX}:${space}`;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', mot_de_passe: '' },
  });

  const password = watch('mot_de_passe');

  useEffect(() => {
    setGreeting(getGreeting());
    const savedEmail = localStorage.getItem(rememberMeKey);
    if (savedEmail) {
      setValue('email', savedEmail);
      setRememberMe(true);
    }
  }, [rememberMeKey, setValue]);

  function onSubmit(values: LoginInput) {
    if (rememberMe) {
      localStorage.setItem(rememberMeKey, values.email);
    } else {
      localStorage.removeItem(rememberMeKey);
    }
    // ⚠️ Suppose que LoginPayload (auth.dto) a la même forme que LoginInput
    // ({ email, mot_de_passe }). Ajuste le mapping ici si ce n'est pas le cas.
    login.mutate(values);
  }

  return (
    <div className="min-h-svh flex flex-row bg-[#F5F6F8]">
      {/* ── Panneau branding — bande étroite sur mobile, s'élargit jusqu'à 50% à partir de lg ── */}
      <div
        className="relative overflow-hidden flex flex-col justify-between gap-4 w-20 p-3 sm:w-56 sm:p-5 lg:w-1/2 lg:p-8 xl:p-10"
        style={{ background: 'linear-gradient(135deg, #1a7a3c 0%, #0f5228 100%)' }}
      >
        <FloatingParticles />

        <div className="hidden lg:flex absolute inset-0 items-center justify-center opacity-70 pointer-events-none">
          <div className="w-[280px] h-[280px] xl:w-[420px] xl:h-[420px]">
            <AuthIllustration />
          </div>
        </div>

        <div className="relative z-10">
          <Image
            src="/logo-aej-white.png"
            alt={brandTitle}
            width={200}
            height={52}
            priority
            className="w-10 sm:w-32 xl:w-[200px] h-auto"
          />
          <p className="hidden sm:block text-white/70 text-xs sm:text-sm mt-2">{brandTagline}</p>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-2 xl:gap-3">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        {showPartnerLogos && (
          <div className="relative z-10 hidden sm:block">
            <p className="text-white/50 text-[11px] uppercase tracking-wide mb-3">Partenaires du programme</p>
            <div className="flex items-center gap-4 flex-wrap">
              {PARTNER_LOGOS.map((partner) => (
                <div
                  key={partner.name}
                  className="flex items-center justify-center px-3 py-2 rounded-lg bg-white/10 border border-white/10"
                >
                  <Image
                    src={partner.src}
                    alt={partner.name}
                    width={72}
                    height={24}
                    className="h-6 w-auto object-contain opacity-90"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Panneau droit — formulaire ── */}
      <div className="flex-1 flex items-center justify-center p-5 sm:p-8 lg:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{greeting}</h1>
            <p className="text-sm text-gray-500 mt-1">Connectez-vous pour accéder à votre espace.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-600 mb-1.5">
                Adresse e-mail
              </label>
              <input
                id="email"
                type="email"
                placeholder="vous@exemple.ci"
                autoComplete="email"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm
                           focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/20 transition-all"
                {...register('email')}
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="mot_de_passe" className="block text-xs font-medium text-gray-600 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="mot_de_passe"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full px-3.5 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm
                             focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/20 transition-all"
                  {...register('mot_de_passe')}
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
              {errors.mot_de_passe && <p className="mt-1 text-xs text-red-600">{errors.mot_de_passe.message}</p>}
              <PasswordStrengthMeter password={password} />
            </div>

            <div className="flex items-center justify-between flex-wrap gap-x-3 gap-y-2">
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-600/20"
                />
                Se souvenir de moi
              </label>
              <a href="/auth/mot-de-passe-oublie" className="text-xs font-medium text-green-700 hover:underline">
                Mot de passe oublié ?
              </a>
            </div>

            {login.isError && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {getApiErrorMessage(login.error, 'Identifiants invalides. Vérifiez votre e-mail et votre mot de passe.')}
              </div>
            )}

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#1a7a3c] py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {login.isPending ? 'Connexion…' : 'Se connecter'}
              {!login.isPending && <ArrowRight size={15} />}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-1.5 text-[11px] text-gray-400">
            <ShieldCheck size={13} className="text-green-600" />
            Connexion sécurisée SSL — vos données sont chiffrées.
          </div>
        </div>
      </div>
    </div>
  );
}