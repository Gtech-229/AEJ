'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type Updater,
  type VisibilityState,
} from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/generic/empty-state';
import type { LucideIcon } from 'lucide-react';
import { DataTableToolbar } from '@/components/data-table/toolbar';
import { DataTablePagination } from '@/components/data-table/pagination';
import type { FacetedFilter } from '@/components/data-table/types';

export interface GenericTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  /** Column id used by the toolbar's free-text search box. */
  searchKey?: string;
  searchPlaceholder?: string;
  facetedFilters?: FacetedFilter[];
  bulkActionsSlot?: (rows: TData[]) => React.ReactNode;
  toolbarEndSlot?: React.ReactNode;
  defaultPageSize?: number;
  /** Empty-row content. `emptyMessage` is the title fallback; the rest enrich it. */
  emptyMessage?: string;
  emptyIcon?: LucideIcon;
  emptyTitle?: React.ReactNode;
  emptyDescription?: React.ReactNode;
  /** Action slot for the empty state — typically a `<Button>`. */
  emptyAction?: React.ReactNode;
  showSearch?: boolean;
  showViewOptions?: boolean;
  showPagination?: boolean;
  compactPagination?: boolean;
  /**
   * Opt-in **server-side** pagination. When provided, the table renders `data`
   * as the current page as-is (no client slicing/filtering/sorting) and relies
   * on the backend — `pageCount`/`rowCount` come from the response `meta`. The
   * URL still drives page/size/search/sort; the consuming hook reads them (see
   * `usePageParams`) and refetches. Omit it to keep the default client-side
   * pagination (fetch the whole list, slice in the browser).
   */
  manualPagination?: { pageCount: number; rowCount?: number };
  onRowClick?: (row: TData) => void;
  isLoading?: boolean;
  initialState?: {
    columnVisibility?: VisibilityState;
    sorting?: SortingState;
  };
  onExportContext?: (ctx: {
    filteredData: TData[];
    visibleColumnIds: string[];
  }) => void;
  tableContainerClassName?: string;
}

/**
 * Matches a string cell (search) or an array of selected values (facets).
 * Typed as `FilterFn<any>` so it can serve as the shared default filter without
 * narrowing the table's row type.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const universalFilter: FilterFn<any> = (row, columnId, filterValue) => {
  if (filterValue == null || filterValue === '') return true;
  const cell = row.getValue(columnId);
  if (Array.isArray(filterValue)) {
    return filterValue.length === 0 || filterValue.includes(cell as string);
  }
  return String(cell ?? '')
    .toLowerCase()
    .includes(String(filterValue).toLowerCase());
};

function parseSorting(raw: string | null, fallback: SortingState): SortingState {
  if (!raw) return fallback;
  return raw.split(',').map((token) => {
    const [id, dir] = token.split('.');
    return { id, desc: dir === 'desc' };
  });
}

/**
 * URL-aware generic table built on @tanstack/react-table. Search, faceted
 * filters, sorting, and pagination live in the URL (via next/navigation), so
 * table views are shareable and survive refresh. Data is passed in — fetch it
 * in the Server page (prefetch + hydrate) or a feature hook.
 */
