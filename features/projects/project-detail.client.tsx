'use client';

import Link from 'next/link';
import { ArrowLeft, CalendarDays, FolderKanban, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/generic/empty-state';
import { ExpandableText } from '@/components/generic/expandable-text';
import { LoadingState } from '@/components/generic/loader';
import { formatDate } from '@/lib/date';
import { useFormatMontant } from '@/features/configurations/configurations.hooks';
import type { Projet } from './projects.dto';
import { useProject } from './projects.hooks';
import { ProjectSuiviTabs } from './project-suivi-tabs';
import { ProjectActionBar } from './project-action-bar';
import {
  PROJET_STADE_LABELS,
  PROJET_STATUT_LABELS,
  PROJET_TYPE_LABELS,
} from './projects.constants';

function Field({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{value || '—'}</dd>
    </div>
  );
}

/**
 * Reusable 360° view of a micro-projet — presentational (takes the `projet`
 * directly). `backHref`/`backLabel` adapt the return link to the caller (the
 * Micro-projets list, a promoteur, …); `actions` renders caller-provided buttons
 * in the header (edit / validate / …) — kept as a prop so new actions slot in
 * without touching this component.
 */
export function ProjectDetail({
  projet,
  backHref = '/dashboard/projets',
  backLabel = 'Retour aux micro-projets',
  actions,
}: {
  projet: Projet;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
}) {
  const formatMontant = useFormatMontant();

  return (
    // min-h-full so the sticky footer sits at the viewport bottom on short pages.
    <div className="mx-auto flex min-h-full max-w-5xl flex-col px-6">
      {/* Sticky header — the original header card, unchanged, pinned to the top. */}
      <div className="sticky top-0 z-20 -mx-6 bg-background px-6 pb-4 pt-6">
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-3 w-fit">
          <Link href={backHref}>
            <ArrowLeft className="size-4" /> {backLabel}
          </Link>
        </Button>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <h1 className="text-2xl font-bold text-foreground">{projet.intitule}</h1>
              <p className="font-mono text-xs text-muted-foreground">
                {projet.code} · {projet.matricule}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Badge variant="secondary">
                {PROJET_STATUT_LABELS[projet.statut] ?? projet.statut}
              </Badge>
              {actions}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
            <div>
              <p className="text-xs text-muted-foreground">Montant total</p>
              <p className="text-xl font-semibold text-foreground">
                {formatMontant(projet.montant_total)}
              </p>
            </div>
            <Badge variant="outline">
              {PROJET_STADE_LABELS[projet.stade_projet] ?? projet.stade_projet}
            </Badge>
            <Badge variant="outline">
              {PROJET_TYPE_LABELS[projet.type_projet] ?? projet.type_projet}
            </Badge>
            {projet.localisation && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-4" /> {projet.localisation}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 space-y-6 pb-6 pt-2">
        {projet.description && (
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-2 text-sm font-semibold text-foreground">Description</h2>
            <ExpandableText text={projet.description} clampLines={3} />
          </section>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Détails</h2>
            <dl className="grid grid-cols-2 gap-4">
              <Field
                label="Stade"
                value={PROJET_STADE_LABELS[projet.stade_projet] ?? projet.stade_projet}
              />
              <Field
                label="Type"
                value={PROJET_TYPE_LABELS[projet.type_projet] ?? projet.type_projet}
              />
              <Field label="Localisation" value={projet.localisation} />
              <Field label="Géolocalisation" value={projet.geolocalisation} />
            </dl>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <CalendarDays className="size-4 text-muted-foreground" /> Dates
            </h2>
            <dl className="grid grid-cols-2 gap-4">
              <Field label="Certification" value={formatDate(projet.date_certification)} />
              <Field
                label="Transmission partenaire"
                value={formatDate(projet.date_transmission_partenaire)}
              />
              <Field label="Créé le" value={formatDate(projet.created_at)} />
              <Field label="Dernière mise à jour" value={formatDate(projet.updated_at)} />
            </dl>
          </section>
        </div>

        {/* Lifecycle 360° — tabbed; each tab is scaffolded until its endpoint exists. */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Suivi du dossier</h2>
          <ProjectSuiviTabs projet={projet} />
        </section>
      </div>

      {/* Sticky footer — the dossier's next action (gated). */}
      <ProjectActionBar projet={projet} />
    </div>
  );
}

/**
 * Route entry for the 360 page: fetches the project by id (`GET /projets/{id}`)
 * and renders the reusable `ProjectDetail`, handling loading + not-found.
 */
export function ProjectDetailClient({
  projectId,
  backHref,
  backLabel,
}: {
  projectId: number;
  backHref?: string;
  backLabel?: string;
}) {
  const { data: projet, isLoading } = useProject(projectId);

  if (isLoading) {
    return <LoadingState label="Chargement du projet…" />;
  }

  if (!projet) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href={backHref ?? '/dashboard/projets'}>
            <ArrowLeft className="size-4" /> Retour
          </Link>
        </Button>
        <EmptyState
          variant="card"
          icon={FolderKanban}
          title="Projet introuvable"
          description="Ce micro-projet n'existe pas ou n'est plus disponible."
        />
      </div>
    );
  }

  return <ProjectDetail projet={projet} backHref={backHref} backLabel={backLabel} />;
}
