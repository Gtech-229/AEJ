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
import type { MicroProjet, StatutMicroProjet } from './micro-projets.dto';
import type { MicroProjetInput } from './micro-projets.schema';
import { microProjetSchema } from './micro-projets.schema';
import { getMicroProjetFormConfig } from './micro-projets.form';
import { getMicroProjetDefaults } from './micro-projets.defaults';
import { getMicroProjetsKpis } from './micro-projets.kpis';
import {
  useCreateMicroProjet,
  useDeleteMicroProjet,
  useMicroProjets,
  useUpdateMicroProjet,
} from './micro-projets.hooks';

const STATUT_CONFIG: Record<
  StatutMicroProjet,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  instruction: { label: 'En instruction', variant: 'outline' },
  finance: { label: 'Financé', variant: 'default' },
  rejete: { label: 'Rejeté', variant: 'destructive' },
  cloture: { label: 'Clôturé', variant: 'secondary' },
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

export function MicroProjetsClient() {
  const { data: microProjets, isLoading } = useMicroProjets();
  const createMicroProjet = useCreateMicroProjet();
  const updateMicroProjet = useUpdateMicroProjet();
  const deleteMicroProjet = useDeleteMicroProjet();
  const dialog = useDialogState<MicroProjet>();

  const kpis = useMemo(() => getMicroProjetsKpis(microProjets ?? []), [microProjets]);

  const columns: ColumnDef<MicroProjet>[] = useMemo(
    () => [
      {
        accessorKey: 'nom',
        meta: { label: 'Intitulé' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Intitulé" />,
        cell: ({ row }) => <span className="font-medium">{row.original.nom}</span>,
      },
      {
        accessorKey: 'promoteur',
        meta: { label: 'Promoteur' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Promoteur" />,
        cell: ({ row }) => row.original.promoteur,
      },
      {
        accessorKey: 'secteur',
        meta: { label: 'Secteur' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Secteur" />,
        cell: ({ row }) =>
          row.original.secteur ? (
            <Badge variant="secondary">{row.original.secteur}</Badge>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        accessorKey: 'montant',
        meta: { label: 'Montant' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Montant" />,
        cell: ({ row }) => currency.format(row.original.montant),
      },
      {
        accessorKey: 'dateDepot',
        meta: { label: 'Date de dépôt' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Date de dépôt" />,
        cell: ({ row }) => new Date(row.original.dateDepot).toLocaleDateString('fr-FR'),
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
      buildEditDeleteActionsColumn<MicroProjet>({
        onEdit: dialog.openEdit,
        onDelete: dialog.openDelete,
      }),
    ],
    [dialog.openEdit, dialog.openDelete],
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Micro projets</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Gérez les dossiers de micro-projets financés par le programme.
        </p>
      </div>

      <ListKpis items={kpis} />

      <Suspense fallback={<div className="text-sm text-muted-foreground">Chargement…</div>}>
        <GenericTable<MicroProjet>
          data={microProjets ?? []}
          columns={columns}
          searchKey="nom"
          searchPlaceholder="Rechercher un projet…"
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

      <GenericDialogs<MicroProjet>
        state={dialog}
        dialogSize="lg"
        titles={{
          create: 'Ajouter un micro-projet',
          edit: 'Modifier le micro-projet',
          delete: 'Supprimer le micro-projet',
        }}
        renderForm={({ item, close }) => (
          <DynamicForm<MicroProjetInput>
            config={getMicroProjetFormConfig()}
            schema={microProjetSchema}
            defaultValues={getMicroProjetDefaults(item ?? undefined)}
            isLoading={createMicroProjet.isPending || updateMicroProjet.isPending}
            onCancel={close}
            submitText={item ? 'Modifier' : 'Ajouter'}
            onSubmit={(data) => {
              if (item) {
                updateMicroProjet.mutate({ ...item, ...data }, { onSuccess: close });
              } else {
                createMicroProjet.mutate(data, { onSuccess: close });
              }
            }}
          />
        )}
        isDeleting={deleteMicroProjet.isPending}
        onDelete={(item) => deleteMicroProjet.mutate(item.id, { onSuccess: () => dialog.close() })}
        deleteDescription={(item) =>
          `Supprimer le micro-projet "${item.nom}" ? Cette action est irréversible.`
        }
      />
    </div>
  );
}