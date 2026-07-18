'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Shield, Bell, LogOut, Trash2, Settings2, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = 'profil' | 'securite' | 'systeme' | 'secteurs' | 'utilisateurs' | 'notifications';

// ─── Nav latérale ─────────────────────────────────────────────────────────────
const TABS: { key: Tab; label: string; icon: any; href: string }[] = [
    { key: 'profil', label: 'Mon Profil', icon: User, href: '/dashboard/parametrage/profil' },
    { key: 'securite', label: 'Mot de passe', icon: Shield, href: '/dashboard/parametrage/password' },
    { key: 'systeme', label: 'Système', icon: Settings2, href: '/dashboard/parametrage/systeme' },
    { key: 'secteurs', label: "Secteurs d'activité", icon: Settings2, href: '/dashboard/parametrage/secteurs' },
    { key: 'utilisateurs', label: 'Utilisateurs', icon: Users, href: '/dashboard/parametrage/utilisateurs' },
    { key: 'notifications', label: 'Notifications', icon: Bell, href: '/dashboard/notifications' },
];

// ─── Layout partagé ────────────────────────────────────────────────────────────
export default function ParametrageLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const initiale = user?.name?.charAt(0).toUpperCase() ?? 'A';

    return (
        <div className="space-y-6 px-6 py-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900">Paramètres du compte</h1>

            <div className="flex gap-6 items-start">

                {/* ── Sidebar ── */}
                <aside className="w-56 shrink-0 bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <nav className="py-2">
                        {TABS.map(t => {
                            const Icon = t.icon;
                            const active = pathname === t.href || pathname?.startsWith(`${t.href}/`);
                            return (
                                <Link
                                    key={t.key}
                                    href={t.href}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-left transition-all ${active
                                        ? "text-white"
                                        : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                    style={active ? { backgroundColor: "#1a7a3c" } : undefined}
                                >
                                    <Icon
                                        size={16}
                                        className={active ? "text-white" : "text-gray-400"}
                                    />
                                    {t.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Séparateur */}
                    <div className="border-t border-gray-100 py-2">
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors text-left"
                        >
                            <LogOut size={16} />
                            Déconnexion
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors text-left">
                            <Trash2 size={16} />
                            Supprimer le compte
                        </button>
                    </div>

                    {/* Profil mini en bas */}
                    <div className="border-t border-gray-100 px-4 py-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                            style={{ backgroundColor: '#1a7a3c' }}>
                            {initiale}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-800 truncate">{user?.name ?? 'Admin'}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.email ?? ''}</p>
                        </div>
                    </div>
                </aside>

                {/* ── Contenu de la sous-page active ── */}
                <div className="flex-1 min-w-0">
                    {children}
                </div>
            </div>
        </div>
    );
}