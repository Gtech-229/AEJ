'use client';

import { Suspense } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
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
import type { User, UserRole } from './users.dto';
import type { UserInput } from './users.schema';
import { userSchema } from './users.schema';
import { getUserFormConfig } from './users.form';
import { getUserDefaults } from './users.defaults';
import { useCreateUser, useDeleteUser, useUpdateUser, useUsers } from './users.hooks';

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrateur',
  gestionnaire: 'Gestionnaire',
  consultant: 'Consultant',
};

const FACETS: FacetedFilter[] = [
  {
    columnId: 'role',
    title: 'Rôle',
    options: [
      { label: 'Administrateur', value: 'admin' },
      { label: 'Gestionnaire', value: 'gestionnaire' },
      { label: 'Consultant', value: 'consultant' },
    ],
  },
  {
    columnId: 'statut',
    title: 'Statut',
    options: [
      { label: 'Actif', value: 'actif' },
      { label: 'Inactif', value: 'inactif' },
    ],
  },
];

export function UsersClient() {
  const { data: users, isLoading } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const dialog = useDialogState<User>();

  const columns: ColumnDef<User>[] = [
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
      accessorKey: 'role',
      meta: { label: 'Rôle' },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Rôle" />,
      cell: ({ row }) => <Badge variant="secondary">{ROLE_LABELS[row.original.role]}</Badge>,
    },
    {
      accessorKey: 'statut',
      meta: { label: 'Statut' },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
      cell: ({ row }) => {
        const actif = row.original.statut === 'actif';
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
  ];

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
        renderForm={({ item, close }) => (
          <DynamicForm<UserInput>
            config={getUserFormConfig()}
            schema={userSchema}
            defaultValues={getUserDefaults(item ?? undefined)}
            isLoading={createUser.isPending || updateUser.isPending}
            onCancel={close}
            submitText={item ? 'Modifier' : 'Ajouter'}
            onSubmit={(data) => {
              if (item) {
                updateUser.mutate({ ...item, ...data }, { onSuccess: close });
              } else {
                createUser.mutate(data, { onSuccess: close });
              }
            }}
          />
        )}
        isDeleting={deleteUser.isPending}
        onDelete={(item) => deleteUser.mutate(item.id, { onSuccess: () => dialog.close() })}
        deleteDescription={(item) =>
          `Supprimer ${item.prenom} ${item.nom} ? Cette action est irréversible.`
        }
      />
    </div>
  );
}
