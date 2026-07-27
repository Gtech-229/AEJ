import { PortailHeader } from '@/components/portail/PortailHeader';
import { SessionProvider } from '@/components/session/session-provider';
import { MaintenanceGate } from '@/components/maintenance/maintenance-gate';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
    {/* // Wraps the whole shell (header included) so the maintenance screen is a
    // dedicated, full-page interface rather than content inside the app chrome. */}
    <MaintenanceGate>
      <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
        <PortailHeader />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </MaintenanceGate>
    </SessionProvider>
  );
}