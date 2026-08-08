'use client';

import type { LucideIcon } from 'lucide-react';
import { FolderKanban, IdCard, Layers, Phone, User } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/generic/empty-state';
import { LoadingState } from '@/components/generic/loader';
import { CountryFlag } from '@/components/generic/country-flag';
import { cn } from '@/lib/utils';
import { formatDate, getAge } from '@/lib/date';
import { useProjectsByPromoteur } from '@/features/projects/projects.hooks';
import { ProjetCard } from '@/features/projects/projet-card';
import { refLabel } from '@/features/referentials/referentials.types';
import { usePromoteurReferentials } from './promoteurs.referentials';
import type { Promoteur } from './promoteurs.dto';

function Field({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{value || '—'}</dd>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Icon className="size-4 text-muted-foreground" />
        {title}
      </h3>
      {children}
    </section>
  );
}

/**
 * Promoteur detail panel — general information from the row data, plus a
 * Projets section that is a TEMPLATE for now (fetching a promoteur's projects
 * isn't available yet). Controlled by a nullable `promoteur`: non-null = open.
 */
export function PromoteurDetailSheet({
  promoteur,
  onOpenChange,
}: {
  promoteur: Promoteur | null;
  onOpenChange: (open: boolean) => void;
}) {
  const actif = (promoteur?.statut ?? 1) !== 0;
  const age = getAge(promoteur?.datenaissance);
  const refs = usePromoteurReferentials();
  const { data: projets, isLoading: projetsLoading } = useProjectsByPromoteur(promoteur?.id);
   console.log("Projects :", projets)
  return (
    <Sheet open={!!promoteur} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-xl">
        {promoteur && (
          <>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                {promoteur.prenom} {promoteur.nom}
                <Badge
                  variant="outline"
                  className={cn(
                    'gap-1.5',
                    actif
                      ? 'border-success/30 bg-success/10 text-success'
                      : 'text-muted-foreground',
                  )}
                >
                  <span
                    className={cn(
                      'size-1.5 rounded-full',
                      actif ? 'bg-success' : 'bg-muted-foreground',
                    )}
                  />
                  {actif ? 'Actif' : 'Inactif'}
                </Badge>
              </SheetTitle>
              <SheetDescription className="font-mono text-xs">
                {promoteur.matriculeaej ?? '—'}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 space-y-6 overflow-y-auto px-4 pb-6">
              <Section title="Coordonnées" icon={Phone}>
                <dl className="grid grid-cols-2 gap-4">
                  <Field label="Email" value={promoteur.email} />
                  <Field label="Téléphone" value={promoteur.telephone} />
                </dl>
              </Section>

              <Section title="État civil" icon={User}>
                <dl className="grid grid-cols-2 gap-4">
                  <Field label="Date de naissance" value={formatDate(promoteur.datenaissance)} />
                  <Field label="Âge" value={age != null ? `${age} ans` : undefined} />
                  <Field label="Lieu de naissance" value={promoteur.lieunaissance} />
                  <Field label="Nom du père" value={promoteur.nomdupere} />
                  <Field label="Nom de la mère" value={promoteur.nomdelamere} />
                  <Field label="Raison sociale" value={promoteur.raison_sociale} />
                </dl>
              </Section>

              <Section title="Documents" icon={IdCard}>
                <dl className="grid grid-cols-2 gap-4">
                  <Field label="N° CNI" value={promoteur.numerocni} />
                  <Field label="N° CMU" value={promoteur.numerocmu} />
                  <Field label="N° CNPS" value={promoteur.numerocnps} />
                </dl>
              </Section>

              <Section title="Rattachements" icon={Layers}>
                <dl className="grid grid-cols-2 gap-4">
                  <Field label="Sexe" value={refs.labelOf('sexe', promoteur.sexe_id)} />
                  <Field
                    label="Agence régionale"
                    value={refs.labelOf('agenceregionale', promoteur.agenceregionale_id)}
                  />
                  <Field
                    label="Secteur d'activité"
                    value={refs.labelOf('secteuractivite', promoteur.secteuractivite_id)}
                  />
                  <Field
                    label="Sous-secteur"
                    value={refs.labelOf('soussecteuractivite', promoteur.soussecteuractivite_id)}
                  />
                  <Field
                    label="Niveau d'étude"
                    value={refs.labelOf('niveauetude', promoteur.niveauetude_id)}
                  />
                  <Field
                    label="Situation matrimoniale"
                    value={refs.labelOf('situationmatrimoniale', promoteur.situationmatrimoniale_id)}
                  />
                  <Field
                    label="Type de pièce"
                    value={refs.labelOf('typepieceidentite', promoteur.typepieceidentite_id)}
                  />
                  <Field
                    label="Pays de nationalité"
                    value={(() => {
                      const pays = refs.itemOf('paysnationalite', promoteur.paysnationalite_id);
                      if (!pays) return '—';
                      return (
                        <span className="flex items-center gap-1.5">
                          <CountryFlag code={pays.code_iso} />
                          {refLabel(pays)}
                        </span>
                      );
                    })()}
                  />
                  <Field
                    label="Situation handicap"
                    value={refs.labelOf('typesituationhandicap', promoteur.typesituationhandicap_id)}
                  />
                </dl>
              </Section>

              <Section title="Projets" icon={FolderKanban}>
                {projetsLoading ? (
                  <LoadingState label="Chargement des projets…" size="default" className="py-6" />
                ) : projets && projets.length > 0 ? (
                  <div className="space-y-2">
                    {projets.map((projet) => (
                      <ProjetCard key={projet.id} projet={projet} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    variant="card"
                    icon={FolderKanban}
                    title="Aucun projet"
                    description="Ce promoteur n'a pas encore de micro-projet enregistré."
                  />
                )}
              </Section>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
