'use client';

import { Suspense, useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
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
import { DynamicForm } from '@/components/forms';
import type { User } from './users.dto';
import { createUserSchema, updateUserSchema } from './users.schema';
import { getUserFormConfig } from './users.form';
import { getCreateUserDefaults, getUpdateUserDefaults } from './users.defaults';
import { useCreateUser, useDeleteUser, useUpdateUser, useUsers } from './users.hooks';

const FACETS: FacetedFilter[] = [
  {
    columnId: 'is_active',
    title: 'Statut',
    // Values must match the column's accessor output ("1"/"0" — the API returns
    // 0/1, not booleans), otherwise the filter silently matches nothing.
    options: [
      { label: 'Actif', value: '1' },
      { label: 'Inactif', value: '0' },
    ],
  },
];

export function UsersClient() {
  const { data: users, isLoading } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const dialog = useDialogState<User>();

  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        id: 'nom',
        accessorFn: (u) => `${u.prenom} ${u.nom}`,
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
        // TODO: afficher le libellé du rôle (relation) une fois le module
        // Rôles livré — pour l'instant, juste l'ID brut.
        cell: ({ row }) => <Badge variant="secondary">#{row.original.role_id}</Badge>,
      },
      {
        accessorKey: 'fonction_id',
        meta: { label: 'Fonction' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Fonction" />,
        // TODO: afficher le nom de la fonction une fois son API atteignable
        // (features/fonctions, AEJ-5) — pour l'instant, juste l'ID brut.
        cell: ({ row }) => <Badge variant="secondary">#{row.original.fonction_id}</Badge>,
      },
      {
        id: 'is_active',
        // Normalize to "1"/"0" so it works whether the value is 1/0 or true/false.
        accessorFn: (u) => String(Number(u.is_active ?? 0)),
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
      buildEditDeleteActionsColumn<User>({
        onEdit: dialog.openEdit,
        onDelete: dialog.openDelete,
      }),
    ],
    [dialog.openEdit, dialog.openDelete],
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Utilisateurs</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Gérez les comptes et les rôles des utilisateurs de la plateforme.
        </p>
      </div>

      <Suspense fallback={<div className="text-sm text-muted-foreground">Chargement…</div>}>
        <GenericTable<User>
          data={users ?? []}
          columns={columns}
          searchKey="nom"
          searchPlaceholder="Rechercher un utilisateur…"
          facetedFilters={FACETS}
          isLoading={isLoading}
          emptyIcon={Users}
          emptyTitle="Aucun utilisateur"
          emptyDescription="Ajoutez un premier utilisateur pour lui donner accès à la plateforme."
          toolbarEndSlot={
            <Button size="sm" onClick={dialog.openCreate}>
              <Plus className="size-4" />
              Ajouter
            </Button>
          }
        />
      </Suspense>

      <GenericDialogs<User>
        state={dialog}
        dialogSize="lg"
        titles={{
          create: 'Ajouter un utilisateur',
          edit: "Modifier l'utilisateur",
          delete: "Supprimer l'utilisateur",
        }}
        renderForm={({ item, close }) =>
          item ? (
            <DynamicForm
              config={getUserFormConfig('edit')}
              schema={updateUserSchema}
              defaultValues={getUpdateUserDefaults(item)}
              isLoading={updateUser.isPending}
              onCancel={close}
              submitText="Modifier"
              onSubmit={(data) => {
                updateUser.mutate({ ...data, id: item.id }, { onSuccess: close });
              }}
            />
          ) : (
            <DynamicForm
              config={getUserFormConfig('create')}
              schema={createUserSchema}
              defaultValues={getCreateUserDefaults()}
              isLoading={createUser.isPending}
              onCancel={close}
              submitText="Ajouter"
              onSubmit={(data) => {
                createUser.mutate(data, { onSuccess: close });
              }}
            />
          )
        }
        isDeleting={deleteUser.isPending}
        onDelete={(item) => deleteUser.mutate(item.id, { onSuccess: () => dialog.close() })}
        deleteDescription={(item) =>
          `Supprimer ${item.prenom} ${item.nom} ? Cette action est irréversible.`
        }
      />
    </div>
  );
}
