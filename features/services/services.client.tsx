'use client';

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Network, Plus } from 'lucide-react';
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
import { ManageDirectionsButton } from '@/features/directions/directions.client';
import { useDirections } from '@/features/directions/directions.hooks';
import type { Service } from './services.dto';
import { serviceSchema, type ServiceInput } from './services.schema';
import { getServiceFormConfig } from './services.form';
import { getServiceDefaults } from './services.defaults';
import {
  useCreateService,
  useDeleteService,
  useServices,
  useUpdateService,
} from './services.hooks';

export function ServicesClient() {
  const { data: services, isLoading } = useServices();
  const { data: directions } = useDirections();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  const dialog = useDialogState<Service>();

  // Resolve direction_id → name for the table column.
  const directionName = useMemo(() => {
    const map = new Map<number, string>();
    (directions ?? []).forEach((d) => map.set(d.id, d.nom));
    return (id: number) => map.get(id) ?? `#${id}`;
  }, [directions]);

  const columns: ColumnDef<Service>[] = [
    {
      accessorKey: 'nom',
      meta: { label: 'Nom' },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nom" />,
      cell: ({ row }) => <span className="font-medium">{row.original.nom}</span>,
    },
    {
      accessorKey: 'code',
      meta: { label: 'Code' },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">{row.original.code ?? '—'}</span>
      ),
    },
    {
      accessorKey: 'direction_id',
      meta: { label: 'Direction' },
      header: 'Direction',
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-normal">
          {directionName(row.original.direction_id)}
        </Badge>
      ),
    },
    buildEditDeleteActionsColumn<Service>({
      onEdit: dialog.openEdit,
      onDelete: dialog.openDelete,
    }),
  ];

  return (
    <>
      <GenericTable<Service>
        data={services ?? []}
        columns={columns}
        searchKey="nom"
        searchPlaceholder="Rechercher un service…"
        isLoading={isLoading}
        emptyIcon={Network}
        emptyTitle="Aucun service"
        emptyDescription="Créez des services et rattachez-les à une direction."
        toolbarEndSlot={
          <div className="flex items-center gap-2">
            <ManageDirectionsButton />
            <Button size="sm" onClick={dialog.openCreate}>
              <Plus className="size-4" />
              Ajouter
            </Button>
          </div>
        }
      />

      <GenericDialogs<Service>
        state={dialog}
        dialogSize="lg"
        titles={{
          create: 'Ajouter un service',
          edit: 'Modifier le service',
          delete: 'Supprimer le service',
        }}
        renderForm={({ item, close }) => (
          <DynamicForm<ServiceInput>
            config={getServiceFormConfig(directions ?? [])}
            schema={serviceSchema}
            defaultValues={getServiceDefaults(item ?? undefined)}
            isLoading={createService.isPending || updateService.isPending}
            onCancel={close}
            submitText={item ? 'Modifier' : 'Ajouter'}
            onSubmit={(data) => {
              if (item) {
                updateService.mutate({ ...item, ...data }, { onSuccess: close });
              } else {
                createService.mutate(data, { onSuccess: close });
              }
            }}
          />
        )}
        isDeleting={deleteService.isPending}
        onDelete={(item) => deleteService.mutate(item.id, { onSuccess: () => dialog.close() })}
        deleteDescription={(item) =>
          `Supprimer le service "${item.nom}" ? Les fonctions rattachées ne seront plus reliées à un service.`
        }
      />
    </>
  );
}
