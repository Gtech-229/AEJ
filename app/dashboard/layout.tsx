import { PortailHeader } from '@/components/portail/PortailHeader';
import { SessionProvider } from '@/components/session/session-provider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    // <SessionProvider>
      <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
        <PortailHeader />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    // </SessionProvider>
  );
}
