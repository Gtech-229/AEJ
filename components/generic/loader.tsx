import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const SIZES = {
  sm: 'size-4',
  default: 'size-6',
  lg: 'size-8',
} as const;

type LoaderSize = keyof typeof SIZES;

/** A spinning loader icon. Use inline (e.g. inside a button) or via `LoadingState`. */
export function Loader({ size = 'default', className }: { size?: LoaderSize; className?: string }) {
  return (
    <Loader2
      role="status"
      aria-label="Chargement"
      className={cn('animate-spin text-muted-foreground', SIZES[size], className)}
    />
  );
}

/**
 * Centered loader + label for filling a section/panel/page while it loads.
 * Replaces bare "Chargement…" text so loading states look consistent.
 */
export function LoadingState({
  label = 'Chargement…',
  size = 'lg',
  className,
}: {
  label?: string;
  size?: LoaderSize;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-12 text-sm text-muted-foreground',
        className,
      )}
    >
      <Loader size={size} />
      {label && <span>{label}</span>}
    </div>
  );
}
