'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import UserMenu from './UserMenu';

export default function Header() {
  const [search, setSearch] = useState('');
  const { user } = useAuth();

  return (
    <header className="h-16 shrink-0 flex items-center gap-4 px-4 bg-white border-b border-gray-200 z-10">

      {/* Logo AEJ */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm"
          style={{ backgroundColor: '#1a7a3c' }}>
          AEJ
          {/* <div className="h-10 w-auto shrink-0 flex items-center">
            <img src="/logo-psg.jpeg" alt="Agence Emploi Jeunes" className="h-full w-auto object-contain" />
          </div> */}
        </div>
        <div className="hidden md:block leading-none">
          <p className="text-xs font-black" style={{ color: '#f97316' }}>
            AGENCE EMPLOI <span style={{ color: '#f97316' }}>JEUNES</span>
          </p>
          <p className="text-[10px] text-gray-400">Le Guichet Unique de l'Emploi en Côte d'Ivoire</p>
        </div>
      </div>

      {/* Badge PSGouv */}
      <button className="hidden sm:flex items-center px-3 py-1.5 rounded-lg text-xs font-bold text-white shrink-0"
        style={{ backgroundColor: '#1a7a3c' }}>
        PSGouv 2022–2024
      </button>

      {/* Barre de recherche */}
      <div className="flex-1 max-w-xl relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm
                     focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/20 transition-all"
        />
      </div>

      {/* Icônes N M S (notifications, messages, settings) */}
      <div className="flex items-center gap-2 shrink-0">
        {['N', 'M', 'S'].map(letter => (
          <button key={letter}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center
                       text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors">
            {letter}
          </button>
        ))}
      </div>

      {/* User info + menu */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden md:block text-right leading-none">
          <p className="text-sm font-semibold text-gray-800">{user?.name ?? 'Admin'}</p>
          <p className="text-xs text-gray-400">{user?.role ?? 'Super Administrateur'}</p>
        </div>
        <UserMenu />
      </div>
    </header>
  );
}