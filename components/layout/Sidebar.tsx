// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useState } from 'react';
// import { ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';

// interface NavItem {
//   label: string;
//   href?: string;
//   children?: { label: string; href: string }[];
// }

// const NAV: NavItem[] = [
//   { label: 'Tableau de bord', href: '/dashboard' },
//   { label: 'Personnel', href: '/dashboard/parametrage/personnels' },
//   { label: 'Jeunes', href: '/dashboard/jeunes' },
//   { label: 'Entreprises', href: '/dashboard/parametrage/entreprises' },
//   { label: 'Organismes', href: '/dashboard/parametrage/organismes' },
//   { label: 'Financements', href: '/dashboard/financements/projets' },
//   { label: 'Indicateurs', href: '/dashboard/indicateurs' },
//   { label: 'Rapports & Statistiques', href: '/dashboard/rapports' },
//   {
//     label: 'Paramétrage',
//     children: [
//       { label: 'Rôles & permissions', href: '/dashboard/parametrage/roles' },
//       { label: 'Secteurs', href: '/dashboard/parametrage/secteurs' },
//       { label: 'Système', href: '/dashboard/parametrage/systeme' },
//       { label: 'Profil', href: '/dashboard/parametrage/profil' },
//     ],
//   },
//   { label: 'Notifications', href: '/dashboard/notifications' },
// ];

// export default function Sidebar() {
//   const pathname = usePathname();
//   const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

//   function toggle(label: string) {
//     setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
//   }

//   function isActive(href?: string) {
//     if (!href) return false;
//     if (href === '/dashboard') return pathname === '/dashboard';
//     return pathname.startsWith(href);
//   }

//   function isGroupActive(children?: { href: string }[]) {
//     return children?.some((c) => isActive(c.href)) ?? false;
//   }

//   return (
//     <aside className="w-44 shrink-0 flex flex-col h-full bg-white border-r border-gray-200">

//       {/* Navigation */}
//       <nav className="flex-1 py-4 overflow-y-auto">
//         <ul className="space-y-0.5 px-3">
//           {NAV.map((item) => {
//             const hasChildren = !!item.children?.length;
//             const groupActive = isGroupActive(item.children);
//             const active = hasChildren ? groupActive : isActive(item.href);
//             const isOpen = openMenus[item.label] ?? groupActive;

//             if (!hasChildren) {
//               return (
//                 <li key={item.label}>
//                   <Link
//                     href={item.href!}
//                     className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${active
//                         ? 'font-semibold text-green-700 bg-green-50'
//                         : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                       }`}
//                   >
//                     <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${active ? 'bg-green-600' : 'bg-gray-300'}`} />
//                     {item.label}
//                   </Link>
//                 </li>
//               );
//             }

//             return (
//               <li key={item.label}>
//                 <button
//                   onClick={() => toggle(item.label)}
//                   className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${active
//                       ? 'font-semibold text-green-700 bg-green-50'
//                       : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                     }`}
//                 >
//                   <span className="flex items-center gap-2.5">
//                     <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${active ? 'bg-green-600' : 'bg-gray-300'}`} />
//                     {item.label}
//                   </span>
//                   {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
//                 </button>

//                 {isOpen && (
//                   <ul className="ml-5 mt-0.5 space-y-0.5 border-l border-gray-100 pl-3">
//                     {item.children!.map((child) => {
//                       const childActive = isActive(child.href);
//                       return (
//                         <li key={child.href}>
//                           <Link
//                             href={child.href}
//                             className={`block px-3 py-1.5 rounded-lg text-xs transition-all ${childActive
//                                 ? 'font-semibold text-green-700 bg-green-50'
//                                 : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
//                               }`}
//                           >
//                             {child.label}
//                           </Link>
//                         </li>
//                       );
//                     })}
//                   </ul>
//                 )}
//               </li>
//             );
//           })}
//         </ul>
//       </nav>

