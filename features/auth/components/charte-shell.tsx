'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

/* AEJ / national charte colors, shared by the auth pages. */
export const ORANGE = '#FF8500';
export const VERT = '#00AC22';
export const VERT_FONCE = '#009A1E';

function BandeauTricolore({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('flex h-1.5 w-full shrink-0 overflow-hidden', className)}>
      <div className="flex-1" style={{ backgroundColor: ORANGE }} />
      <div className="flex-1 bg-white ring-1 ring-inset ring-neutral-200" />
      <div className="flex-1" style={{ backgroundColor: VERT }} />
    </div>
  );
}

/**
 * Full-page auth shell in the AEJ charte (tricolore bands + institutional green
 * panel). Pages drop their form into `children`; `note` is the small print under
 * it. Keeps login / mot-de-passe-oublié visually identical.
 */
export function CharteShell({
  titre,
  sousTitre,
  note,
  children,
}: {
  titre: string;
  sousTitre: string;
  note?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col bg-white">
      <BandeauTricolore />

      <div className="grid flex-1 lg:grid-cols-2">
        {/* ------------------------------ Colonne gauche ----------------------------- */}
        <div className="flex flex-col gap-8 px-6 py-8 sm:px-10 lg:px-16">
          {/* Logo visible seulement quand le panneau vert est masqué */}
          <div className="lg:hidden">
            <Image
              src="/logo-aej.jpg"
              alt="Agence Emploi Jeunes"
              width={386}
              height={131}
              priority
              className="h-11 w-auto"
            />
          </div>

          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-sm">
              <div className="mb-8">
                <div aria-hidden className="mb-5 h-0.5 w-10" style={{ backgroundColor: ORANGE }} />
                <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">{titre}</h1>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">{sousTitre}</p>
              </div>

              {children}

              {note && (
                <p className="mt-8 border-t border-neutral-100 pt-6 text-center text-xs leading-relaxed text-neutral-500">
                  {note}
                </p>
              )}
            </div>
          </div>

          {/* Pied institutionnel */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:justify-between">
            <Image
              src="/logo-psg.jpeg"
              alt="Programme Social du Gouvernement"
              width={1600}
              height={607}
              className="h-10 w-auto"
            />
            <p className="text-center text-[11px] leading-relaxed text-neutral-400 sm:text-right">
              République de Côte d’Ivoire
              <br />
              Agence Emploi Jeunes
            </p>
          </div>
        </div>

        {/* ---------------------------- Panneau vert ---------------------------- */}
        <div
          className="relative hidden overflow-hidden lg:flex lg:flex-col"
          style={{ backgroundColor: VERT }}
        >
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage:
                'repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 14px)',
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(120% 90% at 50% 0%, rgba(255,255,255,0.14) 0%, transparent 60%), linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.10) 100%)',
            }}
          />

          <div className="relative flex flex-1 flex-col items-center justify-center gap-9 px-16">
            <div className="rounded-2xl bg-white p-10 shadow-[0_1px_40px_rgba(0,0,0,0.10)]">
              <Image
                src="/logo-aej.jpg"
                alt="Agence Emploi Jeunes — Le Guichet Unique de l'Emploi en Côte d'Ivoire"
                width={386}
                height={131}
                priority
                className="h-auto w-[21rem]"
              />
            </div>

            <div className="flex flex-col items-center gap-5">
              <div aria-hidden className="h-0.5 w-12" style={{ backgroundColor: ORANGE }} />
              <p className="max-w-sm text-center text-lg font-medium leading-relaxed text-white">
                Plateforme de suivi des jeunes, des projets et des financements.
              </p>
            </div>
          </div>

          <div className="relative px-16 pb-10">
            <p className="text-center text-xs tracking-wide text-white/70">
              République de Côte d’Ivoire · Programme Social du Gouvernement
            </p>
          </div>

          <BandeauTricolore className="relative" />
        </div>
      </div>
    </div>
  );
}
