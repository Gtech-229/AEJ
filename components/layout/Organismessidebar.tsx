'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    CreditCard,
    FolderOpen,
    Wallet,
    TrendingUp,
    Workflow,
    Sprout,
    FileBarChart,
    Settings,
    ExternalLink,
} from 'lucide-react';

const NAV_ITEMS = [
    { label: 'Dashboard Finance', icon: LayoutDashboard, href: '/organismes/dashboard' },
    { label: 'Agence', icon: LayoutDashboard, href: '/organismes/agences' },
    { label: 'Bénéficiaires', icon: Users, href: '/organismes/beneficiaires' },
    { label: 'Crédits', icon: CreditCard, href: '/organismes/credits' },
    { label: 'Dossier bénéficiaire', icon: FolderOpen, href: '/organismes/beneficiaires/[id]' },
    { label: 'Remboursement', icon: Wallet, href: '/organismes/credits/[id]/remboursement' },
    { label: "Indicateurs d'impact", icon: TrendingUp, href: '/organismes/credits/[id]/impact' },
    { label: 'Suivi du workflow', icon: Workflow, href: '/organismes/workflow' },
    { label: 'Exploitation micro-projet', icon: Sprout, href: '/organismes/exploitation' },
    { label: 'Génération des rapports', icon: FileBarChart, href: '/organismes/rapport' },
    { label: 'Paramètres', icon: Settings, href: '/organismes/parametrage' },
];

export default function OrganismesSidebar() {
    const pathname = usePathname();
    const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

    return (
        <aside className="w-64 bg-[#1a7a3c] flex flex-col h-full shrink-0">
            <nav className="flex-1 px-3 pt-4 pb-4 space-y-0.5 overflow-y-auto">
                {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
                    const active = isActive(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active ? 'bg-white/15 text-white font-semibold' : 'text-white/80 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <Icon size={17} className="shrink-0" />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* Besoin d'aide */}
            <div className="mx-3 mb-4 p-3 rounded-xl bg-white/10">
                <p className="text-xs font-semibold text-white mb-0.5">Besoin d'aide ?</p>
                <p className="text-[11px] text-white/60 mb-2">Consultez notre guide</p>
                <Link
                    href="/organismes/aide"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#1a7a3c] bg-white px-3 py-1.5 rounded-lg hover:bg-white/90 transition-colors"
                >
                    Guide d'utilisation
                    <ExternalLink size={11} />
                </Link>
            </div>
        </aside>
    );
}
