import Header from '@/components/layout/Header';
import OrganismesSidebar from '@/components/layout/Organismessidebar';

export default function OrganismesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <OrganismesSidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
