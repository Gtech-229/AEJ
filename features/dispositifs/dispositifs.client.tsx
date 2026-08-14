'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Layers, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/data-table';
import {
  GenericTable,
  GenericDialogs,
  useDialogState,
  buildEditDeleteActionsColumn,
} from '@/components/generic';
import { DynamicForm } from '@/components/forms';
import type { Dispositif } from './dispositifs.dto';
import type { DispositifInput } from './dispositifs.schema';
import { dispositifSchema } from './dispositifs.schema';
import { getDispositifFormConfig } from './dispositifs.form';
import { getDispositifDefaults } from './dispositifs.defaults';
import {
  useCreateDispositif,
  useDeleteDispositif,
  useDispositifs,
  useUpdateDispositif,
} from './dispositifs.hooks';

/**
 * Chrome-less (no page header/padding of its own) so it can render inside the
 * "Projets & dispositifs" tab shell. The tab page owns the surrounding layout.
 */
export function DispositifsClient() {
  const { data: dispositifs, isLoading } = useDispositifs();
  const createDispositif = useCreateDispositif();
  const updateDispositif = useUpdateDispositif();
  const deleteDispositif = useDeleteDispositif();
  const dialog = useDialogState<Dispositif>();

  const columns: ColumnDef<Dispositif>[] = [
    {
      accessorKey: 'libelle',
      meta: { label: 'Libellé' },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Libellé" />,
      cell: ({ row }) => <span className="font-medium">{row.original.libelle}</span>,
    },
    {
      accessorKey: 'code',
      meta: { label: 'Code' },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">{row.original.code}</span>
      ),
    },
    {
      accessorKey: 'description',
      meta: { label: 'Description' },
      header: 'Description',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.description || '—'}
        </span>
      ),
    },
    buildEditDeleteActionsColumn<Dispositif>({
      onEdit: dialog.openEdit,
      onDelete: dialog.openDelete,
    }),
  ];

  return (
    <>
      <GenericTable<Dispositif>
        data={dispositifs ?? []}
        columns={columns}
        searchKey="libelle"
        searchPlaceholder="Rechercher un dispositif…"
        isLoading={isLoading}
        emptyIcon={Layers}
        emptyTitle="Aucun dispositif"
        emptyDescription="Créez des dispositifs pour pouvoir les affecter aux projets et guichets."
        toolbarEndSlot={
          <Button size="sm" onClick={dialog.openCreate}>
            <Plus className="size-4" />
            Ajouter
          </Button>
        }
      />

      <GenericDialogs<Dispositif>
        state={dialog}
        dialogSize="lg"
        titles={{
          create: 'Ajouter un dispositif',
          edit: 'Modifier le dispositif',
          delete: 'Supprimer le dispositif',
        }}
        renderForm={({ item, close }) => (
          <DynamicForm<DispositifInput>
            config={getDispositifFormConfig()}
            schema={dispositifSchema}
            defaultValues={getDispositifDefaults(item ?? undefined)}
            isLoading={createDispositif.isPending || updateDispositif.isPending}
            onCancel={close}
            submitText={item ? 'Modifier' : 'Ajouter'}
            onSubmit={(data) => {
              if (item) {
                updateDispositif.mutate({ ...item, ...data }, { onSuccess: close });
              } else {
                createDispositif.mutate(data, { onSuccess: close });
              }
            }}
          />
        )}
        isDeleting={deleteDispositif.isPending}
        onDelete={(item) => deleteDispositif.mutate(item.id, { onSuccess: () => dialog.close() })}
        deleteDescription={(item) =>
          `Supprimer le dispositif "${item.libelle}" ? Les guichets et projets rattachés en seront affectés.`
        }
      />
    </>
  );
}
