'use client';

import { Suspense, useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Handshake, Plus } from 'lucide-react';
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
import { ManageTypeOrganismesButton } from '@/features/type-organismes/type-organismes.client';
import { useTypeOrganismes } from '@/features/type-organismes/type-organismes.hooks';
import type { Organisme } from './organismes.dto';
import { organismeSchema, type OrganismeInput } from './organismes.schema';
import { getOrganismeFormConfig } from './organismes.form';
import { getOrganismeDefaults } from './organismes.defaults';
import {
  useCreateOrganisme,
  useDeleteOrganisme,
  useOrganismes,
  useUpdateOrganisme,
} from './organismes.hooks';

export function OrganismesClient() {
  const { data: organismes, isLoading } = useOrganismes();
  const { data: types } = useTypeOrganismes();
  const createOrganisme = useCreateOrganisme();
  const updateOrganisme = useUpdateOrganisme();
  const deleteOrganisme = useDeleteOrganisme();
  const dialog = useDialogState<Organisme>();

  // Resolve type id → libellé for the table column.
  const typeName = useMemo(() => {
    const map = new Map<number, string>();
    (types ?? []).forEach((t) => map.set(t.id, t.libelle));
    return (id: number) => map.get(id) ?? `#${id}`;
  }, [types]);

  const columns: ColumnDef<Organisme>[] = [
    {
      accessorKey: 'nom',
      meta: { label: 'Nom' },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nom" />,
      cell: ({ row }) => <span className="font-medium">{row.original.nom}</span>,
    },
    {
      accessorKey: 'sigle',
      meta: { label: 'Sigle' },
      header: 'Sigle',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">{row.original.sigle}</span>
      ),
    },
    {
      accessorKey: 'type',
      meta: { label: 'Type' },
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-normal">
          {typeName(row.original.type)}
        </Badge>
      ),
    },
    {
      accessorKey: 'email',
      meta: { label: 'Email' },
      header: 'Email',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.email ?? '—'}</span>
      ),
    },
    {
      accessorKey: 'telephone',
      meta: { label: 'Téléphone' },
      header: 'Téléphone',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.telephone ?? '—'}</span>
      ),
    },
    buildEditDeleteActionsColumn<Organisme>({
      onEdit: dialog.openEdit,
      onDelete: dialog.openDelete,
    }),
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Organismes financeurs</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Répertoire des partenaires financiers (banques, fonds, coopérations, ONG, État).
        </p>
      </div>

      <Suspense fallback={<div className="text-sm text-muted-foreground">Chargement…</div>}>
        <GenericTable<Organisme>
          data={organismes ?? []}
          columns={columns}
          searchKey="nom"
          searchPlaceholder="Rechercher un organisme…"
          isLoading={isLoading}
          emptyIcon={Handshake}
          emptyTitle="Aucun organisme"
          emptyDescription="Ajoutez un premier organisme financeur au répertoire."
          toolbarEndSlot={
            <div className="flex items-center gap-2">
              <ManageTypeOrganismesButton />
              <Button size="sm" onClick={dialog.openCreate}>
                <Plus className="size-4" />
                Ajouter
              </Button>
            </div>
          }
        />
      </Suspense>

      <GenericDialogs<Organisme>
        state={dialog}
        dialogSize="lg"
        titles={{
          create: 'Ajouter un organisme',
          edit: "Modifier l'organisme",
          delete: "Supprimer l'organisme",
        }}
        renderForm={({ item, close }) => (
          <DynamicForm<OrganismeInput>
            config={getOrganismeFormConfig(types ?? [])}
            schema={organismeSchema}
            defaultValues={getOrganismeDefaults(item ?? undefined)}
            isLoading={createOrganisme.isPending || updateOrganisme.isPending}
            onCancel={close}
            submitText={item ? 'Modifier' : 'Ajouter'}
            onSubmit={(data) => {
              if (item) {
                updateOrganisme.mutate({ ...data, id: item.id }, { onSuccess: close });
              } else {
                createOrganisme.mutate(data, { onSuccess: close });
              }
            }}
          />
        )}
        isDeleting={deleteOrganisme.isPending}
        onDelete={(item) => deleteOrganisme.mutate(item.id, { onSuccess: () => dialog.close() })}
        deleteDescription={(item) =>
          `Supprimer l'organisme "${item.nom}" ? Cette action est irréversible.`
        }
      />
    </div>
  );
}
