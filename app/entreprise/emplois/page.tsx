'use client';

import { Suspense } from 'react';

import { useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GenericTable } from '@/components/generic/generic-table';
import { GenericDialogs, useDialogState } from '@/components/generic';
import { DynamicForm } from '@/components/forms';
import { EMPLOI_STATUT_FACETED_OPTIONS } from '@/features/emplois/emplois.constants';
import { emploiFormConfig } from '@/features/emplois/emplois.form.config';
import { emploiSchema, type EmploiFormValues } from '@/features/emplois/emplois.schema';
import { buildEmploisColumns } from '@/features/emplois/emplois.columns';
import {
    useCreateEmploi,
    useDeleteEmploi,
    useEmploisList,
    useUpdateEmploi,
} from '@/features/emplois/use-emplois';
import type { Emploi } from '@/features/emplois/emplois.types';

const DEFAULT_VALUES: Partial<EmploiFormValues> = { statut: 'ouvert', typeContrat: 'cdi' };

function EmploisPageContent() {
    const { data, isLoading } = useEmploisList();
    const createMutation = useCreateEmploi();
    const updateMutation = useUpdateEmploi();
    const deleteMutation = useDeleteEmploi();

    const dialogState = useDialogState<Emploi>();

    const columns = useMemo(
        () => buildEmploisColumns({ onEdit: dialogState.openEdit, onDelete: dialogState.openDelete }),
        [dialogState],
    );

    async function handleSubmit(values: EmploiFormValues) {
        if (dialogState.isEditOpen && dialogState.item) {
            await updateMutation.mutateAsync({ id: dialogState.item.id, ...values });
        } else {
            await createMutation.mutateAsync(values);
        }
        dialogState.close();
    }

    return (
        <div className="space-y-4 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Emplois</h1>
                    <p className="text-sm text-muted-foreground">Offres d'emploi proposées par votre entreprise.</p>
                </div>
                <Button onClick={dialogState.openCreate}>
                    <Plus className="mr-2 size-4" />
                    Nouvelle offre
                </Button>
            </div>

            <GenericTable
                data={data?.data ?? []}
                columns={columns}
                searchKey="intitule"
                searchPlaceholder="Rechercher une offre…"
                facetedFilters={[{ columnId: 'statut', title: 'Statut', options: EMPLOI_STATUT_FACETED_OPTIONS }]}
                isLoading={isLoading}
                emptyMessage="Aucune offre d'emploi."
            />

            <GenericDialogs<Emploi>
                state={dialogState}
                titles={{
                    create: "Nouvelle offre d'emploi",
                    edit: "Modifier l'offre d'emploi",
                    delete: "Supprimer l'offre d'emploi",
                }}
                descriptions={{
                    create: 'Renseignez les informations de la nouvelle offre.',
                    edit: "Mettez à jour les informations de l'offre.",
                }}
                renderForm={({ mode, item, close }) => (
                    <DynamicForm<EmploiFormValues>
                        config={emploiFormConfig}
                        schema={emploiSchema}
                        defaultValues={(mode === 'edit' && item ? item : DEFAULT_VALUES) as EmploiFormValues}
                        onSubmit={handleSubmit}
                        onCancel={close}
                        isLoading={createMutation.isPending || updateMutation.isPending}
                        submitText={mode === 'edit' ? 'Mettre à jour' : 'Publier'}
                    />
                )}
                onDelete={(item) => deleteMutation.mutate(item.id)}
                deleteDescription={(item) => (
                    <>Cette action supprimera définitivement l'offre <strong>{item.intitule}</strong>.</>
                )}
                isDeleting={deleteMutation.isPending}
            />
        </div>
    );
}

export default function EmploisPage() {
    return (
        <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Chargement…</div>}>
            <EmploisPageContent />
        </Suspense>
    );
}