import { Construction } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Full-area placeholder for an interface that isn't built yet. Drop it into a
 * route page (or any container) that has no real content available. For a small
 * section-level placeholder, prefer `EmptyState` instead.
 */
export function UnderConstruction({
  title = 'Interface en construction',
  description = "Cette section n'est pas encore disponible — elle est en cours de développement.",
  className,
}: {
  title?: string;
  description?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 py-12 text-center',
        className,
      )}
    >
      <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Construction className="size-8" strokeWidth={1.75} aria-hidden />
      </div>
      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">{description}</p>
      </div>
      <Badge variant="secondary">Bientôt disponible</Badge>
    </div>
  );
}
