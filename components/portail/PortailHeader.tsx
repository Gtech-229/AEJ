'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Boxes,
  Briefcase,
  Building2,
  ChevronDown,
  ClipboardList,
  FolderKanban,
  Gauge,
  Handshake,
  Landmark,
  Layers,
  LayoutDashboard,
  Menu,           // ← nouveau (icône hamburger)
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  Wallet,
  Workflow,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/features/auth/auth.context';
import { useConfigurations } from '@/features/configurations/configurations.hooks';
import { ThemeSwitch } from '@/components/theme/theme-switch';
import { AccentSwitch } from '@/components/theme/accent-switch';
import { UserDropdown } from './user-dropdown';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

// The header bar follows the themeable --primary token (so the accent switcher
// recolors it). The lower strip keeps a fixed orange as a two-tone brand detail.
const BRAND_ORANGE = '#f97316';

type IconType = React.ComponentType<{ className?: string }>;

interface NavChild {
  label: string;
  href: string;
  icon: IconType;
}

interface NavItem {
  label: string;
  icon: IconType;
  href?: string;
  children?: NavChild[];
}

// ─── Navigation config ────────────────────────────────────────────────────────
const NAV: NavItem[] = [
  { label: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Promoteurs', href: '/dashboard/promoteurs', icon: Users },
  { label: 'Micro-projets', href: '/dashboard/projets', icon: FolderKanban },
  { label: 'Exécutions', href: '/dashboard/executions', icon: Activity },
  { label: 'Entreprises', href: '/dashboard/parametrage/entreprises', icon: Building2 },
  { label: 'Organismes', href: '/dashboard/parametrage/organismes', icon: Handshake },
  { label: 'Financements', href: '/dashboard/financements', icon: Wallet },
  { label: 'Emplois', href: '/dashboard/emplois', icon: Briefcase },
  { label: 'Indicateurs', href: '/dashboard/indicateurs', icon: Gauge },
  {
    label: 'Paramétrage',
    icon: Settings,
    children: [
      { label: 'Personnel', href: '/dashboard/parametrage/personnels', icon: Users },
      { label: 'Rôles & permissions', href: '/dashboard/parametrage/roles', icon: ShieldCheck },
      { label: 'Projets & dispositifs', href: '/dashboard/parametrage/projets', icon: Boxes },
      { label: 'Workflows', href: '/dashboard/parametrage/workflows', icon: Workflow },
      {
        label: "Formulaires d'évaluation",
        href: '/dashboard/parametrage/formulaires-evaluation',
        icon: ClipboardList,
      },
      { label: 'Système', href: '/dashboard/configurations', icon: SlidersHorizontal },
      { label: 'Autres paramètres', href: '/dashboard/parametrage/autres', icon: Layers },
    ],
  },
];

export function PortailHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { data: config } = useConfigurations();
  const structureName = config?.intitule_structure || 'Agence Emploi Jeunes';
  const structureSigle = config?.sigle_structure ?? '';
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');
  const isSectionActive = (item: NavItem) =>
    (item.children?.some((c) => isActive(c.href)) ?? false);

  // The section whose sub-nav (third row) is shown, driven by the current route.
  const activeSection = NAV.find((item) => item.children && isSectionActive(item));

  return (
    <header className="shrink-0">
      {/* ── Row 1 — fixed brand bar ── */}
      <div className="flex h-16 items-center justify-between gap-4 bg-primary px-4 text-white md:px-6">
        {/* Hamburger — only < lg, opens the drawer nav */}
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetTrigger asChild>
            <button
              aria-label="Ouvrir le menu"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25 lg:hidden"
            >
              <Menu size={19} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="border-b border-border px-4 py-3 text-left">
              <SheetTitle className="text-sm">{structureName}</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-0.5 overflow-y-auto p-2">
              {NAV.map((item) => {
                const Icon = item.icon;
                const section = !!item.children?.length;
                const active = section ? isSectionActive(item) : isActive(item.href!);

                if (!section) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href!}
                      onClick={() => setMobileNavOpen(false)}
                      className={cn(
                        'flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                        active
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground/70 hover:bg-muted hover:text-foreground',
                      )}
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </Link>
                  );
                }

                // Section with children — always expanded in the drawer (no accordion,
                // keeps the interaction simple and avoids adding new architecture).
                return (
                  <div key={item.label} className="mt-1 first:mt-0">
                    <div
                      className={cn(
                        'flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-semibold tracking-wide uppercase',
                        active ? 'text-primary' : 'text-foreground/50',
                      )}
                    >
                      <Icon className="size-3.5" />
                      {item.label}
                    </div>
                    <div className="ml-4 flex flex-col gap-0.5 border-l border-border pl-3">
                      {item.children!.map((child) => {
                        const ChildIcon = child.icon;
                        const childActive = isActive(child.href);
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileNavOpen(false)}
                            className={cn(
                              'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                              childActive
                                ? 'bg-primary/10 text-primary'
                                : 'text-foreground/70 hover:bg-muted hover:text-foreground',
                            )}
                          >
                            <ChildIcon className="size-3.5" />
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logos + title */}
        <Link href="/dashboard" className="flex min-w-0 shrink items-center gap-3">
          <Image
            src="/logo-psg.jpeg"
            alt="Agence Emploi Jeunes"
            width={120}
            height={44}
            style={{ width: 'auto', height: '44px' }}
            priority
            className="shrink-0 rounded-lg bg-white p-1 object-contain"
          />
          <Image
            src="/logo-aej.jpg"
            alt="Programme Social du Gouvernement"
            width={100}
            height={44}
            priority
            className="hidden shrink-0 rounded-lg bg-white p-1 object-contain sm:block"
          />
          <div className="hidden leading-tight lg:block">
            <p className="text-sm font-bold">{structureName}</p>
            {structureSigle && <p className="text-xs text-white/70">{structureSigle}</p>}
          </div>
        </Link>

        {/* Right controls */}
        <div className="flex shrink-0 items-center gap-2">
          <ContextSelector />

          <AccentSwitch className="hidden md:flex" />

          <ThemeSwitch className="border-white/20 bg-white/15 text-white hover:bg-white/25 hover:text-white" />

          <UserDropdown user={user} onLogout={logout} />
        </div>
      </div>

      {/* ── Row 2 — main nav (>= lg only; < lg uses the hamburger drawer above) ── */}
      <div className="hidden bg-card lg:block">
        <nav className="flex items-center gap-1 overflow-x-auto px-6 py-1.5">
          {NAV.map((item) => {
            const Icon = item.icon;
            const section = !!item.children?.length;
            const active = section ? isSectionActive(item) : isActive(item.href!);
            // Section headers navigate to their first child; leaves to their href.
            const href = section ? item.children![0].href : item.href!;
            const base =
              'relative flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors';
            // active adds a brand-colored underline accent (tab-style indicator)
            const stateClass = active
              ? 'bg-primary/10 text-primary after:absolute after:inset-x-2.5 after:bottom-1 after:h-0.5 after:rounded-full after:bg-primary'
              : 'text-foreground/70 hover:bg-muted hover:text-foreground';

            return (
              <Link key={item.label} href={href} className={cn(base, stateClass)}>
                <Icon className="size-4" />
                {item.label}
                {section && (
                  <ChevronDown
                    className={cn('size-3.5 transition-transform', active && 'rotate-180')}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Two-tone brand strip: primary (accent-aware) + fixed orange */}
        <div className="h-0.5 w-full bg-primary" />
        <div className="h-0.5 w-full" style={{ backgroundColor: BRAND_ORANGE }} />

        {/* ── Row 3 — sub-nav of the active section ── */}
        {activeSection && (
          <div className="border-b border-border bg-card">
            <nav className="flex items-center gap-1 overflow-x-auto px-6 py-1.5">
              {activeSection.children!.map((child) => {
                const ChildIcon = child.icon;
                const childActive = isActive(child.href);
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={cn(
                      'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
                      childActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground/60 hover:bg-muted hover:text-foreground',
                    )}
                  >
                    <ChildIcon className="size-3.5" />
                    {child.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* ── Row 2 (mobile/tablette, < lg) — indique la section active,
           le bouton hamburger de la Row 1 reste le point d'entrée du menu complet ── */}
      {activeSection && (
        <div className="border-b border-border bg-card lg:hidden">
          <div className="flex items-center gap-1.5 overflow-x-auto px-4 py-1.5 text-sm font-medium text-primary">
            <activeSection.icon className="size-4" />
            {activeSection.label}
          </div>
        </div>
      )}
    </header>
  );
}

/**
 * Context/period selector (the "SIMANDOU 2040" analog). Static placeholder for
 * now. TODO: wire to a real context feature/endpoint when defined.
 */
function ContextSelector() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="hidden items-center gap-2 rounded-lg bg-white/15 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-white/25 sm:flex">
          <Landmark size={15} />
          <span className="hidden md:inline">PSGouv 2022-2024</span>
          <ChevronDown size={14} className="opacity-80" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Contexte</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="font-medium text-primary">
          PSGouv 2022-2024
        </DropdownMenuItem>
        <DropdownMenuItem disabled>Autres périodes (à venir)</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}