'use client';

import { useMemo, useState } from 'react';
import {
  Camera,
  ImageOff,
  MapPin,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DynamicForm } from '@/components/forms';
import { EmptyState } from '@/components/generic/empty-state';
import { LoadingState } from '@/components/generic/loader';
import { GenericDialogs } from '@/components/generic/generic-dialogs';
import { useDialogState } from '@/components/generic/use-dialog-state';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/date';
import { useAuth } from '@/features/auth/auth.context';
import type { Projet } from './projects.dto';
import type { Exploitation, VisitePhoto } from '@/features/exploitations/exploitations.dto';
import {
  ETAT_ACTIVITE_LABELS,
  ETAT_INSTALLATION_LABELS,
  REALISATION_VIDE_LABELS,
  etatActiviteTone,
  etatInstallationTone,
  type ExploitationTone,
} from '@/features/exploitations/exploitations.constants';
import {
  useCreateExploitation,
  useCreateVisitePhoto,
  useDeleteExploitation,
  useDeleteVisitePhoto,
  useExploitations,
  useUpdateExploitation,
} from '@/features/exploitations/exploitations.hooks';
import { exploitationFormConfig } from '@/features/exploitations/exploitations.form';
import { exploitationSchema, type ExploitationInput } from '@/features/exploitations/exploitations.schema';
import { getExploitationDefaults } from '@/features/exploitations/exploitations.defaults';

/** Backend origin serving the stored photos (paths come back as `/storage/...`). */
const STORAGE_ORIGIN = 'https://apis.aej-ci.net/public';

