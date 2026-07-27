import { Suspense } from 'react';
import { JournalPage } from '@/features/journal/JournalPage';

export const metadata = {
  title: "Journal d'activité",
};

export default function Page() {
  return (
    <Suspense fallback={<JournalPageSkeleton />}>
      <JournalPage />
    </Suspense>
  );
}

function JournalPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#F5F6F8] flex items-center justify-center">
      <p className="text-sm text-muted-foreground">Chargement du journal…</p>
    </div>
  );
}
