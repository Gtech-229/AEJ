import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { projetStatutLabel, projetStatutStyle } from './projects.constants';

/**
 * A micro-projet statut rendered as a colour-coded badge (bg + border + text per
 * statut). Reusable anywhere a projet statut is shown — table cells, summaries,
 * detail headers. Renders an em-dash for a null/empty statut.
 */
export function ProjetStatutBadge({
  statut,
  className,
}: {
  statut: string | null | undefined;
  className?: string;
}) {
  if (!statut) return <span className="text-muted-foreground">—</span>;
  return (
    <Badge variant="outline" className={cn('font-normal', projetStatutStyle(statut), className)}>
      {projetStatutLabel(statut)}
    </Badge>
  );
}
