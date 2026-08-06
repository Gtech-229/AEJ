'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { useAuth } from '@/features/auth/auth.context';
import { getUserDisplayName } from '@/features/auth/auth.dto';
import { getRoleSlug } from '@/lib/auth/acteur';
import { ROLE_LABELS, type UserRole } from '@/lib/auth/roles';
import UserMenu from '@/components/layout/UserMenu';

export interface AppHeaderProps {
  /** Texte du ruban vert en haut. */
  ribbonText?: string;
  /** Sigle affiché dans le carré logo (ex: "AEJ"). Ignoré si `logoSrc` est fourni. */
  logoBadge?: string;
  /** Chemin d'une image de logo (dans /public) ; prioritaire sur `logoBadge`. */
  logoSrc?: string;
  /** Titre affiché à côté du logo. */
  title: string;
  /** Sous-titre affiché sous le titre. */
  subtitle: string;
  /** Libellé du badge coloré (ex: "PSGouv 2022–2024"). Masqué si vide. */
  badgeLabel?: string;
  /** Libellé de repli pour le rôle si l'utilisateur ou son rôle sont introuvables. */
  fallbackRoleLabel?: string;
}

/**
 * Header partagé par les espaces Agence / Organismes / Entreprise. Le contenu
 * (logo, titre, badge, ruban) est piloté par props ; l'identité de
 * l'utilisateur connecté (nom + rôle) vient toujours du même contexte d'auth
 * partagé, quel que soit l'espace.
 */
export default function AppHeader({
  ribbonText = 'Programme Social du Gouvernement 2022–2024',
  logoBadge = 'AEJ',
  logoSrc,
  title,
  subtitle,
  badgeLabel = 'PSGouv 2022–2024',
  fallbackRoleLabel = 'Utilisateur',
}: AppHeaderProps) {
  const [search, setSearch] = useState('');
  const { user } = useAuth();
  const roleSlug = getRoleSlug(user);
  const roleLabel = roleSlug ? ROLE_LABELS[roleSlug as UserRole] ?? roleSlug : fallbackRoleLabel;

  return (
    <div className="shrink-0">
      {/* Ruban vert */}
      <div className="bg-[#1a7a3c] text-white text-[11px] text-center py-1 px-4">
        {ribbonText}
      </div>

      <header className="h-16 flex items-center gap-4 px-4 bg-white border-b border-gray-200 z-10">

        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm overflow-hidden shrink-0"
            style={{ backgroundColor: '#1a7a3c' }}
          >
            {logoSrc ? (
              <img src={logoSrc} alt={title} className="w-full h-full object-contain p-1" />
            ) : (
              logoBadge
            )}
          </div>
          <div className="hidden md:block leading-none">
            <p className="text-xs font-black" style={{ color: '#f97316' }}>
              {title}
            </p>
            <p className="text-[10px] text-gray-400">{subtitle}</p>
          </div>
        </div>

        {/* Badge */}
        {badgeLabel && (
          <button
            className="hidden sm:flex items-center px-3 py-1.5 rounded-lg text-xs font-bold text-white shrink-0"
            style={{ backgroundColor: '#1a7a3c' }}
          >
            {badgeLabel}
          </button>
        )}

        {/* Recherche */}
        <div className="flex-1 max-w-xl relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm
                       focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/20 transition-all"
          />
        </div>

        {/* Icônes N M S */}
        <div className="flex items-center gap-2 shrink-0">
          {['N', 'M', 'S'].map((letter) => (
            <button
              key={letter}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center
                         text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {letter}
            </button>
          ))}
        </div>

        {/* User */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden md:block text-right leading-none">
            <p className="text-sm font-semibold text-gray-800">{getUserDisplayName(user)}</p>
            <p className="text-xs text-gray-400">{roleLabel}</p>
          </div>
          <UserMenu />
        </div>
      </header>
    </div>
  );
}
