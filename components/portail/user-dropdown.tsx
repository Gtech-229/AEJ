'use client';

import Link from 'next/link';
import { AlertCircle, ChevronRight, KeyRound, LogOut, ShieldCheck, ShieldCog } from 'lucide-react';
import { cn, getDisplayNameInitials } from '@/lib/utils';
import { getUserDisplayName, type User } from '@/features/auth/auth.dto';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserDropdownProps {
  user: User | null;
  onLogout?: () => void;
  /** "Gérer le compte" target. */
  accountUrl?: string;
}

/**
 * Top-nav account menu: an avatar trigger opening a header card (name, email,
 * status) plus account / password / logout actions. The current user comes from
 * `useAuth()` upstream; this component only presents it.
 */
export function UserDropdown({
  user,
  onLogout,
  accountUrl = '/dashboard/parametrage/profil',
}: UserDropdownProps) {
  const displayName = getUserDisplayName(user);
  const initials = getDisplayNameInitials(displayName);
  const actif = (user?.is_active ?? 1) !== 0;

  return (
    <DropdownMenu >
      <DropdownMenuTrigger className='cursor-pointer hover:shadow-md' asChild>
        <button
          aria-label="Menu utilisateur"
          className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <Avatar className="size-9">
            <AvatarFallback
              className="font-bold text-white"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-64 rounded-xl p-0">
        {/* Header card */}
        <div className="flex flex-col items-center gap-2 border-b border-border px-4 py-4 text-center">
          <div className="relative">
            <Avatar className="size-14">
              <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-popover bg-emerald-500" />
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-foreground">{displayName}</p>
            {user?.email && <p className="text-xs text-muted-foreground">{user.email}</p>}
          </div>
          <div className="flex flex-wrap items-center justify-center pt-1">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
                actif
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-red-500/10 text-red-600 dark:text-red-400',
              )}
            >
              {actif ? <ShieldCheck className="size-3" /> : <AlertCircle className="size-3" />}
              {actif ? 'Compte actif' : 'Action requise'}
            </span>
           
          </div>
        </div>

        {/* Actions */}
        <div className="p-1.5">
          <DropdownMenuItem asChild className="gap-3 rounded-lg px-2 py-2">
            <Link href={accountUrl}>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <ShieldCog className="size-4" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm font-medium text-foreground">Gérer votre compte</span>
                <span className="text-xs text-muted-foreground">Profil et sécurité</span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </Link>
          </DropdownMenuItem>

        
        </div>

        <DropdownMenuSeparator className="my-0" />

        <div className="p-1.5">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => onLogout?.()}
            className="gap-3 rounded-lg px-2 py-2"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive">
              <LogOut className="size-4" />
            </span>
            <span className="text-sm font-medium">Déconnexion</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
