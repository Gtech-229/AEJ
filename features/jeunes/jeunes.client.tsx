'use client';

import { Suspense, useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/data-table';
import {
  GenericTable,
  GenericDialogs,
  useDialogState,
  buildEditDeleteActionsColumn,
} from '@/components/generic';
import { DynamicForm } from '@/components/forms';
import {
  useSecteurs,
  useSousSecteurs,
  useNiveauxEtudes,
  useAgencesRegionales,
  useTypesPiecesIdentites,
  useSituationsMatrimoniales,
} from '@/features/referentials/referentials.hooks';
import type { Jeune, Sexe } from './jeunes.dto';
import { jeuneSchema, type JeuneInput } from './jeunes.schema';
import { getJeuneFormConfig } from './jeunes.form';
import { getJeuneDefaults } from './jeunes.defaults';
import { useCreateJeune, useDeleteJeune, useJeunes, useUpdateJeune } from './jeunes.hooks';

export function JeunesClient() {
  const { data: jeunes, isLoading } = useJeunes();
  const createJeune = useCreateJeune();
  const updateJeune = useUpdateJeune();
  const deleteJeune = useDeleteJeune();
  const dialog = useDialogState<Jeune>();

  // Referentials backing the fiche's selects (from the AEJ v1.0 API).
  const { data: piecesIdentites } = useTypesPiecesIdentites();
  const { data: situationsMatrimoniales } = useSituationsMatrimoniales();
  const { data: secteurs } = useSecteurs();
  const { data: sousSecteurs } = useSousSecteurs();
  const { data: niveauxEtudes } = useNiveauxEtudes();
  const { data: agencesRegionales } = useAgencesRegionales();
  const formConfig = getJeuneFormConfig({
    piecesIdentites: piecesIdentites ?? [],
    situationsMatrimoniales: situationsMatrimoniales ?? [],
    secteurs: secteurs ?? [],
    sousSecteurs: sousSecteurs ?? [],
    niveauxEtudes: niveauxEtudes ?? [],
    agencesRegionales: agencesRegionales ?? [],
  });

  const columns: ColumnDef<Jeune>[] = useMemo(
    () => [
      {
        accessorKey: 'matriculeaej',
        meta: { label: 'Matricule' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Matricule" />,
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">
            {row.original.matriculeaej ?? '—'}
          </span>
        ),
      },
      {
        id: 'nom',
        accessorFn: (j) => `${j.prenom} ${j.nom}`,
        meta: { label: 'Nom complet' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nom complet" />,
        cell: ({ row }) => (
          <span className="font-medium">
            {row.original.prenom} {row.original.nom}
          </span>
        ),
      },
      {
        accessorKey: 'telephone',
        meta: { label: 'Téléphone' },
        header: 'Téléphone',
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.telephone}</span>,
      },
      {
        accessorKey: 'email',
        meta: { label: 'Email' },
        header: 'Email',
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.email ?? '—'}</span>
        ),
      },
      {
        accessorKey: 'sexe',
        meta: { label: 'Sexe' },
        header: 'Sexe',
        cell: ({ row }) => (row.original.sexe === 'FEMININ' ? 'Féminin' : 'Masculin'),
      },
      {
        id: 'statut',
        accessorFn: (j) => String(Number(j.statut ?? 1)),
        meta: { label: 'Statut' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
        cell: ({ row }) => {
          const actif = (row.original.statut ?? 1) !== 0;
          return (
            <Badge
              variant="outline"
              className={cn(
                'gap-1.5',
                actif ? 'border-success/30 bg-success/10 text-success' : 'text-muted-foreground',
              )}
            >
              <span
                className={cn('size-1.5 rounded-full', actif ? 'bg-success' : 'bg-muted-foreground')}
              />
              {actif ? 'Actif' : 'Inactif'}
            </Badge>
          );
        },
      },
      buildEditDeleteActionsColumn<Jeune>({
        onEdit: dialog.openEdit,
        onDelete: dialog.openDelete,
      }),
    ],
    [dialog.openEdit, dialog.openDelete],
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Jeunes bénéficiaires</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Fiche et suivi des jeunes bénéficiaires du programme.
        </p>
      </div>

      <Suspense fallback={<div className="text-sm text-muted-foreground">Chargement…</div>}>
        <GenericTable<Jeune>
          data={jeunes ?? []}
          columns={columns}
          searchKey="nom"
          searchPlaceholder="Rechercher un jeune…"
          isLoading={isLoading}
          emptyIcon={Users}
          emptyTitle="Aucun jeune"
          emptyDescription="Enregistrez un premier jeune bénéficiaire pour commencer le suivi."
          toolbarEndSlot={
            <Button size="sm" onClick={dialog.openCreate}>
              <Plus className="size-4" />
              Ajouter
            </Button>
          }
        />
      </Suspense>

      <GenericDialogs<Jeune>
        state={dialog}
        dialogSize="2xl"
        titles={{
          create: 'Ajouter un jeune',
          edit: 'Modifier la fiche du jeune',
          delete: 'Supprimer le jeune',
        }}
        renderForm={({ item, close }) => (
          <DynamicForm<JeuneInput>
            config={formConfig}
            schema={jeuneSchema}
            defaultValues={getJeuneDefaults(item ?? undefined)}
            isLoading={createJeune.isPending || updateJeune.isPending}
            onCancel={close}
            submitText={item ? 'Modifier' : 'Ajouter'}
            onSubmit={(data) => {
              // `sexe` is validated non-empty by the schema.
              const payload = { ...data, sexe: data.sexe as Sexe };
              if (item) {
                updateJeune.mutate({ ...payload, id: item.id }, { onSuccess: close });
              } else {
                createJeune.mutate(payload, { onSuccess: close });
              }
            }}
          />
        )}
        isDeleting={deleteJeune.isPending}
        onDelete={(item) => deleteJeune.mutate(item.id, { onSuccess: () => dialog.close() })}
        deleteDescription={(item) =>
          `Supprimer ${item.prenom} ${item.nom} ? Cette action est irréversible.`
        }
      />
    </div>
  );
}
