import Header from '@/components/layout/Header';
import InstitutionSidebar from '@/components/layout/Institutionsidebar';

export default function InstitutionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <InstitutionSidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}