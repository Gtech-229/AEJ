'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Briefcase, ChevronDown, Menu, Wallet, X } from 'lucide-react';
import Image from 'next/image';

// ─── Config navigation principale ────────────────────────────────────────────

interface NavItem {
    label: string;
    href: string;
    children?: { label: string; href: string }[];
}

const NAV: NavItem[] = [
    { label: 'Tableau de bord', href: '/dashboard/dashboard' },
    { label: 'Stages', href: '/dashboard/offres/stages' },
    {
        label: 'Offres & Demandes',
        href: '/dashboard/offres',
        children: [
            { label: 'Offres d\'emplois', href: '/dashboard/offres/emplois' },
            { label: 'Matching offres/demandes', href: '/dashboard/offres/matching' },
            { label: 'Offres de stages', href: '/dashboard/offres/stages' },
        ],
    },
    {
        label: 'Evaluations',
        href: '/dashboard/evaluations',
        children: [
            { label: 'Formulaires d\'évaluation', href: '/dashboard/evaluations/formulaires' },
            { label: 'Résultats des évaluations', href: '/dashboard/evaluations/resultats' },
        ],
    },
    { label: 'Stagiaires', href: '/dashboard/stagiaires' },
    { label: 'Entreprises', href: '/dashboard/parametrage/entreprises' },

    {
        label: 'Financements',
        href: '/dashboard/financements',
        children: [
            { label: 'Projets financés', href: '/dashboard/financements/projets' },
            { label: 'Partenaires', href: '/dashboard/financements/partenaires' },
        ],
    },
];

// ─── Composant ────────────────────────────────────────────────────────────────

export function PortailHeader() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdown, setDropdown] = useState<string | null>(null);

    function isActive(href: string) {
        return pathname === href || pathname.startsWith(href + '/');
    }

    function isGroupActive(item: NavItem) {
        if (item.href && isActive(item.href)) return true;
        return item.children?.some((c) => isActive(c.href)) ?? false;
    }

    // Fermer dropdown en cliquant ailleurs
    function handleBlur() {
        setTimeout(() => setDropdown(null), 150);
    }

    return (
        <header className="shrink-0 shadow-md" style={{ backgroundColor: '#1a7a3c' }}>
            <div className="px-4 md:px-6 h-16 flex items-center justify-between gap-4">

                <Link href="/portail/tableau-de-bord" className="flex items-center gap-3 shrink-0">
                    {/* Logo PSG */}
                    <Image
                        src="/logo-psg.jpeg"
                        alt="Agence Emploi Jeunes"
                        width={140}
                        height={50}
                        style={{ width: 'auto', height: '50px' }}
                        priority
                        className="bg-white rounded-xl p-1 object-contain"
                    />

                    {/* Logo AEJ */}
                    <Image
                        src="/logo-aej.jpg"
                        alt="Programme Social du Gouvernement"
                        width={120}
                        height={50}
                        // style={{ width: 'auto', height: '50px' }}
                        priority
                        className="bg-white rounded-xl p-1 object-contain"
                    />
                </Link>

                {/* Navigation principale — desktop */}
                <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
                    {NAV.map(item => {
                        const active = isGroupActive(item);
                        const hasChild = !!item.children?.length;
                        const isOpen = dropdown === item.label;

                        return (
                            <div key={item.label} className="relative" onBlur={handleBlur}>
                                {hasChild ? (
                                    <button
                                        onClick={() => setDropdown(isOpen ? null : item.label)}
                                        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${active ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        {item.label}
                                        <ChevronDown size={13} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                ) : (
                                    <Link

                                        href={item.href}
                                        className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${active ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                )}

                                {/* Sous-menu dropdown */}
                                {hasChild && isOpen && (
                                    <div className="absolute top-full left-0 mt-1 bg-white rounded-2xl shadow-xl w-56 py-2 z-50 overflow-hidden">
                                        {item.children!.map(child => (
                                            <Link
                                                key={child.href}
                                                href={child.href}
                                                onClick={() => setDropdown(null)}
                                                className={`block px-4 py-2.5 text-sm transition-colors ${isActive(child.href)
                                                    ? 'text-green-700 font-semibold bg-green-50'
                                                    : 'text-gray-700 hover:bg-gray-50'
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

                {/* Droite : notif + avatar */}
                <div className="flex items-center gap-3 shrink-0">
                    {/* Cloche notifications */}
                    <button className="relative w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                        style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                        <Bell size={17} className="text-white" />
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-400" />

                    </button>

                    {/* Avatar */}
                    <button className="w-9 h-9 rounded-full bg-white flex items-center justify-center font-bold text-sm"
                        style={{ color: '#1a7a3c' }}>
                        J
                    </button>

                    {/* Burger mobile */}
                    <button
                        className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                        onClick={() => setMobileOpen(v => !v)}
                    >
                        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </div>

            {/* Sous-navigation orange (actif quand une section avec enfants est active) */}
            {NAV.filter(({ children }) => children)
                .filter(isGroupActive)
                .map((activeGroup) => (
                    <div
                        key={activeGroup.label}
                        className="bg-[#f97316]"
                    >
                        <div className="px-4 md:px-6 flex items-center gap-1 overflow-x-auto">
                            {activeGroup.children!.map((child) => (
                                <Link
                                    key={child.href}
                                    href={child.href}
                                    className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors ${isActive(child.href)
                                        ? 'bg-white/20 text-white'
                                        : 'text-white/80 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    {child.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}

            {/* Menu mobile */}
            {mobileOpen && (
                <div className="lg:hidden border-t" style={{ borderColor: 'rgba(255,255,255,0.15)', backgroundColor: '#0f5228' }}>
                    <nav className="px-4 py-3 space-y-1">
                        {NAV.map(item => (
                            <div key={item.label}>
                                <Link
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isGroupActive(item) ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                                {item.children && (
                                    <div className="ml-4 mt-1 space-y-1">
                                        {item.children.map(child => (
                                            <Link
                                                key={child.href}
                                                href={child.href}
                                                onClick={() => setMobileOpen(false)}
                                                className={`block px-3 py-2 rounded-lg text-xs font-medium transition-colors ${isActive(child.href) ? 'text-orange-300' : 'text-white/50 hover:text-white'
                                                    }`}
                                            >
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
