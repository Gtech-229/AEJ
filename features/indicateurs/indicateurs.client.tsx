'use client';

import { Suspense } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Gauge, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/data-table';
import {
  GenericTable,
  GenericDialogs,
  useDialogState,
  buildEditDeleteActionsColumn,
} from '@/components/generic';
import { DynamicForm } from '@/components/forms';
import type { Indicateur } from './indicateurs.dto';
import { indicateurSchema, type IndicateurInput } from './indicateurs.schema';
import { getIndicateurFormConfig } from './indicateurs.form';
import { getIndicateurDefaults } from './indicateurs.defaults';
import {
  useCreateIndicateur,
  useDeleteIndicateur,
  useIndicateurs,
  useUpdateIndicateur,
} from './indicateurs.hooks';
import { RenseignerButton } from './indicateur-suivi-sheet';

const TYPE_LABELS: Record<string, string> = {
  numerique: 'Numérique',
  texte: 'Texte',
  pourcentage: 'Pourcentage',
};

export function IndicateursClient() {
  const { data: indicateurs, isLoading } = useIndicateurs();
  const createIndicateur = useCreateIndicateur();
  const updateIndicateur = useUpdateIndicateur();
  const deleteIndicateur = useDeleteIndicateur();
  const dialog = useDialogState<Indicateur>();

  const columns: ColumnDef<Indicateur>[] = [
    {
      accessorKey: 'nom',
      meta: { label: 'Nom' },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nom" />,
      cell: ({ row }) => <span className="font-medium">{row.original.nom}</span>,
    },
    {
      accessorKey: 'type_valeur',
      meta: { label: 'Type' },
      header: 'Type',
      cell: ({ row }) => {
        const t = row.original.type_valeur;
        return t ? (
          <Badge variant="secondary" className="font-normal">
            {TYPE_LABELS[t] ?? t}
          </Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
    },
    {
      accessorKey: 'unite',
      meta: { label: 'Unité' },
      header: 'Unité',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.unite ?? '—'}</span>
      ),
    },
    {
      id: 'statut',
      accessorFn: (i) => String(Number(i.statut ?? 1)),
      meta: { label: 'Statut' },
      header: 'Statut',
      cell: ({ row }) => {
        const actif = (row.original.statut ?? 1) !== 0;
        return (
          <Badge
            variant="outline"
            className={cn(
              'gap-1.5',
              actif ? 'border-success/30 bg-success/10 text-success' : 'text-muted-foreground',
            )}
          >
            <span className={cn('size-1.5 rounded-full', actif ? 'bg-success' : 'bg-muted-foreground')} />
            {actif ? 'Actif' : 'Inactif'}
          </Badge>
        );
      },
    },
    {
      id: 'renseigner',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end">
          <RenseignerButton indicateur={row.original} />
        </div>
      ),
    },
    buildEditDeleteActionsColumn<Indicateur>({
      onEdit: dialog.openEdit,
      onDelete: dialog.openDelete,
    }),
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Indicateurs</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Créez, configurez et renseignez les indicateurs de suivi-évaluation.
        </p>
      </div>

      <Suspense fallback={<div className="text-sm text-muted-foreground">Chargement…</div>}>
        <GenericTable<Indicateur>
          data={indicateurs ?? []}
          columns={columns}
          searchKey="nom"
          searchPlaceholder="Rechercher un indicateur…"
          isLoading={isLoading}
          emptyIcon={Gauge}
          emptyTitle="Aucun indicateur"
          emptyDescription="Créez un premier indicateur pour mesurer l'impact du programme."
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
          create: 'Ajouter un indicateur',
          edit: "Modifier l'indicateur",
          delete: "Supprimer l'indicateur",
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
                updateIndicateur.mutate({ ...data, id: item.id }, { onSuccess: close });
              } else {
                createIndicateur.mutate(data, { onSuccess: close });
              }
            }}
          />
        )}
        isDeleting={deleteIndicateur.isPending}
        onDelete={(item) => deleteIndicateur.mutate(item.id, { onSuccess: () => dialog.close() })}
        deleteDescription={(item) =>
          `Supprimer l'indicateur "${item.nom}" ? Son historique de valeurs sera perdu.`
        }
      />
    </div>
  );
}
