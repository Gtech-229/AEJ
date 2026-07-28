'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderKanban, GraduationCap, BriefcaseBusiness, Settings } from 'lucide-react';

const NAV_ITEMS = [
    { label: 'Tableau de bord', icon: LayoutDashboard, href: '/entreprise/dashboard' },
    { label: 'Projets', icon: FolderKanban, href: '/entreprise/projets' },
    { label: 'Stages', icon: GraduationCap, href: '/entreprise/stages' },
    { label: 'Emplois', icon: BriefcaseBusiness, href: '/entreprise/emplois' },
    { label: 'Paramètres', icon: Settings, href: '/entreprise/parametrage' },
];

export default function EntrepriseSidebar() {
    const pathname = usePathname();
    const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

    return (
        <aside className="w-64 bg-[#1a7a3c] flex flex-col h-full shrink-0">
            <div className="px-5 py-5 border-b border-white/10">
                <p className="text-white font-bold text-sm">Espace Entreprise</p>
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