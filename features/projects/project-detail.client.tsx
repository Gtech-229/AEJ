'use client';

import Link from 'next/link';
import { ArrowLeft, CalendarDays, FolderKanban, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/generic/empty-state';
import { ExpandableText } from '@/components/generic/expandable-text';
import { formatDate } from '@/lib/date';
import { useProject } from './projects.hooks';
import { ProjectSuiviTabs } from './project-suivi-tabs';
import {
  PROJET_STADE_LABELS,
  PROJET_STATUT_LABELS,
  PROJET_TYPE_LABELS,
  formatMontant,
} from './projects.constants';

function Field({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{value || '—'}</dd>
    </div>
  );
}

export function ProjectDetailClient({ projectId }: { projectId: number }) {
  const { data: projet, isLoading } = useProject(projectId);

  if (isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Chargement du projet…</div>;
  }

  if (!projet) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/dashboard/promoteurs">
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

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-6 py-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2 w-fit">
        <Link href="/dashboard/promoteurs">
          <ArrowLeft className="size-4" /> Retour aux promoteurs
        </Link>
      </Button>

      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <h1 className="text-2xl font-bold text-foreground">{projet.intitule}</h1>
            <p className="font-mono text-xs text-muted-foreground">
              {projet.code} · {projet.matricule}
            </p>
          </div>
          <Badge variant="secondary" className="shrink-0">
            {PROJET_STATUT_LABELS[projet.statut] ?? projet.statut}
          </Badge>
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
            <Field label="Mis à jour le" value={formatDate(projet.updated_at)} />
          </dl>
        </section>
      </div>

      {/* Lifecycle 360° — tabbed; each tab is scaffolded until its endpoint exists. */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Suivi du dossier</h2>
        <ProjectSuiviTabs projet={projet} />
      </section>
    </div>
  );
}
