'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Menu,
    X,
    ArrowRight,
    Building2,
    Landmark,
    Briefcase,
    ShieldCheck,
    LineChart,
    Users,
    FileCheck2,
} from 'lucide-react';
import { COLORS } from '@/lib/design/tokens';

const NAV_LINKS = [
    { label: 'La plateforme', href: '#plateforme' },
    { label: 'Espaces', href: '#espaces' },
    { label: 'Partenaires', href: '#partenaires' },
];

const PARTNER_LOGOS = [
    { name: 'PSGouv', src: '/logo-aej.jpeg' },
    { name: 'BAD', src: '/partenaire/logo-BAD.jpg' },
    { name: 'NSIA', src: '/partenaire/nsia_banque.png' },
    { name: 'Ecobank', src: '/partenaire/ecobank_ci_0.jpg' },
];

const STATS = [
    { value: '12 723', label: 'Jeunes accompagnés' },
    { value: '5 933', label: 'Emplois obtenus' },
    { value: '84%', label: "Taux d'insertion" },
    { value: '4,15 Mrd', label: 'FCFA décaissés' },
];

const ESPACES = [
    {
        icon: Building2,
        title: 'Agence',
        description:
            "Vue nationale consolidée : stagiaires, offres, financements et performance de l'ensemble du programme.",
        accent: COLORS.green,
    },
    {
        icon: Landmark,
        title: 'Organismes financiers',
        description:
            'Banques et SFD partenaires : portefeuille de crédits, remboursements, agences et bénéficiaires financés.',
        accent: COLORS.blue,
    },
    {
        icon: Briefcase,
        title: 'Entreprises',
        description:
            'Publication des offres de stage et d\'emploi, suivi des recrutements et des projets financés.',
        accent: COLORS.orange,
    },
];

const FEATURES = [
    {
        icon: LineChart,
        title: 'Tableaux de bord par profil',
        description: "Chaque acteur voit uniquement les indicateurs pertinents pour son rôle.",
    },
    {
        icon: ShieldCheck,
        title: 'Sécurité et traçabilité',
        description: 'Authentification à deux facteurs, journal d\'activité et rôles/permissions granulaires.',
    },
    {
        icon: FileCheck2,
        title: 'Rapports en un clic',
        description: 'Exports PDF, Excel et CSV filtrés par région, secteur ou période.',
    },
    {
        icon: Users,
        title: 'Suivi centralisé des bénéficiaires',
        description: 'Dossier complet, plan de remboursement et indicateurs d\'impact au même endroit.',
    },
];

