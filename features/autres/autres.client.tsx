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
import { ListKpis } from '@/components/generic/list-kpis';
import { DynamicForm } from '@/components/forms';
import type { Element, StatutAutres } from './autres.dto';
import type { ElementInput } from './autres.schema';
import { elementSchema } from './autres.schema';
import { getElementFormConfig } from './autres.form';
import { getElementDefaults } from './autres.defaults';
import { getAutresKpis } from './autres.kpis';
import {
  useCreateElement,
  useDeleteElement,
  useAutres,
  useUpdateElement,
} from './autres.hooks';

const STATUT_CONFIG: Record<
  StatutAutres,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  termine: { label: 'Terminé', variant: 'default' },
  encours: { label: 'En cours', variant: 'outline' },
};

const FACETS: FacetedFilter[] = [
  {
    columnId: 'statut',
    title: 'Statut',
    options: Object.entries(STATUT_CONFIG).map(([value, { label }]) => ({ label, value })),
  },
];

export function AutresClient() {
  const { data: elements, isLoading } = useAutres();
  const createElement = useCreateElement();
  const updateElement = useUpdateElement();
  const deleteElement = useDeleteElement();
  const dialog = useDialogState<Element>();

  const kpis = useMemo(() => getAutresKpis(elements ?? []), [elements]);

  const columns: ColumnDef<Element>[] = useMemo(
    () => [
      {
        accessorKey: 'nom',
        meta: { label: 'Élément' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Élément" />,
        cell: ({ row }) => <span className="font-medium">{row.original.nom}</span>,
      },
      {
        accessorKey: 'type',
        meta: { label: 'Type' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
        cell: ({ row }) =>
          row.original.type ? (
            <Badge variant="secondary">{row.original.type}</Badge>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        accessorKey: 'dateModification',
        meta: { label: 'Dernière modification' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Dernière modification" />,
        cell: ({ row }) => new Date(row.original.dateModification).toLocaleDateString('fr-FR'),
      },
      {
        accessorKey: 'responsable',
        meta: { label: 'Par' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Par" />,
        cell: ({ row }) => row.original.responsable ?? '—',
      },
      {
        accessorKey: 'statut',
        meta: { label: 'Statut' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
        cell: ({ row }) => {
          const config = STATUT_CONFIG[row.original.statut];
          return <Badge variant={config.variant}>{config.label}</Badge>;
        },
      },
      buildEditDeleteActionsColumn<Element>({
        onEdit: dialog.openEdit,
        onDelete: dialog.openDelete,
      }),
    ],
    [dialog.openEdit, dialog.openDelete],
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Autres</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Modules complémentaires : paramètres additionnels, imports et exports.
        </p>
      </div>

      <ListKpis items={kpis} />

      <Suspense fallback={<div className="text-sm text-muted-foreground">Chargement…</div>}>
        <GenericTable<Element>
          data={elements ?? []}
          columns={columns}
          searchKey="nom"
          searchPlaceholder="Rechercher…"
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

      <GenericDialogs<Element>
        state={dialog}
        dialogSize="lg"
        titles={{
          create: 'Ajouter',
          edit: 'Modifier',
          delete: 'Supprimer',
        }}
        renderForm={({ item, close }) => (
          <DynamicForm<ElementInput>
            config={getElementFormConfig()}
            schema={elementSchema}
            defaultValues={getElementDefaults(item ?? undefined)}
            isLoading={createElement.isPending || updateElement.isPending}
            onCancel={close}
            submitText={item ? 'Modifier' : 'Ajouter'}
            onSubmit={(data) => {
              if (item) {
                updateElement.mutate({ ...item, ...data }, { onSuccess: close });
              } else {
                createElement.mutate(data, { onSuccess: close });
              }
            }}
          />
        )}
        isDeleting={deleteElement.isPending}
        onDelete={(item) => deleteElement.mutate(item.id, { onSuccess: () => dialog.close() })}
        deleteDescription={(item) =>
          `Supprimer "${item.nom}" ? Cette action est irréversible.`
        }
      />
    </div>
  );
}