export function GenericTable<TData>({
  data,
  columns,
  searchKey,
  searchPlaceholder,
  facetedFilters,
  bulkActionsSlot,
  toolbarEndSlot,
  defaultPageSize = 10,
  emptyMessage = 'Aucun résultat.',
  emptyIcon,
  emptyTitle,
  emptyDescription,
  emptyAction,
  showSearch = true,
  showPagination = true,
  compactPagination,
  manualPagination,
  onRowClick,
  isLoading,
  initialState,
  onExportContext,
  tableContainerClassName,
}: GenericTableProps<TData>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Local (non-URL) UI state.
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialState?.columnVisibility ?? {},
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const facetIds = useMemo(
    () => (facetedFilters ?? []).map((f) => f.columnId),
    [facetedFilters],
  );

  // Derive controlled state from the URL.
  const sorting = parseSorting(searchParams.get('sort'), initialState?.sorting ?? []);
  const pagination: PaginationState = {
    pageIndex: Math.max(0, Number(searchParams.get('page') ?? '1') - 1),
    pageSize: Number(searchParams.get('size') ?? String(defaultPageSize)),
  };
  const columnFilters: ColumnFiltersState = useMemo(() => {
    const filters: ColumnFiltersState = [];
    const q = searchParams.get('q');
    if (searchKey && q) filters.push({ id: searchKey, value: q });
    for (const id of facetIds) {
      const raw = searchParams.get(`f.${id}`);
      if (raw) filters.push({ id, value: raw.split(',') });
    }
    return filters;
  }, [searchParams, searchKey, facetIds]);

  function replaceParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    const next = params.toString();
    // No-op if nothing actually changed. Writing the same params still triggers
    // an RSC navigation/refetch, which — combined with React Table's state sync —
    // can loop into constant background requests.
    if (next === searchParams.toString()) return;
    router.replace(`${pathname}?${next}`, { scroll: false });
  }

  function onSortingChange(updater: Updater<SortingState>) {
    const next = typeof updater === 'function' ? updater(sorting) : updater;
    replaceParams((p) => {
      if (next.length) {
        p.set('sort', next.map((s) => `${s.id}.${s.desc ? 'desc' : 'asc'}`).join(','));
      } else {
        p.delete('sort');
      }
      p.delete('page');
    });
  }

  function onColumnFiltersChange(updater: Updater<ColumnFiltersState>) {
    const next = typeof updater === 'function' ? updater(columnFilters) : updater;
    replaceParams((p) => {
      p.delete('q');
      for (const id of facetIds) p.delete(`f.${id}`);
      for (const filter of next) {
        if (filter.id === searchKey) {
          if (filter.value) p.set('q', String(filter.value));
        } else if (Array.isArray(filter.value) && filter.value.length) {
          p.set(`f.${filter.id}`, (filter.value as string[]).join(','));
        }
      }
      p.delete('page');
    });
  }

  function onPaginationChange(updater: Updater<PaginationState>) {
    const next = typeof updater === 'function' ? updater(pagination) : updater;
    replaceParams((p) => {
      p.set('page', String(next.pageIndex + 1));
      p.set('size', String(next.pageSize));
    });
  }

  const manual = !!manualPagination;
  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection, pagination },
    // Pagination/filters are URL-controlled — don't let React Table auto-reset
    // the page index when data arrives (it fires onPaginationChange → a URL
    // write → RSC refetch → re-render → reset again → request loop).
    autoResetPageIndex: false,
    // Server-side mode: the backend already sliced/filtered/sorted this page.
    manualPagination: manual,
    manualFiltering: manual,
    manualSorting: manual,
    pageCount: manual ? manualPagination!.pageCount : undefined,
    rowCount: manual ? manualPagination!.rowCount : undefined,
    onSortingChange,
    onColumnFiltersChange,
    onPaginationChange,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    defaultColumn: { filterFn: universalFilter },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // In server mode the rows already are the page — don't re-paginate client-side.
    getPaginationRowModel: manual ? undefined : getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // Expose the current filtered/visible view (e.g. for CSV export).
  useEffect(() => {
    if (!onExportContext) return;
    onExportContext({
      filteredData: table.getFilteredRowModel().rows.map((r) => r.original),
      visibleColumnIds: table.getVisibleFlatColumns().map((c) => c.id),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onExportContext, data, columnFilters, columnVisibility]);

  const selectedRows = table.getFilteredSelectedRowModel().rows.map((r) => r.original);

  const hasToolbar = showSearch || !!toolbarEndSlot;

  return (
    <div className="space-y-3">
      {hasToolbar && (
        <DataTableToolbar
          table={table}
          searchKey={searchKey}
          searchPlaceholder={searchPlaceholder}
          showSearch={showSearch}
          toolbarEndSlot={toolbarEndSlot}
        />
      )}

      {bulkActionsSlot && selectedRows.length > 0 && (
        <div className="flex items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-2">
          <span className="text-sm text-muted-foreground">
            {selectedRows.length} sélectionné(s)
          </span>
          {bulkActionsSlot(selectedRows)}
        </div>
      )}

      <div className={cn('rounded-md border border-border', tableContainerClassName)}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="sticky top-0 z-10 bg-muted hover:bg-muted"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {table.getVisibleFlatColumns().map((col) => (
                    <TableCell key={col.id}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  className={cn(
                    'hover:bg-primary/5 data-[state=selected]:bg-primary/10',
                    onRowClick && 'cursor-pointer',
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={table.getVisibleFlatColumns().length} className="p-0">
                  <EmptyState
                    variant="bare"
                    icon={emptyIcon}
                    title={emptyTitle ?? emptyMessage}
                    description={emptyDescription}
                  >
                    {emptyAction}
                  </EmptyState>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && <DataTablePagination table={table} compact={compactPagination} />}
    </div>
  );
}
