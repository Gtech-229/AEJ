'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface GenericRowActionsProps<T> {
  item: T;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  extraActions?: (item: T) => React.ReactNode;
}

/** Row "⋯" menu with Edit / Delete (and optional extra items). */
export function GenericRowActions<T>({
  item,
  onEdit,
  onDelete,
  extraActions,
}: GenericRowActionsProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 data-[state=open]:bg-accent">
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Ouvrir le menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {onEdit && (
          <DropdownMenuItem onClick={() => onEdit(item)}>
            <Pencil className="mr-2 size-3.5 text-muted-foreground/70" />
            Modifier
          </DropdownMenuItem>
        )}
        {extraActions?.(item)}
        {onDelete && (
          <DropdownMenuItem
            variant="destructive"
            onClick={() => onDelete(item)}
          >
            <Trash2 className="mr-2 size-3.5" />
            Supprimer
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Builds the trailing "actions" column with an edit/delete row menu. */
export function buildEditDeleteActionsColumn<T>({
  onEdit,
  onDelete,
  extraActions,
}: {
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  extraActions?: (item: T) => React.ReactNode;
}): ColumnDef<T> {
  return {
    id: 'actions',
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <GenericRowActions
          item={row.original}
          onEdit={onEdit}
          onDelete={onDelete}
          extraActions={extraActions}
        />
      </div>
    ),
  };
}
