'use client';

import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from 'lucide-react';
import type { Column } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

/** Sortable, hideable column header with a dropdown of sort/hide actions. */
export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const sorted = column.getIsSorted();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn('-ml-3 h-8 data-[state=open]:bg-accent', className)}
        >
          <span>{title}</span>
          {sorted === 'desc' ? (
            <ArrowDown className="ml-2 size-4" />
          ) : sorted === 'asc' ? (
            <ArrowUp className="ml-2 size-4" />
          ) : (
            <ChevronsUpDown className="ml-2 size-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
          <ArrowUp className="mr-2 size-3.5 text-muted-foreground/70" />
          Croissant
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
          <ArrowDown className="mr-2 size-3.5 text-muted-foreground/70" />
          Décroissant
        </DropdownMenuItem>
        {column.getCanHide() && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
              <EyeOff className="mr-2 size-3.5 text-muted-foreground/70" />
              Masquer
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
