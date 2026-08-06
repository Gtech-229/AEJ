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
import type { Indicateur, StatutIndicateurs } from './indicateurs.dto';
import type { IndicateurInput } from './indicateurs.schema';
import { indicateurSchema } from './indicateurs.schema';
import { getIndicateurFormConfig } from './indicateurs.form';
import { getIndicateurDefaults } from './indicateurs.defaults';
import { getIndicateursKpis } from './indicateurs.kpis';
import {
  useCreateIndicateur,
  useDeleteIndicateur,
  useIndicateurs,
  useUpdateIndicateur,
} from './indicateurs.hooks';

const STATUT_CONFIG: Record<
  StatutIndicateurs,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  atteinte: { label: 'Atteinte', variant: 'default' },
  dessous: { label: 'En dessous', variant: 'outline' },
};

const FACETS: FacetedFilter[] = [
  {
    columnId: 'statut',
    title: 'Statut',
    options: Object.entries(STATUT_CONFIG).map(([value, { label }]) => ({ label, value })),
  },
];

export function IndicateursClient() {
  const { data: indicateurs, isLoading } = useIndicateurs();
  const createIndicateur = useCreateIndicateur();
  const updateIndicateur = useUpdateIndicateur();
  const deleteIndicateur = useDeleteIndicateur();
  const dialog = useDialogState<Indicateur>();

  const kpis = useMemo(() => getIndicateursKpis(indicateurs ?? []), [indicateurs]);

  const columns: ColumnDef<Indicateur>[] = useMemo(
    () => [
      {
        accessorKey: 'nom',
        meta: { label: 'Indicateur' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Indicateur" />,
        cell: ({ row }) => <span className="font-medium">{row.original.nom}</span>,
      },
      {
        accessorKey: 'cible',
        meta: { label: 'Cible' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Cible" />,
        cell: ({ row }) => row.original.cible ?? '—',
      },
      {
        accessorKey: 'valeurActuelle',
        meta: { label: 'Valeur actuelle' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Valeur actuelle" />,
        cell: ({ row }) => row.original.valeurActuelle ?? '—',
      },
      {
        accessorKey: 'ecart',
        meta: { label: 'Écart' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Écart" />,
        cell: ({ row }) => row.original.ecart ?? '—',
      },
      {
        accessorKey: 'statut',
        meta: { label: 'Statut' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
        cell: ({ row }) => {
  console.log("Ligne :", row.original);

  const config = STATUT_CONFIG[row.original.statut] ?? {
    label: "Inconnu",
    variant: "secondary" as const,
  };

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
}
      },
      buildEditDeleteActionsColumn<Indicateur>({
        onEdit: dialog.openEdit,
        onDelete: dialog.openDelete,
      }),
    ],
    [dialog.openEdit, dialog.openDelete],
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Indicateurs</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Tableau de bord des indicateurs de performance du programme.
        </p>
      </div>

      <ListKpis items={kpis} />

      <Suspense fallback={<div className="text-sm text-muted-foreground">Chargement…</div>}>
        <GenericTable<Indicateur>
          data={indicateurs ?? []}
          columns={columns}
          searchKey="nom"
          searchPlaceholder="Rechercher un indicateur…"
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

      <GenericDialogs<Indicateur>
        state={dialog}
        dialogSize="lg"
        titles={{
          create: 'Ajouter',
          edit: 'Modifier',
          delete: 'Supprimer',
        }}
        renderForm={({ item, close }) => (
          <DynamicForm<IndicateurInput>
            config={getIndicateurFormConfig()}
            schema={indicateurSchema}
            defaultValues={getIndicateurDefaults(item ?? undefined)}
            isLoading={createIndicateur.isPending || updateIndicateur.isPending}
            onCancel={close}
            submitText={item ? 'Modifier' : 'Ajouter'}
            onSubmit={(data) => {
              if (item) {
                updateIndicateur.mutate({ ...item, ...data }, { onSuccess: close });
              } else {
                createIndicateur.mutate(data, { onSuccess: close });
              }
            }}
          />
        )}
        isDeleting={deleteIndicateur.isPending}
        onDelete={(item) => deleteIndicateur.mutate(item.id, { onSuccess: () => dialog.close() })}
        deleteDescription={(item) =>
          `Supprimer "${item.nom}" ? Cette action est irréversible.`
        }
      />
    </div>
  );
}
