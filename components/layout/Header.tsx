'use client';
import { useState } from 'react';
import { Search, Settings, KeyRound, FolderOpen, LogOut, User, Settings2, BriefcaseBusiness, Building2, Users, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  // const [searchValue, setSearchValue] = useState('');
  const [notifications] = useState(3);
  const PARAMETRAGE_LINKS = [
    {
      label: "Utilisateurs",
      href: "/dashboard/parametrage/utilisateurs",
      icon: Users,
    },
    // {
    //   label: "Entreprises",
    //   href: "/dashboard/parametrage/entreprises",
    //   icon: Building2,
    // },
    {
      label: "Secteurs",
      href: "/dashboard/parametrage/secteurs",
      icon: BriefcaseBusiness,
    },
    {
      label: "Système",
      href: "/dashboard/parametrage/systeme",
      icon: Settings2,
    },
  ];

  const initiale = user?.name?.charAt(0).toUpperCase() ?? 'A';

  return (
    <header className="flex h-16 items-center justify-end bg-[#1a7a3c] px-6 shadow-sm">

      <div className="flex items-center gap-4">

        {/* Notification */}
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-full
                 bg-white/15 text-white transition hover:bg-white/25"
        >
          <Bell size={20} />

          {notifications > 0 && (
            <span
              className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center
                     rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white"
            >
              {notifications}
            </span>
          )}
        </button>

        {/* Avatar */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center overflow-hidden
                   rounded-full bg-white/20 font-semibold text-white
                   transition hover:bg-white/30"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              initiale
            )}
          </button>

          {menuOpen && (
            <>
              {/* Overlay invisible */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />

              {/* Dropdown */}
              <div className="absolute right-0 top-14 z-20 w-72 overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-gray-800 text-sm">{user?.name ?? 'Admin'}</p>
                  <p className="text-gray-400 text-xs">{user?.email ?? ''}</p>
                </div>

                <nav className="py-1">

                  {/* Profil */}
                  <Link
                    href="/dashboard/parametrage/profil"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User size={16} className="text-gray-400" />
                    Mon profil
                  </Link>

                  <Link
                    href="/dashboard/parametrage/password"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <KeyRound size={16} className="text-gray-400" />
                    Changer le mot de passe
                  </Link>

                  <div className="border-t border-gray-100 my-1" />

                  {/* Paramétrage */}
                  <p className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700">
                    <Settings size={16} className="text-gray-400" />
                    Paramétrage
                  </p>

                  <div className="pl-8 pb-2">
                    {PARAMETRAGE_LINKS.map((item) => {
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#1a7a3c] transition-colors"
                        >
                          <Icon size={16} />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>

                </nav>
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Déconnexion
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>

    </header>
  );
}