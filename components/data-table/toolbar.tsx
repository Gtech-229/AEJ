'use client';

import type { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchKey?: string;
  searchPlaceholder?: string;
  showSearch?: boolean;
  toolbarEndSlot?: React.ReactNode;
}

/**
 * Minimal, uniform table toolbar: a search box on the left and an optional
 * action slot on the right. No faceted-filter chips / column-visibility menu —
 * those were removed for a clean, consistent look (filters live above tables).
 */
export function DataTableToolbar<TData>({
  table,
  searchKey,
  searchPlaceholder,
  showSearch = true,
  toolbarEndSlot,
}: DataTableToolbarProps<TData>) {
  const searchColumn = searchKey ? table.getColumn(searchKey) : undefined;

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-1 items-center gap-2">
        {showSearch && searchColumn && (
          <Input
            placeholder={searchPlaceholder ?? 'Rechercher…'}
            value={(searchColumn.getFilterValue() as string) ?? ''}
            onChange={(e) => searchColumn.setFilterValue(e.target.value)}
            className="h-9 w-full max-w-xs"
          />
        )}
      </div>
      {toolbarEndSlot && <div className="flex items-center gap-2">{toolbarEndSlot}</div>}
    </div>
  );
}
