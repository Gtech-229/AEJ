'use client';

import { useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GenericTable } from '@/components/generic/generic-table';
import { GenericDialogs, useDialogState } from '@/components/generic';
import { DynamicForm } from '@/components/forms';
import { DEPARTEMENT_FACETED_OPTIONS, STATUT_FACETED_OPTIONS } from './personnels.constants';
import { personnelFormConfig } from './personnels.form-config';
import { personnelSchema, type PersonnelFormValues } from './personnels.schema';
import { buildPersonnelColumns } from './personnels.columns';
import {
    useCreatePersonnel,
    useDeletePersonnel,
    usePersonnelList,
    useUpdatePersonnel,
} from './use-personnels';
import type { Personnel } from '@/lib/types';

const DEFAULT_VALUES: Partial<PersonnelFormValues> = {
    statut: 'actif',
};


export function PersonnelPage() {
    const { data, isLoading } = usePersonnelList();
    const createMutation = useCreatePersonnel();
    const updateMutation = useUpdatePersonnel();
    const deleteMutation = useDeletePersonnel();

    const dialogState = useDialogState<Personnel>();

    const columns = useMemo(
        () =>
            buildPersonnelColumns({
                onEdit: dialogState.openEdit,
                onDelete: dialogState.openDelete,
            }),
        [dialogState],
    );

    async function handleSubmit(values: PersonnelFormValues) {
        if (dialogState.isEditOpen && dialogState.item) {
            await updateMutation.mutateAsync({ id: dialogState.item.id, ...values });
        } else {
            await createMutation.mutateAsync(values);
        }
        dialogState.close();
    }

    return (
        <div className="space-y-6 px-6 py-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Gestion du personnel</h1>
                    <p className="text-sm text-muted-foreground">
                        Employés de l&apos;agence : recrutement, RH, administration…
                    </p>
                </div>
                <Button onClick={dialogState.openCreate}>
                    <Plus className="mr-2 size-4" />
                    Ajouter un employé
                </Button>
            </div>

            <GenericTable
                data={data?.data ?? []}
                columns={columns}
                searchKey="nomComplet"
                searchPlaceholder="Rechercher un employé…"
                facetedFilters={[
                    { columnId: 'departement', title: 'Département', options: DEPARTEMENT_FACETED_OPTIONS },
                    { columnId: 'statut', title: 'Statut', options: STATUT_FACETED_OPTIONS },
                ]}
                isLoading={isLoading}
                emptyMessage="Aucun employé enregistré."
            />

            <GenericDialogs<Personnel>
                state={dialogState}
                titles={{
                    create: 'Ajouter un employé',
                    edit: "Modifier la fiche de l'employé",
                    delete: "Supprimer l'employé",
                }}
                descriptions={{
                    create: "Renseignez les informations du nouvel employé de l'agence.",
                    edit: "Mettez à jour les informations de l'employé.",
                }}
                renderForm={({ mode, item, close }) => (
                    <DynamicForm<PersonnelFormValues>
                        config={personnelFormConfig}
                        schema={personnelSchema}
                        defaultValues={
                            (mode === 'edit' && item ? item : DEFAULT_VALUES) as PersonnelFormValues
                        }
                        onSubmit={handleSubmit}
                        onCancel={close}
                        isLoading={createMutation.isPending || updateMutation.isPending}
                        submitText={mode === 'edit' ? 'Mettre à jour' : 'Ajouter'}
                    />
                )}
                onDelete={(item) => deleteMutation.mutate(item.id)}
                deleteDescription={(item) => (
                    <>
                        Cette action supprimera définitivement <strong>{item.prenom} {item.nom}</strong> de
                        la liste du personnel.
                    </>
                )}
                isDeleting={deleteMutation.isPending}
            />
        </div>
    );
}