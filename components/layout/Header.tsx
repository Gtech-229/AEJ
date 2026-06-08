'use client';

import { useState } from 'react';
import { Search, Settings, KeyRound, FolderOpen, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const initiale = user?.name?.charAt(0).toUpperCase() ?? 'A';

  return (
    <header className="bg-[#1a7a3c] px-6 py-4 flex items-center justify-between shrink-0">
      {/* Barre de recherche */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={16} />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Rechercher..."
          className="w-full pl-10 pr-4 py-2.5 bg-white/15 backdrop-blur-sm text-white placeholder-white/50
                     rounded-2xl text-sm border border-white/20 focus:outline-none focus:bg-white/20 
                     focus:border-white/40 transition-all"
        />
      </div>

      {/* Avatar + menu */}
      <div className="relative ml-4">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center
                     text-white font-bold transition-colors"
        >
          {initiale}
        </button>

        {menuOpen && (
          <>
            {/* Overlay invisible */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuOpen(false)}
            />

            {/* Dropdown */}
            <div className="absolute right-0 top-12 z-20 bg-white rounded-2xl shadow-xl w-56 py-2 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-semibold text-gray-800 text-sm">{user?.name ?? 'Admin'}</p>
                <p className="text-gray-400 text-xs">{user?.email ?? ''}</p>
              </div>

              <nav className="py-1">
                <Link
                  href="/parametrage/profil"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <Settings size={16} className="text-gray-400" />
                  Paramètres
                </Link>
                <Link
                  href="/parametrage/mot-de-passe"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <KeyRound size={16} className="text-gray-400" />
                  Changer mot de passe
                </Link>
                <Link
                  href="/documents"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <FolderOpen size={16} className="text-gray-400" />
                  Mes documents
                </Link>

                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={() => { setMenuOpen(false); logout(); }}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 
                               w-full text-left transition-colors"
                  >
                    <LogOut size={16} />
                    Déconnexion
                  </button>
                </div>
              </nav>
            </div>
          </>
        )}
      </div>
    </header>
  );
}