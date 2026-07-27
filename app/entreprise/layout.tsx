import EntrepriseSidebar from '@/components/layout/Entreprisesidebar';
import Header from '@/components/layout/Header';


export default function EntrepriseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <EntrepriseSidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}