/** Make a stored photo path absolute; leave already-absolute URLs untouched. */
function photoSrc(url: string) {
  if (/^https?:\/\//.test(url)) return url;
  return `${STORAGE_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
}

const TONE_CLASS: Record<ExploitationTone, string> = {
  success: 'border-success/30 bg-success/10 text-success',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
  danger: 'border-destructive/30 bg-destructive/10 text-destructive',
  neutral: 'text-muted-foreground',
};

function ToneBadge({ tone, label }: { tone: ExploitationTone; label: string }) {
  return (
    <Badge variant="outline" className={cn('font-normal', TONE_CLASS[tone])}>
      {label}
    </Badge>
  );
}

function Meta({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-0.5 text-sm text-foreground">{value}</div>
    </div>
  );
}

function TextBlock({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 whitespace-pre-wrap text-sm text-foreground">{value}</p>
    </div>
  );
}

/** Map an `ExploitationInput` to the API payload, dropping empty optionals. */
function toPayload(data: ExploitationInput) {
  return {
    etat_installation: data.etat_installation,
    etat_activite: data.etat_activite,
    realisation_vide: data.realisation_vide,
    nbre_visites: data.nbre_visites ?? null,
    date_debut_visite: data.date_debut_visite || null,
    date_fin_visite: data.date_fin_visite || null,
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
    difficultes: data.difficultes || null,
    recommandations: data.recommandations || null,
    observations: data.observations || null,
  };
}

/**
 * Photos taken during a visit. Read-only by default; when `readOnly` is false an
 * add-by-URL form and per-photo delete appear.
 */
function PhotosSection({
  exploitation,
  readOnly,
}: {
  exploitation: Exploitation;
  readOnly: boolean;
}) {
  const { user } = useAuth();
  const createPhoto = useCreateVisitePhoto();
  const deletePhoto = useDeleteVisitePhoto();
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const photos = exploitation.visite_photos ?? [];

  function add() {
    const photo_url = url.trim();
    if (!photo_url) return;
    createPhoto.mutate(
      {
        exploitation_id: exploitation.id,
        photo_url,
        description: description.trim() || null,
        prise_par_id: user?.id ?? null,
      },
      {
        onSuccess: () => {
          setUrl('');
          setDescription('');
        },
      },
    );
  }

  return (
    <div className="space-y-3 border-t border-border pt-3">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Camera className="size-3.5" />
        Photos de la visite ({photos.length})
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {photos.map((p) => (
            <PhotoThumb
              key={p.id}
              photo={p}
              readOnly={readOnly}
              onDelete={() => deletePhoto.mutate(p.id)}
              deleting={deletePhoto.isPending}
            />
          ))}
        </div>
      )}

      {photos.length === 0 && readOnly && (
        <p className="text-xs text-muted-foreground">Aucune photo pour cette visite.</p>
      )}

      {/* No file-upload endpoint yet (see backend-asks): add by storage URL/path. */}
      {!readOnly && (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL / chemin de la photo (ex: /storage/photos/…)"
            className="sm:flex-1"
          />
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optionnel)"
            className="sm:w-56"
          />
          <Button
            size="sm"
            variant="outline"
            className="cursor-pointer"
            onClick={add}
            disabled={!url.trim() || createPhoto.isPending}
          >
            <Plus className="size-4" />
            Ajouter
          </Button>
        </div>
      )}
    </div>
  );
}

function PhotoThumb({
  photo,
  onDelete,
  deleting,
  readOnly,
}: {
  photo: VisitePhoto;
  onDelete: () => void;
  deleting: boolean;
  readOnly: boolean;
}) {
  const [broken, setBroken] = useState(false);
  return (
    <div className="group relative aspect-square overflow-hidden rounded-md border border-border bg-muted">
      {broken ? (
        <div className="flex h-full flex-col items-center justify-center gap-1 p-2 text-center text-muted-foreground">
          <ImageOff className="size-5" />
          <span className="truncate text-[10px]">{photo.photo_url}</span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoSrc(photo.photo_url)}
          alt={photo.description ?? 'Photo de visite'}
          className="h-full w-full object-cover"
          onError={() => setBroken(true)}
        />
      )}
      {!readOnly && (
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="absolute right-1 top-1 hidden rounded-md bg-background/90 p-1 text-destructive shadow-sm group-hover:block"
          aria-label="Supprimer la photo"
        >
          <Trash2 className="size-3.5" />
        </button>
      )}
      {photo.description && (
        <p className="absolute inset-x-0 bottom-0 truncate bg-background/80 px-1.5 py-0.5 text-[10px] text-foreground">
          {photo.description}
        </p>
      )}
    </div>
  );
}

function ExploitationCard({
  exploitation,
  onEdit,
  onDelete,
  readOnly,
}: {
  exploitation: Exploitation;
  onEdit: () => void;
  onDelete: () => void;
  readOnly: boolean;
}) {
  const e = exploitation;
  const hasGps = e.latitude != null && e.longitude != null;
  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <ToneBadge
            tone={etatInstallationTone(e.etat_installation)}
            label={`Installation : ${ETAT_INSTALLATION_LABELS[e.etat_installation]}`}
          />
          <ToneBadge
            tone={etatActiviteTone(e.etat_activite)}
            label={`Activité : ${ETAT_ACTIVITE_LABELS[e.etat_activite]}`}
          />
          {e.realisation_vide === 'OUI' && (
            <ToneBadge tone="danger" label="Réalisation à vide" />
          )}
        </div>
        {!readOnly && (
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" className="size-8 cursor-pointer" onClick={onEdit}>
              <Pencil className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="size-8 cursor-pointer text-destructive hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Meta label="Nombre de visites" value={e.nbre_visites ?? '—'} />
        <Meta
          label="Période"
          value={
            e.date_debut_visite || e.date_fin_visite
              ? `${e.date_debut_visite ? formatDate(e.date_debut_visite) : '…'} → ${
                  e.date_fin_visite ? formatDate(e.date_fin_visite) : '…'
                }`
              : '—'
          }
        />
        <Meta
          label="Réalisation à vide"
          value={REALISATION_VIDE_LABELS[e.realisation_vide]}
        />
        <Meta
          label="Géolocalisation"
          value={
            hasGps ? (
              <a
                href={`https://www.google.com/maps?q=${e.latitude},${e.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                <MapPin className="size-3.5" />
                {Number(e.latitude).toFixed(4)}, {Number(e.longitude).toFixed(4)}
              </a>
            ) : (
              '—'
            )
          }
        />
      </div>

      {(e.difficultes || e.recommandations || e.observations) && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <TextBlock label="Difficultés rencontrées" value={e.difficultes} />
          <TextBlock label="Recommandations" value={e.recommandations} />
          <TextBlock label="Observations" value={e.observations} />
        </div>
      )}

      {e.agent && (
        <p className="text-xs text-muted-foreground">
          Agent : {e.agent.prenom} {e.agent.nom}
        </p>
      )}

      <PhotosSection exploitation={e} readOnly={readOnly} />
    </div>
  );
}

