'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Settings,
  Briefcase,
  Wallet,
  ClipboardCheck,
  BarChart2,
  Bot,
  ChevronDown,
  ChevronRight,
  Users,
  Building2,
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ElementType;
  href?: string;
  children?: { label: string; href: string }[];
}

// ── Routes alignées sur app/dashboard/... ────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  {
    label: 'Tableau de bord',
    icon: LayoutDashboard,
    href: '/dashboard/dashboard',
  },
  {
    label: 'Stagiaires',
    icon: Users,
    href: '/dashboard/stagiares',
  },
  {
    label: 'Offres & Matching',
    icon: Briefcase,
    children: [
      { label: 'Offres de stage', href: '/dashboard/offres/stages' },
      { label: "Offres d'emploi", href: '/dashboard/offres/emplois' },
      { label: 'Matching', href: '/dashboard/offres/matching' },
    ],
  },
  {
    label: 'Financements',
    icon: Wallet,
    children: [
      { label: 'Projets financés', href: '/dashboard/financements/projets' },
      { label: 'Partenaires', href: '/dashboard/financements/partenaires' },
    ],
  },
  {
    label: 'Évaluations',
    icon: ClipboardCheck,
    children: [
      { label: 'Formulaires', href: '/dashboard/evaluations/formulaires' },
      { label: 'Résultats', href: '/dashboard/evaluations/resultats' },
    ],
  },
  {
    label: 'Entreprises',
    icon: Building2,
    href: '/dashboard/parametrage/entreprises',
  },
  // {
  //   label: 'Paramétrage',
  //   icon: Settings,
  //   children: [
  //     { label: 'Utilisateurs', href: '/dashboard/parametrage/utilisateurs' },
  //     { label: 'Entreprises', href: '/dashboard/parametrage/entreprises' },
  //     { label: 'Secteurs', href: '/dashboard/parametrage/secteurs' },
  //     { label: 'Système', href: '/dashboard/parametrage/systeme' },
  //     { label: 'Profil', href: '/dashboard/parametrage/profil' },
  //   ],
  // },
  {
    label: 'Assistant IA',
    icon: Bot,
    href: '/dashboard/chatbot',
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  function toggle(label: string) {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  function isActive(href?: string) {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + '/');
  }

  function isGroupActive(children?: { href: string }[]) {
    return children?.some((c) => isActive(c.href)) ?? false;
  }

  return (
    <aside className="w-64 bg-[#1a7a3c] flex flex-col h-full shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1a7a3c] rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">AEJ</span>
          </div>
          <div>
            <p className="text-[#1a7a3c] font-bold text-sm leading-tight">Agence Emploi</p>
            <p className="text-orange-500 font-bold text-sm leading-tight">Jeunes</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const hasChildren = !!item.children?.length;
          const groupActive = isGroupActive(item.children);
          const isOpen = openMenus[item.label] ?? groupActive;

          if (!hasChildren) {
            return (
              <Link
                key={item.label}
                href={item.href!}
                className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          }

          return (
            <div key={item.label}>
              <button
                onClick={() => toggle(item.label)}
                className={`nav-item w-full justify-between ${groupActive ? 'bg-white/10 text-white' : ''}`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={18} />
                  {item.label}
                </span>
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>

              {isOpen && (
                <div className="ml-8 mt-0.5 space-y-0.5">
                  {item.children!.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`block px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150
                        ${isActive(child.href)
                          ? 'bg-white text-[#1a7a3c]'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <p className="text-white/40 text-xs text-center">
          © 2026 AEJ | Version 1.0
        </p>
      </div>
    </aside>
  );
}