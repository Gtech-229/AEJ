'use client';

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Briefcase, Plus } from 'lucide-react';
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
import { useServices } from '@/features/services/services.hooks';
import type { Fonction } from './fonctions.dto';
import type { FonctionInput } from './fonctions.schema';
import { fonctionSchema } from './fonctions.schema';
import { getFonctionFormConfig } from './fonctions.form';
import { getFonctionDefaults } from './fonctions.defaults';
import {
  useCreateFonction,
  useDeleteFonction,
  useFonctions,
  useUpdateFonction,
} from './fonctions.hooks';

/**
 * Chrome-less (no page header/padding of its own) so it can render inside the
 * "Autres paramètres" tab. The tab page owns the surrounding layout.
 */
export function FonctionsClient() {
  const { data: fonctions, isLoading } = useFonctions();
  const { data: services } = useServices();
  const createFonction = useCreateFonction();
  const updateFonction = useUpdateFonction();
  const deleteFonction = useDeleteFonction();
  const dialog = useDialogState<Fonction>();

  // Resolve service_id → name for the table column.
  const serviceName = useMemo(() => {
    const map = new Map<number, string>();
    (services ?? []).forEach((s) => map.set(s.id, s.nom));
    return (id: number) => map.get(id) ?? `#${id}`;
  }, [services]);

  const columns: ColumnDef<Fonction>[] = [
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
      accessorKey: 'service_id',
      meta: { label: 'Service' },
      header: 'Service',
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-normal">
          {serviceName(row.original.service_id)}
        </Badge>
      ),
    },
    buildEditDeleteActionsColumn<Fonction>({
      onEdit: dialog.openEdit,
      onDelete: dialog.openDelete,
    }),
  ];

  return (
    <>
      <GenericTable<Fonction>
        data={fonctions ?? []}
        columns={columns}
        searchKey="nom"
        searchPlaceholder="Rechercher une fonction…"
        isLoading={isLoading}
        emptyIcon={Briefcase}
        emptyTitle="Aucune fonction"
        emptyDescription="Créez des fonctions pour pouvoir les affecter aux employés."
        toolbarEndSlot={
          <Button size="sm" onClick={dialog.openCreate}>
            <Plus className="size-4" />
            Ajouter
          </Button>
        }
      />

      <GenericDialogs<Fonction>
        state={dialog}
        dialogSize="lg"
        titles={{
          create: 'Ajouter une fonction',
          edit: 'Modifier la fonction',
          delete: 'Supprimer la fonction',
        }}
        renderForm={({ item, close }) => (
          <DynamicForm<FonctionInput>
            config={getFonctionFormConfig(services ?? [])}
            schema={fonctionSchema}
            defaultValues={getFonctionDefaults(item ?? undefined)}
            isLoading={createFonction.isPending || updateFonction.isPending}
            onCancel={close}
            submitText={item ? 'Modifier' : 'Ajouter'}
            onSubmit={(data) => {
              if (item) {
                updateFonction.mutate({ ...item, ...data }, { onSuccess: close });
              } else {
                createFonction.mutate(data, { onSuccess: close });
              }
            }}
          />
        )}
        isDeleting={deleteFonction.isPending}
        onDelete={(item) => deleteFonction.mutate(item.id, { onSuccess: () => dialog.close() })}
        deleteDescription={(item) =>
          `Supprimer la fonction "${item.nom}" ? Cette action est irréversible.`
        }
      />
    </>
  );
}
