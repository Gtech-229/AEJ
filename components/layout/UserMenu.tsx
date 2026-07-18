'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Settings,
    KeyRound,
    FolderOpen,
    LogOut,
    ChevronDown,
} from 'lucide-react';
import { authHelpers } from '@/lib/auth';

interface UserMenuProps {
    /** Afficher le chevron à côté de l'initiale */
    showChevron?: boolean;
}

export default function UserMenu({ showChevron = false }: UserMenuProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const menuRef = useRef<HTMLDivElement>(null);

    /* Charger les infos utilisateur */
    useEffect(() => {
        const user = authHelpers.getUser();
        if (user) {
            setName(user.name ?? '');
            setEmail(user.email ?? '');
            setRole(user.role ?? '');
        }
    }, []);

    /* Fermer en cliquant en dehors */
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        if (open) document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);

    /* Fermer avec Escape */
    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === 'Escape') setOpen(false);
        }
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, []);

    async function logout() {
        try {
            // Appel API logout si disponible
            const { default: api } = await import('@/lib/api');
            await api.post('/auth/logout').catch(() => { });
        } finally {
            authHelpers.clearSession();
            // Supprimer le cookie middleware
            document.cookie = 'aej_token=; max-age=0; path=/';
            router.push('/auth/login');
        }
    }

    const initiale = name ? name.charAt(0).toUpperCase() : 'A';

    const ROLE_LABELS: Record<string, string> = {
        admin: 'Administrateur',
        gestionnaire: 'Gestionnaire',
        consultant: 'Consultant',
    };

    const NAV_ITEMS = [
        { label: 'Paramètres', icon: Settings, href: '/dashboard/parametrage/profil' },
        { label: 'Changer mot de passe', icon: KeyRound, href: '/dashboard/parametrage/password' },
        { label: 'Mes documents', icon: FolderOpen, href: '/dashboard/documents' },
    ];

    return (
        <div className="relative" ref={menuRef}>
            {/* Bouton avatar */}
            <button
                onClick={() => setOpen(v => !v)}
                className="flex items-center gap-2 transition-colors"
                aria-expanded={open}
                aria-haspopup="true"
            >
                <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm select-none"
                    style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
                >
                    {initiale}
                </div>
                {showChevron && (
                    <ChevronDown
                        size={14}
                        className={`text-white/70 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    />
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    className="absolute right-0 top-12 z-50 bg-white rounded-2xl shadow-xl w-56 overflow-hidden"
                    style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
                >
                    {/* Infos utilisateur */}
                    <div className="px-4 py-3.5 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                                style={{ backgroundColor: '#1a7a3c' }}
                            >
                                {initiale}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-gray-800 truncate">{name || 'Admin'}</p>
                                <p className="text-xs text-gray-400 truncate">{email}</p>
                                {role && (
                                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                                        {ROLE_LABELS[role] ?? role}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Liens */}
                    <nav className="py-1">
                        {NAV_ITEMS.map(item => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <Icon size={15} className="text-gray-400 shrink-0" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Déconnexion */}
                    <div className="border-t border-gray-100 py-1">
                        <button
                            onClick={logout}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full text-left transition-colors"
                        >
                            <LogOut size={15} className="shrink-0" />
                            Déconnexion
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}