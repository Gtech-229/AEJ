'use client';

import type { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from './view-options';
import { DataTableFacetedFilter } from './faceted-filter';
import type { FacetedFilter } from './types';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchKey?: string;
  searchPlaceholder?: string;
  facetedFilters?: FacetedFilter[];
  showSearch?: boolean;
  showViewOptions?: boolean;
  toolbarEndSlot?: React.ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  searchPlaceholder,
  facetedFilters,
  showSearch = true,
  showViewOptions = true,
  toolbarEndSlot,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const searchColumn = searchKey ? table.getColumn(searchKey) : undefined;

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {showSearch && searchColumn && (
          <Input
            placeholder={searchPlaceholder ?? 'Rechercher…'}
            value={(searchColumn.getFilterValue() as string) ?? ''}
            onChange={(e) => searchColumn.setFilterValue(e.target.value)}
            className="h-8 w-[180px] lg:w-[250px]"
          />
        )}
        {facetedFilters?.map((filter) => {
          const column = table.getColumn(filter.columnId);
          return column ? (
            <DataTableFacetedFilter
              key={filter.columnId}
              column={column}
              title={filter.title}
              options={filter.options}
            />
          ) : null;
        })}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Réinitialiser
            <X className="ml-2 size-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {toolbarEndSlot}
        {showViewOptions && <DataTableViewOptions table={table} />}
      </div>
    </div>
  );
}
