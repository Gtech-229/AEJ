'use client';

import { Suspense } from 'react';

import { GenericTable } from '@/components/generic/generic-table';
import { projetsColumns } from '@/features/projets/projets.columns';
import { PROJET_STATUT_FACETED_OPTIONS } from '@/features/projets/projets.constants';
import { useProjetsList } from '@/features/projets/use-projets';

function ProjetsPageContent() {
    const { data, isLoading } = useProjetsList();

    return (
        <div className="space-y-4 p-6">
            <div>
                <h1 className="text-2xl font-bold">Projets</h1>
                <p className="text-sm text-muted-foreground">
                    Projets financés impliquant votre entreprise — vue en lecture seule.
                </p>
            </div>

            <GenericTable
                data={data?.data ?? []}
                columns={projetsColumns}
                searchKey="intitule"
                searchPlaceholder="Rechercher un projet…"
                facetedFilters={[{ columnId: 'statut', title: 'Statut', options: PROJET_STATUT_FACETED_OPTIONS }]}
                isLoading={isLoading}
                emptyMessage="Aucun projet enregistré."
            />
        </div>
    );
}

export default function ProjetsPage() {
    return (
        <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Chargement…</div>}>
            <ProjetsPageContent />
        </Suspense>
    );
}