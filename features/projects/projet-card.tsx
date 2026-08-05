import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Projet } from './projects.dto';
import {
  PROJET_STADE_LABELS,
  PROJET_STATUT_LABELS,
  PROJET_TYPE_LABELS,
  formatMontant,
} from './projects.constants';

/** Compact summary card for one micro-projet. */
export function ProjetCard({ projet }: { projet: Projet }) {
  return (
    <div className="space-y-2 rounded-lg border border-border p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium text-foreground">{projet.intitule}</p>
          <p className="font-mono text-xs text-muted-foreground">{projet.code}</p>
        </div>
        <Badge variant="secondary" className="shrink-0 font-normal">
          {PROJET_STATUT_LABELS[projet.statut] ?? projet.statut}
        </Badge>
      </div>

      {projet.description && (
        <p className="line-clamp-2 text-sm text-muted-foreground">{projet.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{formatMontant(projet.montant_total)}</span>
        <span>{PROJET_STADE_LABELS[projet.stade_projet] ?? projet.stade_projet}</span>
        <span>{PROJET_TYPE_LABELS[projet.type_projet] ?? projet.type_projet}</span>
        {projet.localisation && (
          <span className="flex items-center gap-1">
            <MapPin className="size-3" />
            {projet.localisation}
          </span>
        )}
      </div>

      <div className="flex justify-end pt-1">
        <Link
          href={`/dashboard/projets/${projet.id}`}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Voir le projet
          <ArrowRight className="size-3" />
        </Link>
      </div>
    </div>
  );
}