//       {/* Besoin d'aide */}
//       <div className="m-3 p-3 rounded-xl bg-green-50 border border-green-100">
//         <p className="text-xs font-bold text-gray-800 mb-0.5">Besoin d'aide ?</p>
//         <p className="text-xs text-gray-500 mb-2">Consultez notre guide</p>
//         <Link
//           href="/dashboard/aide"
//           className="inline-flex items-center gap-1 text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-colors"
//           style={{ backgroundColor: '#1a7a3c' }}
//         >
//           Voir le guide
//           <ExternalLink size={11} />
//         </Link>
//       </div>
//     </aside>
//   );
// }


'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  IdCard,
  Users,
  Building2,
  Landmark,
  Wallet,
  BarChart3,
  FileBarChart,
  Settings,
  Bell,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ElementType;
  href?: string;
  children?: { label: string; href: string }[];
}

const NAV: NavItem[] = [
  { label: 'Tableau de bord', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Personnel', icon: IdCard, href: '/dashboard/parametrage/personnels' },
  { label: 'Jeunes', icon: Users, href: '/dashboard/jeunes' },
  { label: 'Entreprises', icon: Building2, href: '/dashboard/parametrage/entreprises' },
  { label: 'Organismes', icon: Landmark, href: '/dashboard/parametrage/organismes' },
  { label: 'Financements', icon: Wallet, href: '/dashboard/financements/projets' },
  { label: 'Indicateurs', icon: BarChart3, href: '/dashboard/indicateurs' },
  { label: 'Rapports & Statistiques', icon: FileBarChart, href: '/dashboard/rapports' },
  {
    label: 'Paramétrage',
    icon: Settings,
    children: [
      { label: 'Rôles & permissions', href: '/dashboard/parametrage/roles' },
      { label: 'Secteurs', href: '/dashboard/parametrage/secteurs' },
      { label: 'Système', href: '/dashboard/parametrage/systeme' },
      { label: 'Profil', href: '/dashboard/parametrage/profil' },
    ],
  },
  { label: 'Notifications', icon: Bell, href: '/dashboard/notifications' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  function toggle(label: string) {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  function isActive(href?: string) {
    if (!href) return false;
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  }

  function isGroupActive(children?: { href: string }[]) {
    return children?.some((c) => isActive(c.href)) ?? false;
  }

  return (
    <aside className="w-64 bg-[#1a7a3c] flex flex-col h-full shrink-0">
      <nav className="flex-1 px-3 pt-4 pb-4 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const hasChildren = !!item.children?.length;
          const groupActive = isGroupActive(item.children);
          const active = hasChildren ? groupActive : isActive(item.href);
          const isOpen = openMenus[item.label] ?? groupActive;
          const Icon = item.icon;

          if (!hasChildren) {
            return (
              <Link
                key={item.label}
                href={item.href!}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active ? 'bg-white/15 text-white font-semibold' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <Icon size={17} className="shrink-0" />
                {item.label}
              </Link>
            );
          }

          return (
            <div key={item.label}>
              <button
                onClick={() => toggle(item.label)}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active ? 'bg-white/15 text-white font-semibold' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={17} className="shrink-0" />
                  {item.label}
                </span>
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>

              {isOpen && (
                <div className="ml-8 mt-0.5 space-y-0.5 border-l border-white/15 pl-3">
                  {item.children!.map((child) => {
                    const childActive = isActive(child.href);
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block px-3 py-1.5 rounded-lg text-xs transition-colors ${childActive
                            ? 'bg-white/15 text-white font-semibold'
                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                          }`}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Besoin d'aide */}
      <div className="mx-3 mb-4 p-3 rounded-xl bg-white/10">
        <p className="text-xs font-semibold text-white mb-0.5">Besoin d'aide ?</p>
        <p className="text-[11px] text-white/60 mb-2">Consultez notre guide</p>
        <Link
          href="/dashboard/aide"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#1a7a3c] bg-white px-3 py-1.5 rounded-lg hover:bg-white/90 transition-colors"
        >
          Guide d'utilisation
          <ExternalLink size={11} />
        </Link>
      </div>
    </aside>
  );
}
