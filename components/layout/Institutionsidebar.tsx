'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CreditCard, Users, Building2, Settings } from 'lucide-react';

const NAV_ITEMS = [
    { label: 'Tableau de bord', icon: LayoutDashboard, href: '/institution/dashboard' },
    { label: 'Crédits', icon: CreditCard, href: '/institution/credits' },
    { label: 'Bénéficiaires', icon: Users, href: '/institution/beneficiaires' },
    { label: 'Agences', icon: Building2, href: '/institution/agences' },
    { label: 'Paramètres', icon: Settings, href: '/institution/parametrage' },
];

export default function InstitutionSidebar() {
    const pathname = usePathname();
    const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

    return (
        <aside className="w-64 bg-[#1a7a3c] flex flex-col h-full shrink-0">
            <div className="px-5 py-5 border-b border-white/10">
                <p className="text-white font-bold text-sm">Espace Institution financière</p>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-0.5">
                {NAV_ITEMS.map(({ label, icon: Icon, href }) => (
                    <Link key={href} href={href} className={`nav-item ${isActive(href) ? 'active' : ''}`}>
                        <Icon size={18} />
                        {label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}