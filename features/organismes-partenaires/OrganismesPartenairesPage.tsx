'use client';

import { useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GenericTable } from '@/components/generic/generic-table';
import { GenericDialogs, useDialogState } from '@/components/generic';
import { DynamicForm } from '@/components/forms';
import { buildOrganismesColumns } from './organismes-partenaires.columns';
import { ORGANISME_FORM_CONFIG } from './organismes-partenaires.form-config';
import { organismeSchema } from './organismes-partenaires.schema';
import {
  useCreateOrganisme,
  useDeleteOrganisme,
  useOrganismesList,
  useUpdateOrganisme,
  type OrganismePartenaire,
  type OrganismeFormValues,
} from './use-organismes-partenaires';

const DEFAULT_VALUES: Partial<OrganismeFormValues> = { type: 'banque', statut: 'actif' };

const TYPE_FILTER_OPTIONS = [
  { value: 'banque', label: 'Banque' },
  { value: 'sfd', label: 'SFD' },
  { value: 'fonds_garantie', label: 'Fonds de garantie' },
];

export function OrganismesPartenairesPage() {
  const { data, isLoading } = useOrganismesList();
  const createMutation = useCreateOrganisme();
  const updateMutation = useUpdateOrganisme();
  const deleteMutation = useDeleteOrganisme();
  const dialogState = useDialogState<OrganismePartenaire>();

  const columns = useMemo(
    () => buildOrganismesColumns({ onEdit: dialogState.openEdit, onDelete: dialogState.openDelete }),
    [dialogState],
  );

  async function handleSubmit(values: OrganismeFormValues) {
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
          <h1 className="text-2xl font-bold">Organismes partenaires</h1>
          <p className="text-sm text-muted-foreground">
            Banques, SFD et fonds de garantie partenaires du programme de financement.
          </p>
        </div>
        <Button onClick={dialogState.openCreate}>
          <Plus className="mr-2 size-4" />
          Ajouter un organisme
        </Button>
      </div>

      <GenericTable
        data={data}
        columns={columns}
        searchKey="nom"
        searchPlaceholder="Rechercher un organisme..."
        facetedFilters={[{ columnId: 'type', title: 'Type', options: TYPE_FILTER_OPTIONS }]}
        isLoading={isLoading}
        emptyMessage="Aucun organisme partenaire enregistré."
      />

      <GenericDialogs<OrganismePartenaire>
        state={dialogState}
        titles={{
          create: 'Ajouter un organisme partenaire',
          edit: "Modifier l'organisme",
          delete: "Supprimer l'organisme",
        }}
        descriptions={{
          create: 'Renseignez les informations du nouvel organisme partenaire.',
          edit: "Mettez à jour les informations de l'organisme.",
        }}
        renderForm={({ mode, item, close }) => (
          <DynamicForm<OrganismeFormValues>
            config={ORGANISME_FORM_CONFIG}
            schema={organismeSchema}
            defaultValues={(mode === 'edit' && item ? item : DEFAULT_VALUES) as OrganismeFormValues}
            onSubmit={handleSubmit}
            onCancel={close}
            isLoading={createMutation.isPending || updateMutation.isPending}
            submitText={mode === 'edit' ? 'Mettre à jour' : 'Ajouter'}
          />
        )}
        onDelete={(item) => deleteMutation.mutate(item.id)}
        deleteDescription={(item) => (
          <>Cette action supprimera définitivement <strong>{item.nom}</strong> de la liste des partenaires.</>
        )}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
