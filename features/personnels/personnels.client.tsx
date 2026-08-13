'use client';

import { Suspense, useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus, Users } from 'lucide-react';
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
import { LoadingState } from '@/components/generic/loader';
import { DynamicForm } from '@/components/forms';
import { useRoles } from '@/features/roles/roles.hooks';
import { useFonctions } from '@/features/fonctions/fonctions.hooks';
import type { Personnel } from './personnels.dto';
import { createPersonnelSchema, updatePersonnelSchema } from './personnels.schema';
import { getPersonnelFormConfig } from './personnels.form';
import { getCreatePersonnelDefaults, getUpdatePersonnelDefaults } from './personnels.defaults';
import {
  useCreatePersonnel,
  useDeletePersonnel,
  usePersonnels,
  useUpdatePersonnel,
} from './personnels.hooks';

export function PersonnelsClient() {
  const { data: personnels, isLoading } = usePersonnels();
  const { data: roles } = useRoles();
  const { data: fonctions } = useFonctions();
  const createPersonnel = useCreatePersonnel();
  const updatePersonnel = useUpdatePersonnel();
  const deletePersonnel = useDeletePersonnel();
  const dialog = useDialogState<Personnel>();

  // Referentials backing the role/fonction selects and the table labels.
  const formRefs = useMemo(
    () => ({ roles: roles ?? [], fonctions: fonctions ?? [] }),
    [roles, fonctions],
  );



  const columns: ColumnDef<Personnel>[] = useMemo(
    () => [
      {
        id: 'nom',
        accessorFn: (p) => `${p.prenom} ${p.nom}`,
        meta: { label: 'Nom complet' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nom complet" />,
        cell: ({ row }) => (
          <span className="font-medium">
            {row.original.prenom} {row.original.nom}
          </span>
        ),
      },
      {
        accessorKey: 'email',
        meta: { label: 'Email' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span>,
      },
      {
        accessorKey: 'telephone',
        meta: { label: 'Téléphone' },
        header: 'Téléphone',
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.telephone}</span>,
      },
      {
        accessorKey: 'role_id',
        meta: { label: 'Rôle' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Rôle" />,
        cell: ({ row }) => {
          const role = roles?.find((r) => r.id === row.original.role_id);
          return <Badge variant="secondary">{role?.code ?? `#${row.original.role_id}`}</Badge>;
        },
      },
      {
        accessorKey: 'fonction_id',
        meta: { label: 'Fonction' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Fonction" />,
        cell: ({ row }) => {
          const fonction = fonctions?.find((f) => f.id === row.original.fonction_id);
          return (
            <Badge variant="secondary">{fonction?.nom ?? `#${row.original.fonction_id}`}</Badge>
          );
        },
      },
      {
        id: 'is_active',
        // Normalize to "1"/"0" so it works whether the value is 1/0 or true/false.
        accessorFn: (p) => String(Number(p.is_active ?? 0)),
        meta: { label: 'Statut' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
        cell: ({ row }) => {
          const actif = !!row.original.is_active;
          return (
            <Badge
              variant="outline"
              className={cn(
                'gap-1.5',
                actif ? 'border-success/30 bg-success/10 text-success' : 'text-muted-foreground',
              )}
            >
              <span
                className={cn('size-1.5 rounded-full', actif ? 'bg-success' : 'bg-muted-foreground')}
              />
              {actif ? 'Actif' : 'Inactif'}
            </Badge>
          );
        },
      },
      buildEditDeleteActionsColumn<Personnel>({
        onEdit: dialog.openEdit,
        onDelete: dialog.openDelete,
      }),
    ],
    [dialog.openEdit, dialog.openDelete, roles, fonctions],
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Personnel</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Gérez les comptes, rôles et fonctions du personnel de la plateforme.
        </p>
      </div>

      <Suspense fallback={<LoadingState />}>
        <GenericTable<Personnel>
          data={personnels ?? []}
          columns={columns}
          searchKey="nom"
          searchPlaceholder="Rechercher un membre…"
          isLoading={isLoading}
          emptyIcon={Users}
          emptyTitle="Aucun membre"
          emptyDescription="Ajoutez un premier membre du personnel pour lui donner accès à la plateforme."
          toolbarEndSlot={
            <Button size="sm" onClick={dialog.openCreate}>
              <Plus className="size-4" />
              Nouveau personnel
            </Button>
          }
        />
      </Suspense>

      <GenericDialogs<Personnel>
        state={dialog}
        dialogSize="lg"
        titles={{
          create: 'Ajouter un membre',
          edit: 'Modifier le membre',
          delete: 'Supprimer le membre',
        }}
        renderForm={({ item, close }) =>
          item ? (
            <DynamicForm
              config={getPersonnelFormConfig('edit', formRefs)}
              schema={updatePersonnelSchema}
              defaultValues={getUpdatePersonnelDefaults(item)}
              isLoading={updatePersonnel.isPending}
              onCancel={close}
              submitText="Modifier"
              onSubmit={(data) => {
                updatePersonnel.mutate({ ...data, id: item.id }, { onSuccess: close });
              }}
            />
          ) : (
            <DynamicForm
              config={getPersonnelFormConfig('create', formRefs)}
              schema={createPersonnelSchema}
              defaultValues={getCreatePersonnelDefaults()}
              isLoading={createPersonnel.isPending}
              onCancel={close}
              submitText="Ajouter"
              onSubmit={(data) => {
                createPersonnel.mutate(data, { onSuccess: close });
              }}
            />
          )
        }
        isDeleting={deletePersonnel.isPending}
        onDelete={(item) => deletePersonnel.mutate(item.id, { onSuccess: () => dialog.close() })}
        deleteDescription={(item) =>
          `Supprimer ${item.prenom} ${item.nom} ? Cette action est irréversible.`
        }
      />
    </div>
  );
}
