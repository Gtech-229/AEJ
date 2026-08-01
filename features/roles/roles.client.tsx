'use client';

import { Suspense } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { ShieldCheck, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/data-table';
import {
  GenericTable,
  GenericDialogs,
  useDialogState,
  buildEditDeleteActionsColumn,
} from '@/components/generic';
import { DynamicForm } from '@/components/forms';
import { Can } from '@/features/permissions/permissions.access';
import type { Role } from './roles.dto';
import { roleSchema, type RoleInput } from './roles.schema';
import { getRoleFormConfig } from './roles.form';
import { getRoleDefaults } from './roles.defaults';
import { useCreateRole, useDeleteRole, useRoles, useUpdateRole } from './roles.hooks';
import { RolePermissionsButton } from './role-permissions-sheet';

export function RolesClient() {
  const { data: roles, isLoading } = useRoles();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();
  const dialog = useDialogState<Role>();

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: 'libelle',
      meta: { label: 'Libellé' },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Libellé" />,
      cell: ({ row }) => <span className="font-medium">{row.original.libelle}</span>,
    },
    {
      accessorKey: 'code',
      meta: { label: 'Code' },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">{row.original.code}</span>
      ),
    },
    {
      accessorKey: 'description',
      meta: { label: 'Description' },
      header: 'Description',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.description ?? '—'}</span>
      ),
    },
    {
      id: 'permissions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end">
          <RolePermissionsButton role={row.original} />
        </div>
      ),
    },
    buildEditDeleteActionsColumn<Role>({
      onEdit: dialog.openEdit,
      onDelete: dialog.openDelete,
    }),
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Rôles &amp; permissions</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Gérez les profils du backoffice et leurs droits d&apos;accès par module.
        </p>
      </div>

      <Suspense fallback={<div className="text-sm text-muted-foreground">Chargement…</div>}>
        <GenericTable<Role>
          data={roles ?? []}
          columns={columns}
          searchKey="libelle"
          searchPlaceholder="Rechercher un rôle…"
          isLoading={isLoading}
          emptyIcon={ShieldCheck}
          emptyTitle="Aucun rôle"
          emptyDescription="Créez un premier rôle pour organiser les accès du backoffice."
          toolbarEndSlot={
            <Can module="roles" action="write">
              <Button size="sm" onClick={dialog.openCreate}>
                <Plus className="size-4" />
                Ajouter
              </Button>
            </Can>
          }
        />
      </Suspense>

      <GenericDialogs<Role>
        state={dialog}
        dialogSize="lg"
        titles={{
          create: 'Ajouter un rôle',
          edit: 'Modifier le rôle',
          delete: 'Supprimer le rôle',
        }}
        renderForm={({ item, close }) => (
          <DynamicForm<RoleInput>
            config={getRoleFormConfig()}
            schema={roleSchema}
            defaultValues={getRoleDefaults(item ?? undefined)}
            isLoading={createRole.isPending || updateRole.isPending}
            onCancel={close}
            submitText={item ? 'Modifier' : 'Ajouter'}
            onSubmit={(data) => {
              if (item) {
                updateRole.mutate({ ...data, id: item.id }, { onSuccess: close });
              } else {
                createRole.mutate(data, { onSuccess: close });
              }
            }}
          />
        )}
        isDeleting={deleteRole.isPending}
        onDelete={(item) => deleteRole.mutate(item.id, { onSuccess: () => dialog.close() })}
        deleteDescription={(item) =>
          `Supprimer le rôle "${item.libelle}" ? Les personnels rattachés perdront ce profil.`
        }
      />
    </div>
  );
}
