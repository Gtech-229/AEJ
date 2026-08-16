'use client';

import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Boxes, FolderGit2, MapPin, Plus, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DynamicForm } from '@/components/forms';
import {
  GenericTable,
  GenericDialogs,
  buildEditDeleteActionsColumn,
  useDialogState,
} from '@/components/generic';
import { useFormatMontant } from '@/features/configurations/configurations.hooks';
import { useSecteurs } from '@/features/secteurs/secteurs.hooks';
// Programmes
import type { MegaProjet } from '@/features/mega-projets/mega-projets.dto';
import {
  useMegaProjets,
  useCreateMegaProjet,
  useUpdateMegaProjet,
  useDeleteMegaProjet,
} from '@/features/mega-projets/mega-projets.hooks';
import { getMegaProjetFormConfig } from '@/features/mega-projets/mega-projets.form';
import { megaProjetSchema, type MegaProjetInput } from '@/features/mega-projets/mega-projets.schema';
import { getMegaProjetDefaults } from '@/features/mega-projets/mega-projets.defaults';
import { ProgrammeDetailSheet } from './programme-detail-sheet';
// Dispositifs
import type { Dispositif } from '@/features/dispositifs/dispositifs.dto';
import {
  useDispositifs,
  useCreateDispositif,
  useUpdateDispositif,
  useDeleteDispositif,
} from '@/features/dispositifs/dispositifs.hooks';
import { getDispositifFormConfig } from '@/features/dispositifs/dispositifs.form';
import { dispositifSchema, type DispositifInput } from '@/features/dispositifs/dispositifs.schema';
import {
  getDispositifDefaults,
  toDispositifPayload,
} from '@/features/dispositifs/dispositifs.defaults';
// Zones
import type { ZoneIntervention } from '@/features/zones-intervention/zones-intervention.dto';
import {
  useZones,
  useCreateZone,
  useUpdateZone,
  useDeleteZone,
} from '@/features/zones-intervention/zones-intervention.hooks';
import { getZoneFormConfig } from '@/features/zones-intervention/zones-intervention.form';
import { zoneSchema, type ZoneInput } from '@/features/zones-intervention/zones-intervention.schema';
import { getZoneDefaults, toZonePayload } from '@/features/zones-intervention/zones-intervention.defaults';

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button size="sm" className="cursor-pointer" onClick={onClick}>
      <Plus className="size-4" />
      {label}
    </Button>
  );
}

// ── Programmes (mega-projets) ─────────────────────────────────────────────────
function ProgrammesSection() {
  const list = useMegaProjets();
  const secteurs = useSecteurs();
  const dispositifs = useDispositifs();
  const zones = useZones();
  const create = useCreateMegaProjet();
  const update = useUpdateMegaProjet();
  const remove = useDeleteMegaProjet();
  const dialog = useDialogState<MegaProjet>();
  const [detail, setDetail] = useState<MegaProjet | null>(null);

  const columns: ColumnDef<MegaProjet>[] = [
    {
      accessorKey: 'titre',
      meta: { label: 'Titre' },
      header: 'Titre',
      cell: ({ row }) => <span className="font-medium">{row.original.titre}</span>,
    },
    {
      id: 'secteur',
      meta: { label: 'Secteur' },
      header: 'Secteur',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.secteur?.libelle ?? '—'}</span>
      ),
    },
    buildEditDeleteActionsColumn<MegaProjet>({ onEdit: dialog.openEdit, onDelete: dialog.openDelete }),
  ];

  return (
    <>
      <GenericTable<MegaProjet>
        data={list.data ?? []}
        columns={columns}
        searchKey="titre"
        searchPlaceholder="Rechercher un projet…"
        isLoading={list.isLoading}
        emptyIcon={FolderGit2}
        emptyTitle="Aucun projet"
        emptyDescription="Créez un premier projet (cadre) de financement."
        onRowClick={(row) => setDetail(row)}
        toolbarEndSlot={<AddButton label="Nouveau projet" onClick={dialog.openCreate} />}
      />
      <ProgrammeDetailSheet
        programme={detail}
        dispositif={(dispositifs.data ?? []).find((d) => d.projet_id === detail?.id)}
        zones={(zones.data ?? []).filter((z) => z.projet_id === detail?.id)}
        onOpenChange={(open) => !open && setDetail(null)}
      />
      <GenericDialogs<MegaProjet>
        state={dialog}
        titles={{ create: 'Nouveau projet', edit: 'Modifier le projet', delete: 'Supprimer le projet' }}
        renderForm={({ item, close }) => (
          <DynamicForm<MegaProjetInput>
            config={getMegaProjetFormConfig(secteurs.data ?? [])}
            schema={megaProjetSchema}
            defaultValues={getMegaProjetDefaults(item ?? undefined)}
            isLoading={create.isPending || update.isPending}
            onCancel={close}
            submitText={item ? 'Modifier' : 'Créer'}
            onSubmit={(data) => {
              if (item) update.mutate({ id: item.id, ...data }, { onSuccess: close });
              else create.mutate(data, { onSuccess: close });
            }}
          />
        )}
        isDeleting={remove.isPending}
        onDelete={(item) => remove.mutate(item.id, { onSuccess: () => dialog.close() })}
        deleteDescription={(item) => `Supprimer le projet "${item.titre}" ? Ses dispositifs et zones seront aussi supprimés.`}
      />
    </>
  );
}

