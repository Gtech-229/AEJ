'use client';

import { Boxes, FolderGit2, MapPin } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/generic/empty-state';
import { useFormatMontant } from '@/features/configurations/configurations.hooks';
import type { MegaProjet } from '@/features/mega-projets/mega-projets.dto';
import type { Dispositif } from '@/features/dispositifs/dispositifs.dto';
import type { ZoneIntervention } from '@/features/zones-intervention/zones-intervention.dto';

function Section({
  title,
  icon: Icon,
  count,
  children,
}: {
  title: string;
  icon: typeof Boxes;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
        <Icon className="size-4 text-muted-foreground" />
        {title}
        {count != null && <span className="text-muted-foreground">({count})</span>}
      </h3>
      {children}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}

/**
 * Read-only master-detail for a programme (mega-projet): its 1:1 dispositif
 * (budget + prévisionnels) and its zones d'intervention, side by side. Editing
 * stays in the respective tabs.
 */
export function ProgrammeDetailSheet({
  programme,
  dispositif,
  zones,
  onOpenChange,
}: {
  programme: MegaProjet | null;
  dispositif?: Dispositif;
  zones: ZoneIntervention[];
  onOpenChange: (open: boolean) => void;
}) {
  const formatMontant = useFormatMontant();

  return (
    <Sheet open={!!programme} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-xl">
        {programme && (
          <>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <FolderGit2 className="size-5 text-primary" />
                {programme.titre}
              </SheetTitle>
              <SheetDescription>
                {programme.secteur?.libelle ?? 'Secteur non précisé'}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 space-y-6 overflow-y-auto px-4 pb-6">
              <Section title="Dispositif" icon={Boxes}>
                {dispositif ? (
                  <div className="space-y-3 rounded-xl border border-border bg-card p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-foreground">{dispositif.intitule}</p>
                        <p className="font-mono text-xs text-muted-foreground">{dispositif.code}</p>
                      </div>
                      <Badge variant="outline" className="font-normal">
                        {formatMontant(dispositif.budget_alloue)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Metric label="Emplois prévus" value={dispositif.nbre_emplois_prevu} />
                      <Metric label="Bénéficiaires" value={dispositif.nbre_beneficiaire_prevu} />
                      <Metric label="Micro-projets" value={dispositif.nbre_micro_projet_prevu} />
                    </div>
                  </div>
                ) : (
                  <EmptyState
                    variant="card"
                    icon={Boxes}
                    title="Aucun dispositif"
                    description="Ce projet n'a pas encore de dispositif. Ajoutez-le depuis l'onglet Dispositifs."
                  />
                )}
              </Section>

              <Section title="Zones d'intervention" icon={MapPin} count={zones.length}>
                {zones.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Aucune zone d'intervention pour ce projet.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {zones.map((z) => {
                      const hasGps = z.latitude != null && z.longitude != null;
                      return (
                        <li
                          key={z.id}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3"
                        >
                          <span className="text-sm text-foreground">{z.adresse ?? '—'}</span>
                          {hasGps && (
                            <a
                              href={`https://www.google.com/maps?q=${z.latitude},${z.longitude}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                            >
                              <MapPin className="size-3.5" />
                              {Number(z.latitude).toFixed(4)}, {Number(z.longitude).toFixed(4)}
                            </a>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Section>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
