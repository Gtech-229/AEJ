import OrganismeSidebar from '@/components/layout/Organismessidebar';
import OrganismeHeader  from '@/components/layout/Organismesheader';

export default function OrganismeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <OrganismeSidebar /> 
      <div className="flex-1 flex flex-col overflow-hidden">
        <OrganismeHeader />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}