// ── Dispositifs ───────────────────────────────────────────────────────────────
function DispositifsSection() {
  const list = useDispositifs();
  const programmes = useMegaProjets();
  const formatMontant = useFormatMontant();
  const create = useCreateDispositif();
  const update = useUpdateDispositif();
  const remove = useDeleteDispositif();
  const dialog = useDialogState<Dispositif>();

  const columns: ColumnDef<Dispositif>[] = [
    {
      accessorKey: 'intitule',
      meta: { label: 'Intitulé' },
      header: 'Intitulé',
      cell: ({ row }) => (
        <div className="min-w-0">
          <span className="font-medium">{row.original.intitule}</span>
          <span className="block font-mono text-xs text-muted-foreground">{row.original.code}</span>
        </div>
      ),
    },
    {
      id: 'programme',
      meta: { label: 'Projet' },
      header: 'Projet',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.projet?.titre ?? `#${row.original.projet_id}`}</span>
      ),
    },
    {
      id: 'budget',
      meta: { label: 'Budget alloué' },
      header: 'Budget alloué',
      cell: ({ row }) => <span className="font-medium">{formatMontant(row.original.budget_alloue)}</span>,
    },
    {
      id: 'previsions',
      meta: { label: 'Prévisions' },
      header: 'Prévisions',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="font-normal">
            {row.original.nbre_emplois_prevu} emplois
          </Badge>
          <Badge variant="outline" className="font-normal">
            {row.original.nbre_beneficiaire_prevu} bénéf.
          </Badge>
          <Badge variant="outline" className="font-normal">
            {row.original.nbre_micro_projet_prevu} µ-projets
          </Badge>
        </div>
      ),
    },
    buildEditDeleteActionsColumn<Dispositif>({ onEdit: dialog.openEdit, onDelete: dialog.openDelete }),
  ];

  return (
    <>
      <GenericTable<Dispositif>
        data={list.data ?? []}
        columns={columns}
        searchKey="intitule"
        searchPlaceholder="Rechercher un dispositif…"
        isLoading={list.isLoading}
        emptyIcon={Boxes}
        emptyTitle="Aucun dispositif"
        emptyDescription="Créez un dispositif rattaché à un projet."
        toolbarEndSlot={<AddButton label="Nouveau dispositif" onClick={dialog.openCreate} />}
      />
      <GenericDialogs<Dispositif>
        state={dialog}
        dialogSize="lg"
        titles={{ create: 'Nouveau dispositif', edit: 'Modifier le dispositif', delete: 'Supprimer le dispositif' }}
        renderForm={({ item, close }) => (
          <DynamicForm<DispositifInput>
            config={getDispositifFormConfig(programmes.data ?? [])}
            schema={dispositifSchema}
            defaultValues={getDispositifDefaults(item ?? undefined)}
            isLoading={create.isPending || update.isPending}
            onCancel={close}
            submitText={item ? 'Modifier' : 'Créer'}
            onSubmit={(data) => {
              const payload = toDispositifPayload(data);
              if (item) update.mutate({ id: item.id, ...payload }, { onSuccess: close });
              else create.mutate(payload, { onSuccess: close });
            }}
          />
        )}
        isDeleting={remove.isPending}
        onDelete={(item) => remove.mutate(item.id, { onSuccess: () => dialog.close() })}
        deleteDescription={(item) => `Supprimer le dispositif "${item.intitule}" ? Cette action est irréversible.`}
      />
    </>
  );
}

