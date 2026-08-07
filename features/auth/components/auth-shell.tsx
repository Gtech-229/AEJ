import { ShieldCheck } from 'lucide-react';
import { AuthIllustration, FloatingParticles } from './auth-background';
import { StatCard } from './stat-card';
import Image from 'next/image';

const PARTNER_LOGOS = [
  { name: 'PSGouv', src: '/logo-aej.jpg' },
  { name: 'BAD', src: '/partenaire/logo-BAD.jpg' },
  { name: 'NSIA', src: '/partenaire/nsia_banque.png' },
  { name: 'Ecobank', src: '/partenaire/ecobank_ci_0.jpg' },
];

interface AuthStat {
  value: number;
  suffix?: string;
  label: string;
}

/**
 * Branded card shell shared by the sign-in and OTP pages.
 *
 * `stats` is opt-in and only meant for the login page — leave it unset on the
 * OTP screen (or any other consumer) to keep the header band unchanged there.
 */
export function AuthShell({
  title,
  subtitle,
  stats,
  children,
}: {
  title: string;
  subtitle?: string;
  stats?: AuthStat[];
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative flex min-h-svh items-center justify-center overflow-hidden p-4"
      style={{ background: 'linear-gradient(135deg, #1a7a3c 0%, #0f5228 100%)' }}
    >
      <FloatingParticles />
      <div className="absolute inset-0 flex items-center justify-center opacity-70 pointer-events-none">
        <div className="w-[520px] h-[520px]">
          <AuthIllustration />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md" style={{ animation: 'auth-card-fade-in 0.4s ease-out' }}>
        <div className="overflow-hidden rounded-3xl bg-card shadow-2xl">
          <div className="px-8 py-8 text-center text-white" style={{ backgroundColor: '#1a7a3c' }}>
            <span className="text-2xl font-bold tracking-tight">
              Agence <span style={{ color: '#f97316' }}>Emploi</span> Jeunes
            </span>
            <p className="mt-1 text-sm text-white/70">Programme Social du Gouvernement</p>

            {stats && stats.length > 0 && (
              <div className="mt-5 grid grid-cols-3 gap-2">
                {stats.map((s) => (
                  <StatCard key={s.label} {...s} />
                ))}
              </div>
            )}
          </div>
          <div className="px-8 py-8">
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
            {subtitle && <p className="mt-1 mb-6 text-sm text-muted-foreground">{subtitle}</p>}
            {!subtitle && <div className="mb-6" />}
            {children}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
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
        <div className="flex items-center gap-1.5 text-[11px] text-white/50">
          <ShieldCheck size={12} />
          Connexion sécurisée SSL
        </div>
        <p className="text-center text-xs text-white/50">
          © 2026 Agence Emploi Jeunes | Financement BAD
        </p>
      </div>
    </div>
  );
}
