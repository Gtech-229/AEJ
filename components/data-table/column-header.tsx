import type { Column } from '@tanstack/react-table';
import { cn } from '@/lib/utils';

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

/**
 * Plain column header. No sort/hide dropdown — headers stay static and any
 * filtering lives above the table (design decision for a uniform, clean look).
 * Keeps the `column` prop so existing columns compile unchanged.
 */
export function DataTableColumnHeader<TData, TValue>({
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  return <span className={cn('text-sm font-medium text-foreground', className)}>{title}</span>;
}