export default function LandingPage() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white">
            {/* ── Navigation ── */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
                <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/logo-aej-color.png" alt="Agence Emploi Jeunes" width={140} height={36} className="h-8 w-auto" />
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        {NAV_LINKS.map((link) => (
                            <a key={link.href} href={link.href} className="text-sm font-medium text-gray-600 hover:text-gray-900">
                                {link.label}
                            </a>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href="/auth/login"
                            className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90"
                            style={{ backgroundColor: COLORS.green }}
                        >
                            Se connecter
                        </Link>
                    </div>

                    <button
                        className="md:hidden text-gray-700"
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                    >
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </nav>

                {menuOpen && (
                    <div className="md:hidden border-t border-gray-100 px-4 py-4 space-y-3 bg-white">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className="block text-sm font-medium text-gray-600"
                            >
                                {link.label}
                            </a>
                        ))}
                        <Link
                            href="/auth/login"
                            className="block text-center text-sm font-semibold px-4 py-2.5 rounded-lg text-white"
                            style={{ backgroundColor: COLORS.green }}
                        >
                            Se connecter
                        </Link>
                    </div>
                )}
            </header>

            {/* ── Hero ── */}
            <section id="plateforme" className="relative overflow-hidden">
                <div
                    className="absolute inset-0 -z-10"
                    style={{ background: 'linear-gradient(180deg, #F0F9F3 0%, #FFFFFF 60%)' }}
                />
                <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-14 sm:pb-20 text-center">
                    <div
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
                        style={{ backgroundColor: '#E7F5EC', color: COLORS.green }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.green }} />
                        Programme Social du Gouvernement 2022–2024
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
                        Le guichet unique du suivi de l'emploi des jeunes en Côte d'Ivoire
                    </h1>
                    <p className="mt-5 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                        Traçabilité en temps réel des financements, des stages et des emplois destinés aux jeunes
                        entrepreneurs — pour l'agence, les organismes financiers partenaires et les entreprises.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            href="/auth/login"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-lg transition-opacity hover:opacity-90"
                            style={{ backgroundColor: COLORS.green }}
                        >
                            Accéder à mon espace
                            <ArrowRight size={16} />
                        </Link>
                        <a
                            href="#espaces"
                            className="w-full sm:w-auto inline-flex items-center justify-center text-sm font-semibold text-gray-700 px-6 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            Découvrir la plateforme
                        </a>
                    </div>

                    <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto">
                        {STATS.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <p className="text-2xl sm:text-3xl font-bold" style={{ color: COLORS.text }}>
                                    {stat.value}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Espaces ── */}
            <section id="espaces" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
                <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Trois espaces, un seul système</h2>
                    <p className="mt-3 text-gray-600">
                        Chaque acteur du programme dispose de son propre tableau de bord, adapté à son rôle.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                    {ESPACES.map((espace) => (
                        <div key={espace.title} className="rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div
                                className="w-11 h-11 rounded-full flex items-center justify-center mb-4"
                                style={{ backgroundColor: `${espace.accent}1A` }}
                            >
                                <espace.icon size={20} style={{ color: espace.accent }} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">{espace.title}</h3>
                            <p className="mt-2 text-sm text-gray-600 leading-relaxed">{espace.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Fonctionnalités ── */}
            <section className="bg-gray-50 py-16 sm:py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Conçu pour la transparence</h2>
                        <p className="mt-3 text-gray-600">
                            Un système unique pour piloter, financer et suivre l'insertion professionnelle des jeunes.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                        {FEATURES.map((feature) => (
                            <div key={feature.title} className="bg-white rounded-2xl p-5 shadow-sm">
                                <feature.icon size={20} style={{ color: COLORS.green }} />
                                <h3 className="mt-3 text-sm font-semibold text-gray-900">{feature.title}</h3>
                                <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Partenaires ── */}
            <section id="partenaires" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-6">
                    Partenaires du programme
                </p>
                <div className="flex items-center justify-center gap-8 sm:gap-12 flex-wrap">
                    {PARTNER_LOGOS.map((partner) => (
                        <Image
                            key={partner.name}
                            src={partner.src}
                            alt={partner.name}
                            width={100}
                            height={32}
                            className="h-7 sm:h-8 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                        />
                    ))}
                </div>
            </section>

            {/* ── CTA final ── */}
            <section className="px-4 sm:px-6 pb-16 sm:pb-20">
                <div
                    className="max-w-5xl mx-auto rounded-3xl px-6 sm:px-12 py-10 sm:py-14 text-center"
                    style={{ background: 'linear-gradient(135deg, #1a7a3c 0%, #0f5228 100%)' }}
                >
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">Prêt à accéder à votre espace ?</h2>
                    <p className="mt-3 text-white/70 max-w-xl mx-auto">
                        Connectez-vous avec les identifiants fournis par votre structure — agence, organisme financier
                        ou entreprise partenaire.
                    </p>
                    <Link
                        href="/auth/login"
                        className="mt-7 inline-flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3 rounded-lg bg-white transition-opacity hover:opacity-90"
                        style={{ color: COLORS.green }}
                    >
                        Se connecter
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="border-t border-gray-100 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-gray-400">© 2026 Agence Emploi Jeunes | Financement BAD</p>
                    <div className="flex items-center gap-5">
                        <Link href="/auth/login" className="text-xs text-gray-500 hover:text-gray-700">
                            Se connecter
                        </Link>
                        <a href="#plateforme" className="text-xs text-gray-500 hover:text-gray-700">
                            La plateforme
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}