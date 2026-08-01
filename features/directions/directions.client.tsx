'use client';

import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Building2, Network, Plus } from 'lucide-react';
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
import type { Direction } from './directions.dto';
import { directionSchema, type DirectionInput } from './directions.schema';
import { getDirectionFormConfig } from './directions.form';
import { getDirectionDefaults } from './directions.defaults';
import {
  useCreateDirection,
  useDeleteDirection,
  useDirections,
  useUpdateDirection,
} from './directions.hooks';

/**
 * Self-contained "Gérer les directions" button: opens a side Sheet hosting a
 * compact directions CRUD. Directions are a small reference table, so search
 * and pagination are off to keep the drawer tidy.
 */
export function ManageDirectionsButton() {
  const [open, setOpen] = useState(false);
  const { data: directions, isLoading } = useDirections();
  const createDirection = useCreateDirection();
  const updateDirection = useUpdateDirection();
  const deleteDirection = useDeleteDirection();
  const dialog = useDialogState<Direction>();

  const columns: ColumnDef<Direction>[] = [
    {
      accessorKey: 'nom',
      header: 'Nom',
      cell: ({ row }) => <span className="font-medium">{row.original.nom}</span>,
    },
    {
      accessorKey: 'code',
      header: 'Code',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">{row.original.code ?? '—'}</span>
      ),
    },
    buildEditDeleteActionsColumn<Direction>({
      onEdit: dialog.openEdit,
      onDelete: dialog.openDelete,
    }),
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Network className="size-4" />
          Gérer les directions
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Building2 className="size-4 text-muted-foreground" />
            Directions
          </SheetTitle>
          <SheetDescription>
            Les directions regroupent les services de l&apos;agence.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <GenericTable<Direction>
            data={directions ?? []}
            columns={columns}
            isLoading={isLoading}
            showSearch={false}
            showViewOptions={false}
            showPagination={false}
            emptyIcon={Building2}
            emptyTitle="Aucune direction"
            emptyDescription="Créez une première direction pour y rattacher des services."
            toolbarEndSlot={
              <Button size="sm" onClick={dialog.openCreate}>
                <Plus className="size-4" />
                Ajouter
              </Button>
            }
          />
        </div>

        <GenericDialogs<Direction>
          state={dialog}
          dialogSize="lg"
          titles={{
            create: 'Ajouter une direction',
            edit: 'Modifier la direction',
            delete: 'Supprimer la direction',
          }}
          renderForm={({ item, close }) => (
            <DynamicForm<DirectionInput>
              config={getDirectionFormConfig()}
              schema={directionSchema}
              defaultValues={getDirectionDefaults(item ?? undefined)}
              isLoading={createDirection.isPending || updateDirection.isPending}
              onCancel={close}
              submitText={item ? 'Modifier' : 'Ajouter'}
              onSubmit={(data) => {
                if (item) {
                  updateDirection.mutate({ ...item, ...data }, { onSuccess: close });
                } else {
                  createDirection.mutate(data, { onSuccess: close });
                }
              }}
            />
          )}
          isDeleting={deleteDirection.isPending}
          onDelete={(item) => deleteDirection.mutate(item.id, { onSuccess: () => dialog.close() })}
          deleteDescription={(item) =>
            `Supprimer la direction "${item.nom}" ? Les services rattachés ne seront plus reliés à une direction.`
          }
        />
      </SheetContent>
    </Sheet>
  );
}
