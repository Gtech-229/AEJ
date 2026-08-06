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
import type { Operation, StatutFinances } from './finances.dto';
import type { OperationInput } from './finances.schema';
import { operationSchema } from './finances.schema';
import { getOperationFormConfig } from './finances.form';
import { getOperationDefaults } from './finances.defaults';
import { getFinancesKpis } from './finances.kpis';
import {
  useCreateOperation,
  useDeleteOperation,
  useFinances,
  useUpdateOperation,
} from './finances.hooks';

const STATUT_CONFIG: Record<
  StatutFinances,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  effectue: { label: 'Effectué', variant: 'default' },
  attente: { label: 'En attente', variant: 'outline' },
  rejete: { label: 'Rejeté', variant: 'destructive' },
};

const currency = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'XOF',
  maximumFractionDigits: 0,
});

const FACETS: FacetedFilter[] = [
  {
    columnId: 'statut',
    title: 'Statut',
    options: Object.entries(STATUT_CONFIG).map(([value, { label }]) => ({ label, value })),
  },
];

export function FinancesClient() {
  const { data: operations, isLoading } = useFinances();
  const createOperation = useCreateOperation();
  const updateOperation = useUpdateOperation();
  const deleteOperation = useDeleteOperation();
  const dialog = useDialogState<Operation>();

  const kpis = useMemo(() => getFinancesKpis(operations ?? []), [operations]);

  const columns: ColumnDef<Operation>[] = useMemo(
    () => [
      {
        accessorKey: 'beneficiaire',
        meta: { label: 'Bénéficiaire' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Bénéficiaire" />,
        cell: ({ row }) => <span className="font-medium">{row.original.beneficiaire}</span>,
      },
      {
        accessorKey: 'montant',
        meta: { label: 'Montant (FCFA)' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Montant (FCFA)" />,
        cell: ({ row }) => currency.format(row.original.montant),
      },
      {
        accessorKey: 'typeOperation',
        meta: { label: 'Opération' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Opération" />,
        cell: ({ row }) =>
          row.original.typeOperation ? (
            <Badge variant="secondary">{row.original.typeOperation}</Badge>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        accessorKey: 'date',
        meta: { label: 'Date' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
        cell: ({ row }) => new Date(row.original.date).toLocaleDateString('fr-FR'),
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
      buildEditDeleteActionsColumn<Operation>({
        onEdit: dialog.openEdit,
        onDelete: dialog.openDelete,
      }),
    ],
    [dialog.openEdit, dialog.openDelete],
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Finances</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Décaissements, remboursements et état des paiements.
        </p>
      </div>

      <ListKpis items={kpis} />

      <Suspense fallback={<div className="text-sm text-muted-foreground">Chargement…</div>}>
        <GenericTable<Operation>
          data={operations ?? []}
          columns={columns}
          searchKey="beneficiaire"
          searchPlaceholder="Rechercher une opération…"
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

      <GenericDialogs<Operation>
        state={dialog}
        dialogSize="lg"
        titles={{
          create: 'Ajouter',
          edit: 'Modifier',
          delete: 'Supprimer',
        }}
        renderForm={({ item, close }) => (
          <DynamicForm<OperationInput>
            config={getOperationFormConfig()}
            schema={operationSchema}
            defaultValues={getOperationDefaults(item ?? undefined)}
            isLoading={createOperation.isPending || updateOperation.isPending}
            onCancel={close}
            submitText={item ? 'Modifier' : 'Ajouter'}
            onSubmit={(data) => {
              if (item) {
                updateOperation.mutate({ ...item, ...data }, { onSuccess: close });
              } else {
                createOperation.mutate(data, { onSuccess: close });
              }
            }}
          />
        )}
        isDeleting={deleteOperation.isPending}
        onDelete={(item) => deleteOperation.mutate(item.id, { onSuccess: () => dialog.close() })}
        deleteDescription={(item) =>
          `Supprimer "${item.beneficiaire}" ? Cette action est irréversible.`
        }
      />
    </div>
  );
}
