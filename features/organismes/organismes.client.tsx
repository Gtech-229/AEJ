'use client';

import { Suspense, useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/data-table';
import {
  GenericTable,
  GenericDialogs,
  useDialogState,
  buildEditDeleteActionsColumn,
} from '@/components/generic';
import { DynamicForm } from '@/components/forms';
import type { Organisme } from './organismes.dto';
import type { OrganismeInput } from './organismes.schema';
import { organismeSchema } from './organismes.schema';
import { getOrganismeFormConfig } from './organismes.form';
import { getOrganismeDefaults } from './organismes.defaults';
import {
  useCreateOrganisme,
  useDeleteOrganisme,
  useOrganismes,
  useUpdateOrganisme,
} from './organismes.hooks';

export function OrganismesClient() {
  const { data: organismes, isLoading } = useOrganismes();
  const createOrganisme = useCreateOrganisme();
  const updateOrganisme = useUpdateOrganisme();
  const deleteOrganisme = useDeleteOrganisme();
  const dialog = useDialogState<Organisme>();

  const columns: ColumnDef<Organisme>[] = useMemo(
    () => [
      {
        accessorKey: 'nom',
        meta: { label: 'Nom' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nom" />,
        cell: ({ row }) => <span className="font-medium">{row.original.nom}</span>,
      },
      {
        accessorKey: 'sigle',
        meta: { label: 'Sigle' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Sigle" />,
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">
            {row.original.sigle ?? '—'}
          </span>
        ),
      },
      {
        accessorKey: 'type_id',
        meta: { label: 'Type' },
        header: 'Type',
        // TODO: afficher le libellé du type une fois le référentiel connecté.
        cell: ({ row }) => <Badge variant="secondary">#{row.original.type_id}</Badge>,
      },
      {
        accessorKey: 'region_id',
        meta: { label: 'Région' },
        header: 'Région',
        // TODO: afficher le libellé de la région une fois le module Géographie connecté.
        cell: ({ row }) => (
          <span className="text-muted-foreground">#{row.original.region_id}</span>
        ),
      },
      buildEditDeleteActionsColumn<Organisme>({
        onEdit: dialog.openEdit,
        onDelete: dialog.openDelete,
      }),
    ],
    [dialog.openEdit, dialog.openDelete],
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Organismes</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Gérez les organismes de financement partenaires de la plateforme.
        </p>
      </div>

      <Suspense fallback={<div className="text-sm text-muted-foreground">Chargement…</div>}>
        <GenericTable<Organisme>
          data={organismes ?? []}
          columns={columns}
          searchKey="nom"
          searchPlaceholder="Rechercher un organisme…"
          isLoading={isLoading}
          toolbarEndSlot={
            <Button size="sm" onClick={dialog.openCreate}>
              <Plus className="size-4" />
              Ajouter
            </Button>
          }
        />
      </Suspense>

      <GenericDialogs<Organisme>
        state={dialog}
        dialogSize="lg"
        titles={{
          create: 'Ajouter un organisme',
          edit: "Modifier l'organisme",
          delete: "Supprimer l'organisme",
        }}
        renderForm={({ item, close }) => (
          <DynamicForm<OrganismeInput>
            config={getOrganismeFormConfig()}
            schema={organismeSchema}
            defaultValues={getOrganismeDefaults(item ?? undefined)}
            isLoading={createOrganisme.isPending || updateOrganisme.isPending}
            onCancel={close}
            submitText={item ? 'Modifier' : 'Ajouter'}
            onSubmit={(data) => {
              if (item) {
                updateOrganisme.mutate({ ...item, ...data }, { onSuccess: close });
              } else {
                createOrganisme.mutate(data, { onSuccess: close });
              }
            }}
          />
        )}
        isDeleting={deleteOrganisme.isPending}
        onDelete={(item) => deleteOrganisme.mutate(item.id, { onSuccess: () => dialog.close() })}
        deleteDescription={(item) =>
          `Supprimer l'organisme "${item.nom}" ? Cette action est irréversible.`
        }
      />
    </div>
  );
}
