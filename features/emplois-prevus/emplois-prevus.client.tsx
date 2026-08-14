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
import { useGuichets } from '@/features/guichets/guichets.hooks';
import { useLocalites } from '@/features/localites/localites.hooks';
import type { EmploiPrevu } from './emplois-prevus.dto';
import type { EmploiPrevuInput } from './emplois-prevus.schema';
import { emploiPrevuSchema } from './emplois-prevus.schema';
import { getEmploiPrevuFormConfig } from './emplois-prevus.form';
import { getEmploiPrevuDefaults } from './emplois-prevus.defaults';
import {
  useCreateEmploiPrevu,
  useDeleteEmploiPrevu,
  useEmploisPrevus,
  useUpdateEmploiPrevu,
} from './emplois-prevus.hooks';

/**
 * Chrome-less (no page header/padding of its own) so it can render inside the
 * "Projets & dispositifs" tab shell. The tab page owns the surrounding layout.
 */
export function EmploisPrevusClient() {
  const { data: emplois, isLoading } = useEmploisPrevus();
  const { data: guichets } = useGuichets();
  const { data: localites } = useLocalites();
  const createEmploi = useCreateEmploiPrevu();
  const updateEmploi = useUpdateEmploiPrevu();
  const deleteEmploi = useDeleteEmploiPrevu();
  const dialog = useDialogState<EmploiPrevu>();

  const guichetLabel = useMemo(() => {
    const map = new Map<number, string>();
    (guichets ?? []).forEach((g) => map.set(g.id, g.libelle));
    return (id: number) => map.get(id) ?? `#${id}`;
  }, [guichets]);

  const localiteLabel = useMemo(() => {
    const map = new Map<number, string>();
    (localites ?? []).forEach((l) => map.set(l.id, l.nom));
    return (id: number) => map.get(id) ?? `#${id}`;
  }, [localites]);

  const columns: ColumnDef<EmploiPrevu>[] = [
    {
      accessorKey: 'intitule_poste',
      meta: { label: 'Poste' },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Poste" />,
      cell: ({ row }) => <span className="font-medium">{row.original.intitule_poste}</span>,
    },
    {
      accessorKey: 'guichet_id',
      meta: { label: 'Guichet' },
      header: 'Guichet',
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-normal">
          {guichetLabel(row.original.guichet_id)}
        </Badge>
      ),
    },
    {
      accessorKey: 'localite_id',
      meta: { label: 'Zone' },
      header: 'Zone',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {localiteLabel(row.original.localite_id)}
        </span>
      ),
    },
    {
      accessorKey: 'nombre_prevu',
      meta: { label: 'Nombre prévu' },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre prévu" />,
      cell: ({ row }) => (
        <span className="font-medium tabular-nums">{row.original.nombre_prevu}</span>
      ),
    },
    buildEditDeleteActionsColumn<EmploiPrevu>({
      onEdit: dialog.openEdit,
      onDelete: dialog.openDelete,
    }),
  ];

  return (
    <>
      <GenericTable<EmploiPrevu>
        data={emplois ?? []}
        columns={columns}
        searchKey="intitule_poste"
        searchPlaceholder="Rechercher un poste…"
        isLoading={isLoading}
        emptyIcon={Briefcase}
        emptyTitle="Aucun emploi prévu"
        emptyDescription="Définissez les cibles d'emplois prévus par guichet et par zone."
        toolbarEndSlot={
          <Button size="sm" onClick={dialog.openCreate}>
            <Plus className="size-4" />
            Ajouter
          </Button>
        }
      />

      <GenericDialogs<EmploiPrevu>
        state={dialog}
        dialogSize="lg"
        titles={{
          create: 'Ajouter un emploi prévu',
          edit: "Modifier l'emploi prévu",
          delete: "Supprimer l'emploi prévu",
        }}
        renderForm={({ item, close }) => (
          <DynamicForm<EmploiPrevuInput>
            config={getEmploiPrevuFormConfig(guichets ?? [], localites ?? [])}
            schema={emploiPrevuSchema}
            defaultValues={getEmploiPrevuDefaults(item ?? undefined)}
            isLoading={createEmploi.isPending || updateEmploi.isPending}
            onCancel={close}
            submitText={item ? 'Modifier' : 'Ajouter'}
            onSubmit={(data) => {
              if (item) {
                updateEmploi.mutate({ ...item, ...data }, { onSuccess: close });
              } else {
                createEmploi.mutate(data, { onSuccess: close });
              }
            }}
          />
        )}
        isDeleting={deleteEmploi.isPending}
        onDelete={(item) => deleteEmploi.mutate(item.id, { onSuccess: () => dialog.close() })}
        deleteDescription={(item) =>
          `Supprimer l'emploi prévu "${item.intitule_poste}" ? Cette action est irréversible.`
        }
      />
    </>
  );
}
