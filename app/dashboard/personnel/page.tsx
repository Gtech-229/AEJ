import { PersonnelPage } from '@/features/personnels/personnelsPage';
import { Suspense } from 'react';

export const metadata = {
    title: 'Personnel',
};

export default function Page() {
    return (
        <Suspense fallback={<PersonnelPageSkeleton />}>
            <PersonnelPage />
        </Suspense>
    );
}

function PersonnelPageSkeleton() {
    return (
        <div className="min-h-screen bg-[#F5F6F8] flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Chargement…</p>
        </div>
    );
}