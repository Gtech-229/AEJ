'use client';

import { Suspense } from 'react';

import { useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GenericTable } from '@/components/generic/generic-table';
import { GenericDialogs, useDialogState } from '@/components/generic';
import { DynamicForm } from '@/components/forms';
import { AGENCE_STATUT_FACETED_OPTIONS } from '@/features/agences/agences.constants';
import { agenceFormConfig } from '@/features/agences/agences.form.config';
import { agenceSchema, type AgenceFormValues } from '@/features/agences/agences.schema';
import { buildAgencesColumns } from '@/features/agences/agences.columns';
import {
    useAgencesList,
    useCreateAgence,
    useDeleteAgence,
    useUpdateAgence,
} from '@/features/agences/use-agence';
import type { Agence } from '@/features/agences/agences.types';

const DEFAULT_VALUES: Partial<AgenceFormValues> = { statut: 'active', nbEmployes: 0 };

function AgencesPageContent() {
    const { data, isLoading } = useAgencesList();
    const createMutation = useCreateAgence();
    const updateMutation = useUpdateAgence();
    const deleteMutation = useDeleteAgence();

    const dialogState = useDialogState<Agence>();

    const columns = useMemo(
        () => buildAgencesColumns({ onEdit: dialogState.openEdit, onDelete: dialogState.openDelete }),
        [dialogState],
    );

    async function handleSubmit(values: AgenceFormValues) {
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
                    <h1 className="text-2xl font-bold">Agences</h1>
                    <p className="text-sm text-muted-foreground">Réseau d'agences de votre institution.</p>
                </div>
                <Button onClick={dialogState.openCreate}>
                    <Plus className="mr-2 size-4" />
                    Nouvelle agence
                </Button>
            </div>

            <GenericTable
                data={data?.data ?? []}
                columns={columns}
                searchKey="nom"
                searchPlaceholder="Rechercher une agence…"
                facetedFilters={[{ columnId: 'statut', title: 'Statut', options: AGENCE_STATUT_FACETED_OPTIONS }]}
                isLoading={isLoading}
                emptyMessage="Aucune agence enregistrée."
            />

            <GenericDialogs<Agence>
                state={dialogState}
                titles={{ create: 'Nouvelle agence', edit: "Modifier l'agence", delete: "Supprimer l'agence" }}
                descriptions={{
                    create: "Renseignez les informations de la nouvelle agence.",
                    edit: "Mettez à jour les informations de l'agence.",
                }}
                renderForm={({ mode, item, close }) => (
                    <DynamicForm<AgenceFormValues>
                        config={agenceFormConfig}
                        schema={agenceSchema}
                        defaultValues={(mode === 'edit' && item ? item : DEFAULT_VALUES) as AgenceFormValues}
                        onSubmit={handleSubmit}
                        onCancel={close}
                        isLoading={createMutation.isPending || updateMutation.isPending}
                        submitText={mode === 'edit' ? 'Mettre à jour' : 'Créer'}
                    />
                )}
                onDelete={(item) => deleteMutation.mutate(item.id)}
                deleteDescription={(item) => (
                    <>Cette action supprimera définitivement l'agence <strong>{item.nom}</strong>.</>
                )}
                isDeleting={deleteMutation.isPending}
            />
        </div>
    );
}

export default function AgencesPage() {
    return (
        <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Chargement…</div>}>
            <AgencesPageContent />
        </Suspense>
    );
}