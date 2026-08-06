// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { ExternalLink } from 'lucide-react';

// const NAV_MAIN = [
//     { key: 'dashboard', label: 'Dashboard Finance', icon: '📊', href: '/organisme/dashboard' },
//     { key: 'beneficiaires', label: 'Liste des bénéficiaires', icon: '📋', href: '/organisme/beneficiaires' },
//     { key: 'dossier', label: 'Dossier bénéficiaire', icon: '📁', href: '/organisme/beneficiaires/AEJ-2024-0001' },
//     { key: 'workflow', label: 'Suivi du workflow', icon: '🗂️', href: '/organisme/workflow' },
//     { key: 'plan', label: 'Plan de remboursement', icon: '🧾', href: '/organisme/plan-remboursement' },
//     { key: 'exploitation', label: 'Exploitation micro-projet', icon: '🌾', href: '/organisme/exploitation' },
//     { key: 'indicateurs', label: "Indicateurs d'impact", icon: '📈', href: '/organisme/indicateurs' },
//     { key: 'rapports', label: 'Génération des rapports', icon: '📄', href: '/organisme/rapports' },
// ];


// const NAV_PARAM = [
//     { key: 'utilisateurs', label: 'Utilisateurs & rôles', icon: '👥', href: '/organisme/parametrage/utilisateurs' },
//     { key: 'agences', label: 'Agences', icon: '🏦', href: '/organisme/parametrage/agences' },
//     { key: 'systeme', label: 'Paramètres système', icon: '⚙️', href: '/organisme/parametrage/systeme' },
//     { key: 'historique', label: 'Historique des actions', icon: '🕘', href: '/organisme/parametrage/historique' },
// ];

// const GREEN = '#1a7a3c';

// export default function OrganismeSidebar() {
//     const pathname = usePathname();

//     function isActive(href: string) {
//         return pathname === href || pathname.startsWith(href + '/');
//     }

//     return (
//         <aside className="w-52 shrink-0 flex flex-col h-full bg-white border-r border-gray-200">

//             {/* Logo */}
//             <div className="px-4 py-4 border-b border-gray-100">
//                 <div className="flex items-center gap-2">
//                     <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-xs"
//                         style={{ backgroundColor: GREEN }}>AEJ</div>
//                     <div>
//                         <p className="text-xs font-black leading-none" style={{ color: ORANGE }}>ESPACE</p>
//                         <p className="text-xs font-black leading-none" style={{ color: GREEN }}>ORGANISME</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Nav principale */}
//             <nav className="flex-1 py-3 overflow-y-auto">
//                 <ul className="space-y-0.5 px-2">
//                     {NAV_MAIN.map(item => {
//                         const active = isActive(item.href);
//                         return (
//                             <li key={item.key}>
//                                 <Link href={item.href}
//                                     className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${active ? 'text-white' : 'text-gray-600 hover:bg-gray-50'
//                                         }`}
//                                     style={active ? { backgroundColor: GREEN } : undefined}>
//                                     <span>{item.icon}</span>
//                                     {item.label}
//                                 </Link>
//                             </li>
//                         );
//                     })}
//                 </ul>

//                 {/* Paramètres */}
//                 <div className="mt-3 px-2">
//                     <p className="text-xs text-gray-400 font-semibold px-3 mb-1 uppercase tracking-wide">Paramètres</p>
//                     <ul className="space-y-0.5">
//                         {NAV_PARAM.map(item => {
//                             const active = isActive(item.href);
//                             return (
//                                 <li key={item.key}>
//                                     <Link href={item.href}
//                                         className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${active ? 'text-white' : 'text-gray-500 hover:bg-gray-50'
//                                             }`}
//                                         style={active ? { backgroundColor: GREEN } : undefined}>
//                                         <span>{item.icon}</span>
//                                         {item.label}
//                                     </Link>
//                                 </li>
//                             );
//                         })}
//                     </ul>
//                 </div>
//             </nav>

//             {/* Aide */}
//             <div className="m-3 p-3 rounded-xl border" style={{ backgroundColor: '#e8f5ee', borderColor: '#bbf7d0' }}>
//                 <p className="text-xs font-bold text-gray-800 mb-0.5">Besoin d'aide ?</p>
//                 <p className="text-xs text-gray-500 mb-2">Consultez notre guide</p>
//                 <Link href="/organisme/aide"
//                     className="inline-flex items-center gap-1 text-xs font-semibold text-white px-3 py-1.5 rounded-lg"
//                     style={{ backgroundColor: GREEN }}>
//                     Guide d'utilisation <ExternalLink size={10} />
//                 </Link>
//             </div>
//         </aside>
//     );
// }


// const ORANGE = '#f97316';


import AppHeader from '@/components/shared/AppHeader';

export default function OrganismesHeader() {
    return (
        <AppHeader
            logoBadge="AEJ"
            title="AGENCE EMPLOI JEUNES"
            subtitle="Espace Organismes financiers"
            badgeLabel="PSGouv 2022–2024"
            ribbonText="Programme Social du Gouvernement 2022–2024 — traçabilité en temps réel des financements destinés aux jeunes entrepreneurs"
            fallbackRoleLabel="Organisme partenaire"
        />
    );
}
