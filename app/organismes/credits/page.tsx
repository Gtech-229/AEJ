'use client';

import { Suspense } from 'react';

import { GenericTable } from '@/components/generic/generic-table';
import { creditsColumns } from '@/features/credits/credits.columns';
import { CREDIT_STATUT_FACETED_OPTIONS } from '@/features/credits/credits.constants';
import { useCreditsList } from '@/features/credits/use-credits';

function CreditsPageContent() {
    const { data, isLoading } = useCreditsList();

    return (
        <div className="space-y-4 p-6">
            <div>
                <h1 className="text-2xl font-bold">Crédits</h1>
                <p className="text-sm text-muted-foreground">
                    Portefeuille de crédits — vue en lecture seule (l'octroi se fait via le workflow dédié).
                </p>
            </div>

            <GenericTable
                data={data?.data ?? []}
                columns={creditsColumns}
                searchKey="beneficiaire"
                searchPlaceholder="Rechercher un bénéficiaire…"
                facetedFilters={[{ columnId: 'statut', title: 'Statut', options: CREDIT_STATUT_FACETED_OPTIONS }]}
                isLoading={isLoading}
                emptyMessage="Aucun crédit enregistré."
            />
        </div>
    );
}

export default function CreditsPage() {
    return (
        <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Chargement…</div>}>
            <CreditsPageContent />
        </Suspense>
    );
}