/**
 * Suivi terrain tab (§12): the micro-projet's exploitation record(s) — état
 * d'installation/activité, géolocalisation, difficultés, recommandations — plus
 * the visit photos. The API doesn't scope `/exploitations` by micro_projet_id,
 * so we fetch the list and filter client-side. `agent_id`/`prise_par_id` are the
 * connected personnel. Read-only for now (`readOnly` defaults to true) — the
 * write actions (add / edit / delete visite, add / remove photo) are hidden
 * until the field-agent flow is enabled.
 */
export function ProjectSuiviTerrain({
  projet,
  readOnly = true,
}: {
  projet: Projet;
  readOnly?: boolean;
}) {
  const { user } = useAuth();
  const { data: all, isLoading } = useExploitations();
  const create = useCreateExploitation();
  const update = useUpdateExploitation();
  const remove = useDeleteExploitation();
  const dialog = useDialogState<Exploitation>();

  const exploitations = useMemo(
    () => (all ?? []).filter((e) => e.micro_projet_id === projet.id),
    [all, projet.id],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Constats des visites terrain de ce micro-projet.
        </p>
        {!readOnly && (
          <Button size="sm" className="cursor-pointer" onClick={dialog.openCreate}>
            <Plus className="size-4" />
            Nouvelle visite
          </Button>
        )}
      </div>

      {isLoading ? (
        <LoadingState label="Chargement…" />
      ) : exploitations.length === 0 ? (
        <EmptyState
          variant="card"
          icon={MapPin}
          title="Aucune visite terrain"
          description="Enregistrez un constat de visite pour suivre l'installation et l'activité du projet."
        />
      ) : (
        <div className="space-y-4">
          {exploitations.map((e) => (
            <ExploitationCard
              key={e.id}
              exploitation={e}
              readOnly={readOnly}
              onEdit={() => dialog.openEdit(e)}
              onDelete={() => dialog.openDelete(e)}
            />
          ))}
        </div>
      )}

      {!readOnly && (
        <GenericDialogs<Exploitation>
          state={dialog}
          dialogSize="lg"
          titles={{
            create: 'Nouvelle visite terrain',
            edit: 'Modifier la visite terrain',
            delete: 'Supprimer la visite terrain',
          }}
          renderForm={({ item, close }) => (
            <DynamicForm<ExploitationInput>
              config={exploitationFormConfig}
              schema={exploitationSchema}
              defaultValues={getExploitationDefaults(item ?? undefined)}
              isLoading={create.isPending || update.isPending}
              onCancel={close}
              submitText={item ? 'Modifier' : 'Enregistrer'}
              onSubmit={(data) => {
                const payload = toPayload(data);
                if (item) {
                  update.mutate({ id: item.id, ...payload }, { onSuccess: close });
                } else {
                  create.mutate(
                    { micro_projet_id: projet.id, agent_id: user?.id ?? null, ...payload },
                    { onSuccess: close },
                  );
                }
              }}
            />
          )}
          isDeleting={remove.isPending}
          onDelete={(item) => remove.mutate(item.id, { onSuccess: () => dialog.close() })}
          deleteDescription={() =>
            'Supprimer ce constat de visite et ses photos ? Cette action est irréversible.'
          }
        />
      )}
    </div>
  );
}
