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
import type { Suivi, StatutSuivis } from './suivis.dto';
import type { SuiviInput } from './suivis.schema';
import { suiviSchema } from './suivis.schema';
import { getSuiviFormConfig } from './suivis.form';
import { getSuiviDefaults } from './suivis.defaults';
import { getSuivisKpis } from './suivis.kpis';
import {
  useCreateSuivi,
  useDeleteSuivi,
  useSuivis,
  useUpdateSuivi,
} from './suivis.hooks';

const STATUT_CONFIG: Record<
  StatutSuivis,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  realisee: { label: 'Réalisée', variant: 'default' },
  planifiee: { label: 'Planifiée', variant: 'outline' },
  retard: { label: 'En retard', variant: 'destructive' },
};

const FACETS: FacetedFilter[] = [
  {
    columnId: 'statut',
    title: 'Statut',
    options: Object.entries(STATUT_CONFIG).map(([value, { label }]) => ({ label, value })),
  },
];

export function SuivisClient() {
  const { data: suivis, isLoading } = useSuivis();
  const createSuivi = useCreateSuivi();
  const updateSuivi = useUpdateSuivi();
  const deleteSuivi = useDeleteSuivi();
  const dialog = useDialogState<Suivi>();

  const kpis = useMemo(() => getSuivisKpis(suivis ?? []), [suivis]);

  const columns: ColumnDef<Suivi>[] = useMemo(
    () => [
      {
        accessorKey: 'projet',
        meta: { label: 'Projet' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Projet" />,
        cell: ({ row }) => <span className="font-medium">{row.original.projet}</span>,
      },
      {
        accessorKey: 'agent',
        meta: { label: 'Agent' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Agent" />,
        cell: ({ row }) => row.original.agent ?? '—',
      },
      {
        accessorKey: 'dateVisite',
        meta: { label: 'Date de visite' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Date de visite" />,
        cell: ({ row }) => new Date(row.original.dateVisite).toLocaleDateString('fr-FR'),
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
        accessorKey: 'statut',
        meta: { label: 'Statut' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
        cell: ({ row }) => {
          const config = STATUT_CONFIG[row.original.statut];
          return <Badge variant={config.variant}>{config.label}</Badge>;
        },
      },
      buildEditDeleteActionsColumn<Suivi>({
        onEdit: dialog.openEdit,
        onDelete: dialog.openDelete,
      }),
    ],
    [dialog.openEdit, dialog.openDelete],
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Suivis</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Journal de suivi terrain et comptes-rendus de visite.
        </p>
      </div>

      <ListKpis items={kpis} />

      <Suspense fallback={<div className="text-sm text-muted-foreground">Chargement…</div>}>
        <GenericTable<Suivi>
          data={suivis ?? []}
          columns={columns}
          searchKey="projet"
          searchPlaceholder="Rechercher une visite…"
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

      <GenericDialogs<Suivi>
        state={dialog}
        dialogSize="lg"
        titles={{
          create: 'Ajouter',
          edit: 'Modifier',
          delete: 'Supprimer',
        }}
        renderForm={({ item, close }) => (
          <DynamicForm<SuiviInput>
            config={getSuiviFormConfig()}
            schema={suiviSchema}
            defaultValues={getSuiviDefaults(item ?? undefined)}
            isLoading={createSuivi.isPending || updateSuivi.isPending}
            onCancel={close}
            submitText={item ? 'Modifier' : 'Ajouter'}
            onSubmit={(data) => {
              if (item) {
                updateSuivi.mutate({ ...item, ...data }, { onSuccess: close });
              } else {
                createSuivi.mutate(data, { onSuccess: close });
              }
            }}
          />
        )}
        isDeleting={deleteSuivi.isPending}
        onDelete={(item) => deleteSuivi.mutate(item.id, { onSuccess: () => dialog.close() })}
        deleteDescription={(item) =>
          `Supprimer "${item.projet}" ? Cette action est irréversible.`
        }
      />
    </div>
  );
}
