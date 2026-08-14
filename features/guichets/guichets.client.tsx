'use client';

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Building2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/data-table';
import {
  GenericTable,
  GenericDialogs,
  useDialogState,
  buildEditDeleteActionsColumn,
} from '@/components/generic';
import { DynamicForm } from '@/components/forms';
import { useDispositifs } from '@/features/dispositifs/dispositifs.hooks';
import type { Guichet } from './guichets.dto';
import type { GuichetInput } from './guichets.schema';
import { guichetSchema } from './guichets.schema';
import { getGuichetFormConfig } from './guichets.form';
import { getGuichetDefaults } from './guichets.defaults';
import { useCreateGuichet, useDeleteGuichet, useGuichets, useUpdateGuichet } from './guichets.hooks';

/**
 * Chrome-less (no page header/padding of its own) so it can render inside the
 * "Projets & dispositifs" tab shell. The tab page owns the surrounding layout.
 */
export function GuichetsClient() {
  const { data: guichets, isLoading } = useGuichets();
  const { data: dispositifs } = useDispositifs();
  const createGuichet = useCreateGuichet();
  const updateGuichet = useUpdateGuichet();
  const deleteGuichet = useDeleteGuichet();
  const dialog = useDialogState<Guichet>();

  // Resolve dispositif_id → libellé for the table column.
  const dispositifLabel = useMemo(() => {
    const map = new Map<number, string>();
    (dispositifs ?? []).forEach((d) => map.set(d.id, d.libelle));
    return (id: number) => map.get(id) ?? `#${id}`;
  }, [dispositifs]);

  const columns: ColumnDef<Guichet>[] = [
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
      accessorKey: 'dispositif_id',
      meta: { label: 'Dispositif' },
      header: 'Dispositif',
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-normal">
          {dispositifLabel(row.original.dispositif_id)}
        </Badge>
      ),
    },
    buildEditDeleteActionsColumn<Guichet>({
      onEdit: dialog.openEdit,
      onDelete: dialog.openDelete,
    }),
  ];

  return (
    <>
      <GenericTable<Guichet>
        data={guichets ?? []}
        columns={columns}
        searchKey="libelle"
        searchPlaceholder="Rechercher un guichet…"
        isLoading={isLoading}
        emptyIcon={Building2}
        emptyTitle="Aucun guichet"
        emptyDescription="Créez des guichets pour pouvoir les affecter aux projets."
        toolbarEndSlot={
          <Button size="sm" onClick={dialog.openCreate}>
            <Plus className="size-4" />
            Ajouter
          </Button>
        }
      />

      <GenericDialogs<Guichet>
        state={dialog}
        dialogSize="lg"
        titles={{
          create: 'Ajouter un guichet',
          edit: 'Modifier le guichet',
          delete: 'Supprimer le guichet',
        }}
        renderForm={({ item, close }) => (
          <DynamicForm<GuichetInput>
            config={getGuichetFormConfig(dispositifs ?? [])}
            schema={guichetSchema}
            defaultValues={getGuichetDefaults(item ?? undefined)}
            isLoading={createGuichet.isPending || updateGuichet.isPending}
            onCancel={close}
            submitText={item ? 'Modifier' : 'Ajouter'}
            onSubmit={(data) => {
              if (item) {
                updateGuichet.mutate({ ...item, ...data }, { onSuccess: close });
              } else {
                createGuichet.mutate(data, { onSuccess: close });
              }
            }}
          />
        )}
        isDeleting={deleteGuichet.isPending}
        onDelete={(item) => deleteGuichet.mutate(item.id, { onSuccess: () => dialog.close() })}
        deleteDescription={(item) =>
          `Supprimer le guichet "${item.libelle}" ? Les projets rattachés en seront affectés.`
        }
      />
    </>
  );
}
