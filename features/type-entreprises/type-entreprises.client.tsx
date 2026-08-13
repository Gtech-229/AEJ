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
import type { TypeEntreprise } from './type-entreprises.dto';
import { typeEntrepriseSchema, type TypeEntrepriseInput } from './type-entreprises.schema';
import { getTypeEntrepriseFormConfig } from './type-entreprises.form';
import { getTypeEntrepriseDefaults } from './type-entreprises.defaults';
import {
  useCreateTypeEntreprise,
  useDeleteTypeEntreprise,
  useTypeEntreprises,
  useUpdateTypeEntreprise,
} from './type-entreprises.hooks';

/**
 * "Gérer les types" button: opens a side Sheet hosting a compact
 * type-entreprises CRUD (the referential behind the entreprise `type` select).
 */
export function ManageTypeEntreprisesButton() {
  const [open, setOpen] = useState(false);
  const { data: types, isLoading } = useTypeEntreprises();
  const createType = useCreateTypeEntreprise();
  const updateType = useUpdateTypeEntreprise();
  const deleteType = useDeleteTypeEntreprise();
  const dialog = useDialogState<TypeEntreprise>();

  const columns: ColumnDef<TypeEntreprise>[] = [
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
    buildEditDeleteActionsColumn<TypeEntreprise>({
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
            Types d&apos;entreprise
          </SheetTitle>
          <SheetDescription>
            Catégories des entreprises (SARL, SA, entreprise individuelle…).
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <GenericTable<TypeEntreprise>
            data={types ?? []}
            columns={columns}
            isLoading={isLoading}
            showSearch={false}
            showPagination={false}
            emptyIcon={Tag}
            emptyTitle="Aucun type"
            emptyDescription="Créez un premier type d'entreprise."
            toolbarEndSlot={
              <Button size="sm" className="cursor-pointer" onClick={dialog.openCreate}>
                <Plus className="size-4" />
                Nouveau type
              </Button>
            }
          />
        </div>

        <GenericDialogs<TypeEntreprise>
          state={dialog}
          titles={{
            create: "Ajouter un type d'entreprise",
            edit: 'Modifier le type',
            delete: 'Supprimer le type',
          }}
          renderForm={({ item, close }) => (
            <DynamicForm<TypeEntrepriseInput>
              config={getTypeEntrepriseFormConfig()}
              schema={typeEntrepriseSchema}
              defaultValues={getTypeEntrepriseDefaults(item ?? undefined)}
              isLoading={createType.isPending || updateType.isPending}
              onCancel={close}
              submitText={item ? 'Modifier' : 'Ajouter'}
              onSubmit={(data) => {
                if (item) {
                  updateType.mutate({ ...data, id: item.id }, { onSuccess: close });
                } else {
                  createType.mutate(data, { onSuccess: close });
                }
              }}
            />
          )}
          isDeleting={deleteType.isPending}
          onDelete={(item) => deleteType.mutate(item.id, { onSuccess: () => dialog.close() })}
          deleteDescription={(item) =>
            `Supprimer le type "${item.libelle}" ? Les entreprises rattachées ne seront plus catégorisées.`
          }
        />
      </SheetContent>
    </Sheet>
  );
}
