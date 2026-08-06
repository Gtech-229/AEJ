import EntrepriseHeader from '@/components/layout/EntrepriseHeader';
import EntrepriseSidebar from '@/components/layout/Entreprisesidebar';

export default function EntrepriseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F5F6F8]">
      <EntrepriseHeader />
      <div className="flex flex-1 overflow-hidden">
        <EntrepriseSidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