// ── Zones d'intervention ──────────────────────────────────────────────────────
function ZonesSection() {
  const list = useZones();
  const programmes = useMegaProjets();
  const create = useCreateZone();
  const update = useUpdateZone();
  const remove = useDeleteZone();
  const dialog = useDialogState<ZoneIntervention>();

  const columns: ColumnDef<ZoneIntervention>[] = [
    {
      accessorKey: 'adresse',
      meta: { label: 'Adresse' },
      header: 'Adresse',
      cell: ({ row }) => <span className="font-medium">{row.original.adresse ?? '—'}</span>,
    },
    {
      id: 'programme',
      meta: { label: 'Projet' },
      header: 'Projet',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.projet?.titre ?? `#${row.original.projet_id}`}</span>
      ),
    },
    {
      id: 'gps',
      meta: { label: 'Géolocalisation' },
      header: 'Géolocalisation',
      cell: ({ row }) => {
        const { latitude: la, longitude: lo } = row.original;
        if (la == null || lo == null) return <span className="text-muted-foreground">—</span>;
        return (
          <a
            href={`https://www.google.com/maps?q=${la},${lo}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <MapPin className="size-3.5" />
            {Number(la).toFixed(4)}, {Number(lo).toFixed(4)}
          </a>
        );
      },
    },
    buildEditDeleteActionsColumn<ZoneIntervention>({ onEdit: dialog.openEdit, onDelete: dialog.openDelete }),
  ];

  return (
    <>
      <GenericTable<ZoneIntervention>
        data={list.data ?? []}
        columns={columns}
        searchKey="adresse"
        searchPlaceholder="Rechercher une zone…"
        isLoading={list.isLoading}
        emptyIcon={MapPin}
        emptyTitle="Aucune zone"
        emptyDescription="Ajoutez une zone d'intervention à un projet."
        toolbarEndSlot={<AddButton label="Nouvelle zone" onClick={dialog.openCreate} />}
      />
      <GenericDialogs<ZoneIntervention>
        state={dialog}
        titles={{ create: "Nouvelle zone d'intervention", edit: 'Modifier la zone', delete: 'Supprimer la zone' }}
        renderForm={({ item, close }) => (
          <DynamicForm<ZoneInput>
            config={getZoneFormConfig(programmes.data ?? [])}
            schema={zoneSchema}
            defaultValues={getZoneDefaults(item ?? undefined)}
            isLoading={create.isPending || update.isPending}
            onCancel={close}
            submitText={item ? 'Modifier' : 'Créer'}
            onSubmit={(data) => {
              const payload = toZonePayload(data);
              if (item) update.mutate({ id: item.id, ...payload }, { onSuccess: close });
              else create.mutate(payload, { onSuccess: close });
            }}
          />
        )}
        isDeleting={remove.isPending}
        onDelete={(item) => remove.mutate(item.id, { onSuccess: () => dialog.close() })}
        deleteDescription={() => 'Supprimer cette zone d\'intervention ? Cette action est irréversible.'}
      />
    </>
  );
}

const TABS = [
  { value: 'programmes', label: 'Projets', icon: FolderGit2, content: <ProgrammesSection /> },
  { value: 'dispositifs', label: 'Dispositifs', icon: Boxes, content: <DispositifsSection /> },
  { value: 'zones', label: "Zones d'intervention", icon: MapPin, content: <ZonesSection /> },
];

/**
 * Paramétrage du cadre de financement : projets (mega-projets), leurs dispositifs
 * (budget + emplois/bénéficiaires/micro-projets prévus) et zones d'intervention.
 * (Les guichets sont désormais un module dédié — /dashboard/guichets.)
 */
export function ProjetsParametrageClient() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <Layers className="size-6 text-primary" /> Projets & dispositifs
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Paramétrez les projets, dispositifs et zones d'intervention.
        </p>
      </div>

      <Tabs defaultValue={TABS[0].value} className="w-full">
        <TabsList variant="solid" className="flex h-auto flex-wrap justify-start">
          {TABS.map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value} className="cursor-pointer gap-1.5">
              <Icon className="size-4" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map(({ value, content }) => (
          <TabsContent key={value} value={value} className="mt-4">
            {content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
