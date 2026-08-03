'use client';

import { Suspense } from 'react';

import { GenericTable } from '@/components/generic/generic-table';
import { beneficiairesColumns } from '@/features/beneficiaires/beneficiaires.columns';
import { useBeneficiairesList } from '@/features/beneficiaires/use-beneficiaires';

function BeneficiairesPageContent() {
    const { data, isLoading } = useBeneficiairesList();

    return (
        <div className="space-y-4 p-6">
            <div>
                <h1 className="text-2xl font-bold">Bénéficiaires</h1>
                <p className="text-sm text-muted-foreground">
                    Personnes financées par votre institution — vue en lecture seule.
                </p>
            </div>

            <GenericTable
                data={data?.data ?? []}
                columns={beneficiairesColumns}
                searchKey="nomComplet"
                searchPlaceholder="Rechercher un bénéficiaire…"
                isLoading={isLoading}
                emptyMessage="Aucun bénéficiaire enregistré."
            />
        </div>
    );
}

export default function BeneficiairesPage() {
    return (
        <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Chargement…</div>}>
            <BeneficiairesPageContent />
        </Suspense>
    );
}