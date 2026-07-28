import type { LucideIcon } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const emptyStateVariants = cva(
  'flex flex-col items-center justify-center gap-3 text-center',
  {
    variants: {
      variant: {
        // Standalone: soft dashed card — use when the empty state owns the space.
        card: 'rounded-xl border border-dashed border-border/60 bg-muted/20 px-6 py-12',
        // Bare: no chrome — use when already inside a Card, table body, or panel.
        bare: 'px-6 py-10',
      },
    },
    defaultVariants: {
      variant: 'card',
    },
  },
);

interface EmptyStateProps extends VariantProps<typeof emptyStateVariants> {
  /** Optional leading icon (a lucide icon component, e.g. `Inbox`). */
  icon?: LucideIcon;
  /** Main line — what is empty or what just happened. */
  title: React.ReactNode;
  /** Optional supporting sentence guiding the user's next step. */
  description?: React.ReactNode;
  /** Action slot — typically a `<Button>` to resolve the empty state. */
  children?: React.ReactNode;
  className?: string;
}

/**
 * Reusable empty state: icon (optional) + title + description + action slot.
 * Presentational only (no interactivity of its own), so it stays a Server
 * Component — the action passed as `children` carries any client behaviour.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
  variant,
  className,
}: EmptyStateProps) {
  return (
    <div data-slot="empty-state" className={cn(emptyStateVariants({ variant }), className)}>
      {Icon && (
        <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground/80">
          <Icon className="size-6" strokeWidth={1.75} aria-hidden />
        </div>
      )}

      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="mx-auto max-w-sm text-sm text-balance text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {children && (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">{children}</div>
      )}
    </div>
  );
}
