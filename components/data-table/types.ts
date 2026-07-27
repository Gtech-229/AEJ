import type { RowData } from '@tanstack/react-table';

/** A single option in a faceted (multi-select) column filter. */
export interface FacetedFilterOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

/** Config for one faceted column filter shown in the toolbar. */
export interface FacetedFilter {
  columnId: string;
  title: string;
  options: FacetedFilterOption[];
}

/**
 * Augment react-table's ColumnMeta with a human label, used by the
 * column-visibility menu (falls back to the column id).
 */
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string;
  }
}
