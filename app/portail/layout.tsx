import { PortailHeader } from '@/components/portail/PortailHeader';

export default function PortailLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PortailHeader />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
