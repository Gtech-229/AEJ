import { Suspense } from 'react';
import { PortailHeader } from '@/components/portail/PortailHeader';
import { SessionProvider } from '@/components/session/session-provider';
import { MaintenanceGate } from '@/components/maintenance/maintenance-gate';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
    {/* // Wraps the whole shell (header included) so the maintenance screen is a
    // dedicated, full-page interface rather than content inside the app chrome. */}
    <MaintenanceGate>
      <div className="flex h-screen flex-col overflow-hidden bg-background">
        <PortailHeader />
        {/* Shared Suspense boundary so pages whose tables read the URL
            (useSearchParams via GenericTable) don't bail static prerender. */}
        <main className="flex-1 overflow-y-auto">
          <Suspense fallback={null}>{children}</Suspense>
        </main>
      </div>
    </MaintenanceGate>
    </SessionProvider>
  );
}