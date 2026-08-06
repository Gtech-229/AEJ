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
import type { Promoteur, StatutPromoteurs } from './promoteurs.dto';
import type { PromoteurInput } from './promoteurs.schema';
import { promoteurSchema } from './promoteurs.schema';
import { getPromoteurFormConfig } from './promoteurs.form';
import { getPromoteurDefaults } from './promoteurs.defaults';
import { getPromoteursKpis } from './promoteurs.kpis';
import {
  useCreatePromoteur,
  useDeletePromoteur,
  usePromoteurs,
  useUpdatePromoteur,
} from './promoteurs.hooks';

const STATUT_CONFIG: Record<StatutPromoteurs, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  actif: { label: 'Actif', variant: 'default' },
  attente: { label: 'En attente', variant: 'outline' },
  inactif: { label: 'Inactif', variant: 'destructive' },
};

const FACETS: FacetedFilter[] = [
  {
    columnId: 'statut',
    title: 'Statut',
    options: Object.entries(STATUT_CONFIG).map(([value, { label }]) => ({ label, value })),
  },
];

export function PromoteursClient() {
  const { data: promoteurs, isLoading } = usePromoteurs();
  const createPromoteur = useCreatePromoteur();
  const updatePromoteur = useUpdatePromoteur();
  const deletePromoteur = useDeletePromoteur();
  const dialog = useDialogState<Promoteur>();

  const kpis = useMemo(() => getPromoteursKpis(promoteurs ?? []), [promoteurs]);

  const columns: ColumnDef<Promoteur>[] = useMemo(
    () => [
      {
        accessorKey: 'nom',
        meta: { label: 'Nom complet' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nom complet" />,
        cell: ({ row }) => <span className="font-medium">{row.original.nom}</span>,
      },
      {
        accessorKey: 'localite',
        meta: { label: 'Localité' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Localité" />,
        cell: ({ row }) => row.original.localite ?? '—',
      },
      {
        accessorKey: 'telephone',
        meta: { label: 'Téléphone' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Téléphone" />,
        cell: ({ row }) => row.original.telephone ?? '—',
      },
      {
        accessorKey: 'nombreProjets',
        meta: { label: 'Projets' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Projets" />,
        cell: ({ row }) => row.original.nombreProjets ?? '—',
      },
      {
        accessorKey: 'statut',
        meta: { label: 'Statut' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
        cell: ({ row }) => {
  const config =
    STATUT_CONFIG[row.original.statut as StatutPromoteurs] ?? {
      label: "Inconnu",
      variant: "secondary" as const,
    };

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
},
      },
      buildEditDeleteActionsColumn<Promoteur>({
        onEdit: dialog.openEdit,
        onDelete: dialog.openDelete,
      }),
    ],
    [dialog.openEdit, dialog.openDelete],
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Promoteurs</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Fiches des porteurs de projet et suivi de leur dossier.
        </p>
      </div>

      <ListKpis items={kpis} />

      <Suspense fallback={<div className="text-sm text-muted-foreground">Chargement…</div>}>
        <GenericTable<Promoteur>
          data={promoteurs ?? []}
          columns={columns}
          searchKey="nom"
          searchPlaceholder="Rechercher un promoteur…"
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

      <GenericDialogs<Promoteur>
        state={dialog}
        dialogSize="lg"
        titles={{
          create: 'Ajouter',
          edit: 'Modifier',
          delete: 'Supprimer',
        }}
        renderForm={({ item, close }) => (
          <DynamicForm<PromoteurInput>
            config={getPromoteurFormConfig()}
            schema={promoteurSchema}
            defaultValues={getPromoteurDefaults(item ?? undefined)}
            isLoading={createPromoteur.isPending || updatePromoteur.isPending}
            onCancel={close}
            submitText={item ? 'Modifier' : 'Ajouter'}
            onSubmit={(data) => {
              if (item) {
                updatePromoteur.mutate({ ...item, ...data }, { onSuccess: close });
              } else {
                createPromoteur.mutate(data, { onSuccess: close });
              }
            }}
          />
        )}
        isDeleting={deletePromoteur.isPending}
        onDelete={(item) => deletePromoteur.mutate(item.id, { onSuccess: () => dialog.close() })}
        deleteDescription={(item) =>
          `Supprimer "${item.nom}" ? Cette action est irréversible.`
        }
      />
    </div>
  );
}