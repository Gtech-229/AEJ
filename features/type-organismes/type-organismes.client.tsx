'use client';

import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Layers, Plus, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  GenericTable,
  GenericDialogs,
  useDialogState,
  buildEditDeleteActionsColumn,
} from '@/components/generic';
import { DynamicForm } from '@/components/forms';
import type { TypeOrganisme } from './type-organismes.dto';
import { typeOrganismeSchema, type TypeOrganismeInput } from './type-organismes.schema';
import { getTypeOrganismeFormConfig } from './type-organismes.form';
import { getTypeOrganismeDefaults } from './type-organismes.defaults';
import {
  useCreateTypeOrganisme,
  useDeleteTypeOrganisme,
  useTypeOrganismes,
  useUpdateTypeOrganisme,
} from './type-organismes.hooks';

/**
 * "Gérer les types" button: opens a side Sheet hosting a compact
 * type-organismes CRUD (the referential behind the organisme `type` select).
 */
export function ManageTypeOrganismesButton() {
  const [open, setOpen] = useState(false);
  const { data: types, isLoading } = useTypeOrganismes();
  const createType = useCreateTypeOrganisme();
  const updateType = useUpdateTypeOrganisme();
  const deleteType = useDeleteTypeOrganisme();
  const dialog = useDialogState<TypeOrganisme>();

  const columns: ColumnDef<TypeOrganisme>[] = [
    {
      accessorKey: 'libelle',
      header: 'Libellé',
      cell: ({ row }) => <span className="font-medium">{row.original.libelle}</span>,
    },
    {
      accessorKey: 'code',
      header: 'Code',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">{row.original.code}</span>
      ),
    },
    buildEditDeleteActionsColumn<TypeOrganisme>({
      onEdit: dialog.openEdit,
      onDelete: dialog.openDelete,
    }),
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Layers className="size-4" />
          Gérer les types
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Tag className="size-4 text-muted-foreground" />
            Types d&apos;organisme
          </SheetTitle>
          <SheetDescription>
            Catégories des organismes financeurs (banque, fonds, coopération…).
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <GenericTable<TypeOrganisme>
            data={types ?? []}
            columns={columns}
            isLoading={isLoading}
            showSearch={false}
            showPagination={false}
            emptyIcon={Tag}
            emptyTitle="Aucun type"
            emptyDescription="Créez un premier type d'organisme."
            toolbarEndSlot={
              <Button size="sm" onClick={dialog.openCreate}>
                <Plus className="size-4" />
                Ajouter
              </Button>
            }
          />
        </div>

        <GenericDialogs<TypeOrganisme>
          state={dialog}
          titles={{
            create: "Ajouter un type d'organisme",
            edit: 'Modifier le type',
            delete: 'Supprimer le type',
          }}
          renderForm={({ item, close }) => (
            <DynamicForm<TypeOrganismeInput>
              config={getTypeOrganismeFormConfig()}
              schema={typeOrganismeSchema}
              defaultValues={getTypeOrganismeDefaults(item ?? undefined)}
              isLoading={createType.isPending || updateType.isPending}
              onCancel={close}
              submitText={item ? 'Modifier' : 'Ajouter'}
              onSubmit={(data) => {
                if (item) {
                  updateType.mutate({ ...item, ...data }, { onSuccess: close });
                } else {
                  createType.mutate(data, { onSuccess: close });
                }
              }}
            />
          )}
          isDeleting={deleteType.isPending}
          onDelete={(item) => deleteType.mutate(item.id, { onSuccess: () => dialog.close() })}
          deleteDescription={(item) =>
            `Supprimer le type "${item.libelle}" ? Les organismes rattachés ne seront plus catégorisés.`
          }
        />
      </SheetContent>
    </Sheet>
  );
}
