'use client';

import { Suspense } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/data-table';
import {
  GenericTable,
  GenericDialogs,
  useDialogState,
  buildEditDeleteActionsColumn,
} from '@/components/generic';
import { DynamicForm } from '@/components/forms';
import type { Fonction } from './fonctions.dto';
import type { FonctionInput } from './fonctions.schema';
import { fonctionSchema } from './fonctions.schema';
import { getFonctionFormConfig } from './fonctions.form';
import { getFonctionDefaults } from './fonctions.defaults';
import {
  useCreateFonction,
  useDeleteFonction,
  useFonctions,
  useUpdateFonction,
} from './fonctions.hooks';

export function FonctionsClient() {
  const { data: fonctions, isLoading } = useFonctions();
  const createFonction = useCreateFonction();
  const updateFonction = useUpdateFonction();
  const deleteFonction = useDeleteFonction();
  const dialog = useDialogState<Fonction>();

  const columns: ColumnDef<Fonction>[] = [
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
      accessorKey: 'service_id',
      meta: { label: 'Service' },
      header: 'Service',
      // TODO: afficher le nom du service (relation) une fois le module
      // Services livré — pour l'instant, juste l'ID brut.
      cell: ({ row }) => (
        <span className="text-muted-foreground">#{row.original.service_id}</span>
      ),
    },
    buildEditDeleteActionsColumn<Fonction>({
      onEdit: dialog.openEdit,
      onDelete: dialog.openDelete,
    }),
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Fonctions</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Gérez les fonctions rattachées aux services de la plateforme.
        </p>
      </div>

      <Suspense fallback={<div className="text-sm text-muted-foreground">Chargement…</div>}>
        <GenericTable<Fonction>
          data={fonctions ?? []}
          columns={columns}
          searchKey="nom"
          searchPlaceholder="Rechercher une fonction…"
          isLoading={isLoading}
          toolbarEndSlot={
            <Button size="sm" onClick={dialog.openCreate}>
              <Plus className="size-4" />
              Ajouter
            </Button>
          }
        />
      </Suspense>

      <GenericDialogs<Fonction>
        state={dialog}
        dialogSize="lg"
        titles={{
          create: 'Ajouter une fonction',
          edit: 'Modifier la fonction',
          delete: 'Supprimer la fonction',
        }}
        renderForm={({ item, close }) => (
          <DynamicForm<FonctionInput>
            config={getFonctionFormConfig()}
            schema={fonctionSchema}
            defaultValues={getFonctionDefaults(item ?? undefined)}
            isLoading={createFonction.isPending || updateFonction.isPending}
            onCancel={close}
            submitText={item ? 'Modifier' : 'Ajouter'}
            onSubmit={(data) => {
              if (item) {
                updateFonction.mutate({ ...item, ...data }, { onSuccess: close });
              } else {
                createFonction.mutate(data, { onSuccess: close });
              }
            }}
          />
        )}
        isDeleting={deleteFonction.isPending}
        onDelete={(item) => deleteFonction.mutate(item.id, { onSuccess: () => dialog.close() })}
        deleteDescription={(item) =>
          `Supprimer la fonction "${item.nom}" ? Cette action est irréversible.`
        }
      />
    </div>
  );
}
