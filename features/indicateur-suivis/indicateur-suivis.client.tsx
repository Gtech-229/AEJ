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
import type { IndicateurSuivi, StatutIndicateurSuivis } from './indicateur-suivis.dto';
import type { IndicateurSuiviInput } from './indicateur-suivis.schema';
import { indicateurSuiviSchema } from './indicateur-suivis.schema';
import { getIndicateurSuiviFormConfig } from './indicateur-suivis.form';
import { getIndicateurSuiviDefaults } from './indicateur-suivis.defaults';
import { getIndicateurSuivisKpis } from './indicateur-suivis.kpis';
import {
  useCreateIndicateurSuivi,
  useDeleteIndicateurSuivi,
  useIndicateurSuivis,
  useUpdateIndicateurSuivi,
} from './indicateur-suivis.hooks';

const STATUT_CONFIG: Record<
  StatutIndicateurSuivis,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  hausse: { label: 'En hausse', variant: 'default' },
  baisse: { label: 'En baisse', variant: 'destructive' },
};

const FACETS: FacetedFilter[] = [
  {
    columnId: 'statut',
    title: 'Statut',
    options: Object.entries(STATUT_CONFIG).map(([value, { label }]) => ({ label, value })),
  },
];

export function IndicateurSuivisClient() {
  const { data: indicateurSuivis, isLoading } = useIndicateurSuivis();
  const createIndicateurSuivi = useCreateIndicateurSuivi();
  const updateIndicateurSuivi = useUpdateIndicateurSuivi();
  const deleteIndicateurSuivi = useDeleteIndicateurSuivi();
  const dialog = useDialogState<IndicateurSuivi>();

  const kpis = useMemo(() => getIndicateurSuivisKpis(indicateurSuivis ?? []), [indicateurSuivis]);

  const columns: ColumnDef<IndicateurSuivi>[] = useMemo(
    () => [
      {
        accessorKey: 'indicateur',
        meta: { label: 'Indicateur' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Indicateur" />,
        cell: ({ row }) => <span className="font-medium">{row.original.indicateur}</span>,
      },
      {
        accessorKey: 'periode',
        meta: { label: 'Période' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Période" />,
        cell: ({ row }) => row.original.periode ?? '—',
      },
      {
        accessorKey: 'valeur',
        meta: { label: 'Valeur' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Valeur" />,
        cell: ({ row }) => row.original.valeur ?? '—',
      },
      {
        accessorKey: 'evolution',
        meta: { label: 'Évolution' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Évolution" />,
        cell: ({ row }) => row.original.evolution ?? '—',
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
      buildEditDeleteActionsColumn<IndicateurSuivi>({
        onEdit: dialog.openEdit,
        onDelete: dialog.openDelete,
      }),
    ],
    [dialog.openEdit, dialog.openDelete],
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Indicateur Suivis</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Suivi périodique des indicateurs : mesures, écarts, tendances.
        </p>
      </div>

      <ListKpis items={kpis} />

      <Suspense fallback={<div className="text-sm text-muted-foreground">Chargement…</div>}>
        <GenericTable<IndicateurSuivi>
          data={indicateurSuivis ?? []}
          columns={columns}
          searchKey="indicateur"
          searchPlaceholder="Rechercher une mesure…"
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

      <GenericDialogs<IndicateurSuivi>
        state={dialog}
        dialogSize="lg"
        titles={{
          create: 'Ajouter',
          edit: 'Modifier',
          delete: 'Supprimer',
        }}
        renderForm={({ item, close }) => (
          <DynamicForm<IndicateurSuiviInput>
            config={getIndicateurSuiviFormConfig()}
            schema={indicateurSuiviSchema}
            defaultValues={getIndicateurSuiviDefaults(item ?? undefined)}
            isLoading={createIndicateurSuivi.isPending || updateIndicateurSuivi.isPending}
            onCancel={close}
            submitText={item ? 'Modifier' : 'Ajouter'}
            onSubmit={(data) => {
              if (item) {
                updateIndicateurSuivi.mutate({ ...item, ...data }, { onSuccess: close });
              } else {
                createIndicateurSuivi.mutate(data, { onSuccess: close });
              }
            }}
          />
        )}
        isDeleting={deleteIndicateurSuivi.isPending}
        onDelete={(item) => deleteIndicateurSuivi.mutate(item.id, { onSuccess: () => dialog.close() })}
        deleteDescription={(item) =>
          `Supprimer "${item.indicateur}" ? Cette action est irréversible.`
        }
      />
    </div>
  );
}
