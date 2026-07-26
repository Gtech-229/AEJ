'use client';

import { Suspense, useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/data-table';
import type { FacetedFilter } from '@/components/data-table';
import {
  GenericTable,
  GenericDialogs,
  useDialogState,
  buildEditDeleteActionsColumn,
} from '@/components/generic';
import { DynamicForm } from '@/components/forms';
import type { Localite } from './localites.dto';
import type { LocaliteInput } from './localites.schema';
import { localiteSchema } from './localites.schema';
import { getLocaliteFormConfig } from './localites.form';
import { getLocaliteDefaults } from './localites.defaults';
import {
  useCreateLocalite,
  useDeleteLocalite,
  useLocalites,
  useUpdateLocalite,
} from './localites.hooks';

const FACETS: FacetedFilter[] = [
  {
    columnId: 'couche_cartographique',
    title: 'Couche cartographique',
    options: [
      { label: 'Zone urbaine', value: 'zone_urbaine' },
      { label: 'Zone rurale', value: 'zone_rurale' },
    ],
  },
];

export function LocalitesClient() {
  const { data: localites, isLoading } = useLocalites();
  const createLocalite = useCreateLocalite();
  const updateLocalite = useUpdateLocalite();
  const deleteLocalite = useDeleteLocalite();
  const dialog = useDialogState<Localite>();

  const columns: ColumnDef<Localite>[] = useMemo(
    () => [
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
          <span className="font-mono text-xs text-muted-foreground">
            {row.original.code ?? '—'}
          </span>
        ),
      },
      {
        accessorKey: 'couche_cartographique',
        meta: { label: 'Couche cartographique' },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Couche cartographique" />
        ),
        cell: ({ row }) =>
          row.original.couche_cartographique ? (
            <Badge variant="secondary">{row.original.couche_cartographique}</Badge>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        accessorKey: 'niveau_localite_id',
        meta: { label: 'Niveau' },
        header: 'Niveau',
        // TODO: afficher le libellé du niveau (relation) une fois le module
        // Niveaux localités livré — pour l'instant, juste l'ID brut.
        cell: ({ row }) => (
          <span className="text-muted-foreground">#{row.original.niveau_localite_id}</span>
        ),
      },
      buildEditDeleteActionsColumn<Localite>({
        onEdit: dialog.openEdit,
        onDelete: dialog.openDelete,
      }),
    ],
    [dialog.openEdit, dialog.openDelete],
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Localités</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Gérez les localités rattachées aux niveaux de la plateforme.
        </p>
      </div>

      <Suspense fallback={<div className="text-sm text-muted-foreground">Chargement…</div>}>
        <GenericTable<Localite>
          data={localites ?? []}
          columns={columns}
          searchKey="nom"
          searchPlaceholder="Rechercher une localité…"
          facetedFilters={FACETS}
          isLoading={isLoading}
          toolbarEndSlot={
            <Button size="sm" onClick={dialog.openCreate}>
              <Plus className="size-4" />
              Ajouter
            </Button>
          }
        />
      </Suspense>

      <GenericDialogs<Localite>
        state={dialog}
        dialogSize="lg"
        titles={{
          create: 'Ajouter une localité',
          edit: 'Modifier la localité',
          delete: 'Supprimer la localité',
        }}
        renderForm={({ item, close }) => (
          <DynamicForm<LocaliteInput>
            config={getLocaliteFormConfig()}
            schema={localiteSchema}
            defaultValues={getLocaliteDefaults(item ?? undefined)}
            isLoading={createLocalite.isPending || updateLocalite.isPending}
            onCancel={close}
            submitText={item ? 'Modifier' : 'Ajouter'}
            onSubmit={(data) => {
              if (item) {
                updateLocalite.mutate({ ...item, ...data }, { onSuccess: close });
              } else {
                createLocalite.mutate(data, { onSuccess: close });
              }
            }}
          />
        )}
        isDeleting={deleteLocalite.isPending}
        onDelete={(item) => deleteLocalite.mutate(item.id, { onSuccess: () => dialog.close() })}
        deleteDescription={(item) =>
          `Supprimer la localité "${item.nom}" ? Cette action est irréversible.`
        }
      />
    </div>
  );
}
