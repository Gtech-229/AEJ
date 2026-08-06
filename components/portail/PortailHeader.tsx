'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Building2,
  ChevronDown,
  Gauge,
  Handshake,
  KeyRound,
  Landmark,
  Layers,
  LayoutDashboard,
  LogOut,
  MapPin,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  User,
  Users,
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/features/auth/auth.context';
import { getUserDisplayName } from '@/features/auth/auth.dto';
import { useConfigurations } from '@/features/configurations/configurations.hooks';
import { ThemeSwitch } from '@/components/theme/theme-switch';
import { AccentSwitch } from '@/components/theme/accent-switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  { label: 'Entreprises', href: '/dashboard/parametrage/entreprises', icon: Building2 },
  { label: 'Organismes', href: '/dashboard/parametrage/organismes', icon: Handshake },
  { label: 'Financements', href: '/dashboard/financements/projets', icon: Wallet },
  { label: 'Indicateurs', href: '/dashboard/indicateurs', icon: Gauge },
  {
    label: 'Paramétrage',
    icon: Settings,
    children: [
      { label: 'Personnel', href: '/dashboard/parametrage/personnels', icon: Users },
      { label: 'Rôles & permissions', href: '/dashboard/parametrage/roles', icon: ShieldCheck },
      { label: 'Localités', href: '/dashboard/parametrage/localites', icon: MapPin },
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

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');
  const isSectionActive = (item: NavItem) =>
    (item.children?.some((c) => isActive(c.href)) ?? false);

  // The section whose sub-nav (third row) is shown, driven by the current route.
  const activeSection = NAV.find((item) => item.children && isSectionActive(item));

  const displayName = getUserDisplayName(user);
  const initiale = displayName.charAt(0).toUpperCase();

  return (
    <header className="shrink-0">
      {/* ── Row 1 — fixed brand bar ── */}
      <div className="flex h-16 items-center justify-between gap-4 bg-primary px-4 text-white md:px-6">
        {/* Logos + title */}
        <Link href="/dashboard" className="flex shrink-0 items-center gap-3">
          <Image
            src="/logo-psg.jpeg"
            alt="Agence Emploi Jeunes"
            width={120}
            height={44}
            style={{ width: 'auto', height: '44px' }}
            priority
            className="rounded-lg bg-white p-1 object-contain"
          />
          <Image
            src="/logo-aej.jpg"
            alt="Programme Social du Gouvernement"
            width={100}
            height={44}
            priority
            className="hidden rounded-lg bg-white p-1 object-contain sm:block"
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

         

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="Menu utilisateur"
                className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <Avatar className="size-9">
                  <AvatarFallback
                    className="font-bold text-white"
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                  >
                    {initiale}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold">{displayName}</span>
                {user?.email && (
                  <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/parametrage/profil">
                  <User className="mr-2 size-4 text-muted-foreground/70" />
                  Mon profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/parametrage/password">
                  <KeyRound className="mr-2 size-4 text-muted-foreground/70" />
                  Changer le mot de passe
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => logout()}>
                <LogOut className="mr-2 size-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ── Row 2 — main nav ── */}
      <div className="bg-card">
        <nav className="flex items-center gap-1 overflow-x-auto px-2 py-1.5 md:px-6">
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
            <nav className="flex items-center gap-1 overflow-x-auto px-2 py-1.5 md:px-6">
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
