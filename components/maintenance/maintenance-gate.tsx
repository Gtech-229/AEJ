'use client';

import MaintenanceError from '@/components/errors/MaintenanceError';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/auth.context';
import { canBypassMaintenance } from '@/features/auth/auth.roles';
import { useConfigurations } from '@/features/configurations/configurations.hooks';

/**
 * Shows the dedicated maintenance screen to everyone except the roles allowed
 * to work during maintenance (see `MAINTENANCE_ALLOWED_ROLE_IDS`).
 *
 * This is presentation only — the backend is the real gate. It should reject
 * non-exempt roles at login and on every request (503) regardless of what this
 * component renders.
 */
export function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const { data: config, isLoading: configLoading } = useConfigurations();
  const { user, loading: userLoading, logout } = useAuth();

  // While either is still unknown, render the app rather than flashing the
  // maintenance screen. The backend enforces regardless, so this is safe.
  if (configLoading || userLoading) return <>{children}</>;

  const inMaintenance = !!config?.mise_en_maintenance;
  if (!inMaintenance || canBypassMaintenance(user)) return <>{children}</>;

  return (
    <div className="relative">
      <MaintenanceError />
      {/* Escape hatch — otherwise a signed-in user is stuck on this screen. */}
      <div className="absolute inset-x-0 bottom-8 flex justify-center">
        <Button variant="ghost" onClick={() => logout()}>
          Se déconnecter
        </Button>
      </div>
    </div>
  );
}
