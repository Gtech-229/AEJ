'use client';

import { Suspense } from 'react';

import { useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GenericTable } from '@/components/generic/generic-table';
import { GenericDialogs, useDialogState } from '@/components/generic';
import { DynamicForm } from '@/components/forms';
import { STAGE_STATUT_FACETED_OPTIONS } from '@/features/stages/stages.constants';
import { stageFormConfig } from '@/features/stages/stages.form.config';
import { stageSchema, type StageFormValues } from '@/features/stages/stages.schema';
import { buildStagesColumns } from '@/features/stages/stages.columns';
import {
    useCreateStage,
    useDeleteStage,
    useStagesList,
    useUpdateStage,
} from '@/features/stages/use-stages';
import type { Stage } from '@/features/stages/stages.types';

const DEFAULT_VALUES: Partial<StageFormValues> = { statut: 'ouvert', nombrePlaces: 1 };

function StagesPageContent() {
    const { data, isLoading } = useStagesList();
    const createMutation = useCreateStage();
    const updateMutation = useUpdateStage();
    const deleteMutation = useDeleteStage();

    const dialogState = useDialogState<Stage>();

    const columns = useMemo(
        () => buildStagesColumns({ onEdit: dialogState.openEdit, onDelete: dialogState.openDelete }),
        [dialogState],
    );

    async function handleSubmit(values: StageFormValues) {
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
                    <h1 className="text-2xl font-bold">Stages</h1>
                    <p className="text-sm text-muted-foreground">Offres de stage proposées par votre entreprise.</p>
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
                facetedFilters={[{ columnId: 'statut', title: 'Statut', options: STAGE_STATUT_FACETED_OPTIONS }]}
                isLoading={isLoading}
                emptyMessage="Aucune offre de stage."
            />

            <GenericDialogs<Stage>
                state={dialogState}
                titles={{
                    create: 'Nouvelle offre de stage',
                    edit: "Modifier l'offre de stage",
                    delete: "Supprimer l'offre de stage",
                }}
                descriptions={{
                    create: 'Renseignez les informations de la nouvelle offre.',
                    edit: "Mettez à jour les informations de l'offre.",
                }}
                renderForm={({ mode, item, close }) => (
                    <DynamicForm<StageFormValues>
                        config={stageFormConfig}
                        schema={stageSchema}
                        defaultValues={(mode === 'edit' && item ? item : DEFAULT_VALUES) as StageFormValues}
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

export default function StagesPage() {
    return (
        <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Chargement…</div>}>
            <StagesPageContent />
        </Suspense>
    );
}