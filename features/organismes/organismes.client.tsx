'use client';

import { Suspense, useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus, Settings } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/data-table';
import type { FacetedFilter } from '@/components/data-table';

import {
  GenericTable,
  GenericDialogs,
  useDialogState,
  buildEditDeleteActionsColumn,
} from '@/components/generic';

import { ListKpis } from '@/components/generic/list-kpis';
import { DynamicForm } from '@/components/forms';

import type { Organisme } from './organismes.dto';
import type { OrganismeInput } from './organismes.schema';

import { organismeSchema } from './organismes.schema';
import { getOrganismeFormConfig } from './organismes.form';
import { getOrganismeDefaults } from './organismes.defaults';
import { getOrganismesKpis } from './organismes.kpis';

import {
  useCreateOrganisme,
  useDeleteOrganisme,
  useOrganismes,
  useUpdateOrganisme,
} from './organismes.hooks';

// TODO: réactiver quand le module Types d'organisme sera développé
// import { useTypeOrganismes } from '../type-organismes/type-organismes.hooks';

export function OrganismesClient() {
  const { data: organismes, isLoading } = useOrganismes();

  // TODO: remplacer par useTypeOrganismes() une fois le module prêt
  const types: { id: number; nom: string }[] = [];

  const createOrganisme = useCreateOrganisme();
  const updateOrganisme = useUpdateOrganisme();
  const deleteOrganisme = useDeleteOrganisme();

  const dialog = useDialogState<Organisme>();

  const kpis = useMemo(
    () => getOrganismesKpis(organismes ?? []),
    [organismes],
  );

  const typeOptions = useMemo(
    () =>
      types.map((type) => ({
        value: type.id,
        label: type.nom,
      })),
    [types],
  );

  const FACETS: FacetedFilter[] = [
  {
    columnId: 'type',
    title: "Type d'organisme",
    options: typeOptions.map((opt) => ({
      value: String(opt.value),
      label: opt.label,
    })),
  },
];

  const columns: ColumnDef<Organisme>[] = useMemo(
    () => [
      {
        accessorKey: 'nom',
        meta: { label: 'Nom' },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Nom"
          />
        ),
        cell: ({ row }) => (
          <span className="font-medium">
            {row.original.nom}
          </span>
        ),
      },

      {
        accessorKey: 'sigle',
        meta: { label: 'Sigle' },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Sigle"
          />
        ),
        cell: ({ row }) => (
          row.original.sigle ?? '—'
        ),
      },

      {
        accessorKey: 'type',
        meta: { label: 'Type' },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Type"
          />
        ),
        cell: ({ row }) => {
          const type = types.find(
            (t) => t.id === row.original.type,
          );

          return (
            <Badge variant="secondary">
              {type?.nom ?? '—'}
            </Badge>
          );
        },
      },

      {
        accessorKey: 'telephone',
        meta: { label: 'Téléphone' },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Téléphone"
          />
        ),
        cell: ({ row }) =>
          row.original.telephone ?? '—',
      },

      {
        accessorKey: 'email',
        meta: { label: 'Email' },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Email"
          />
        ),
        cell: ({ row }) =>
          row.original.email ?? '—',
      },

      {
        accessorKey: 'site_web',
        meta: { label: 'Site web' },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Site web"
          />
        ),
        cell: ({ row }) =>
          row.original.site_web ? (
            <a
              href={row.original.site_web}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              Visiter
            </a>
          ) : (
            '—'
          ),
      },

      buildEditDeleteActionsColumn<Organisme>({
        onEdit: dialog.openEdit,
        onDelete: dialog.openDelete,
      }),
    ],
    [
      dialog.openEdit,
      dialog.openDelete,
      types,
    ],
  );
    return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Organismes
        </h1>

        <p className="mt-0.5 text-sm text-muted-foreground">
          Gérez les organismes partenaires de la plateforme.
        </p>
      </div>

      <ListKpis items={kpis} />

      <Suspense
        fallback={
          <div className="text-sm text-muted-foreground">
            Chargement...
          </div>
        }
      >
        <GenericTable<Organisme>
          data={organismes ?? []}
          columns={columns}
          searchKey="nom"
          searchPlaceholder="Rechercher un organisme..."
          facetedFilters={FACETS}
          isLoading={isLoading}
          toolbarEndSlot={
            <div className="flex items-center gap-2">

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // TODO :
                  // Ouvrir la gestion des types d'organisme
                }}
              >
                <Settings className="size-4" />
                Types d'organisme
              </Button>

              <Button
                size="sm"
                onClick={dialog.openCreate}
              >
                <Plus className="size-4" />
                Ajouter
              </Button>

            </div>
          }
        />
      </Suspense>

      <GenericDialogs<Organisme>
        state={dialog}
        dialogSize="xl"
        titles={{
          create: "Ajouter un organisme",
          edit: "Modifier l'organisme",
          delete: "Supprimer l'organisme",
        }}
                renderForm={({ item, close }) => (
          <DynamicForm<OrganismeInput>
            config={getOrganismeFormConfig(typeOptions)}
            schema={organismeSchema}
            defaultValues={getOrganismeDefaults(item ?? undefined)}
            isLoading={
              createOrganisme.isPending ||
              updateOrganisme.isPending
            }
            onCancel={close}
            submitText={
              item ? 'Modifier' : 'Ajouter'
            }
            onSubmit={(data) => {
              if (item) {
                updateOrganisme.mutate(
                  {
                    ...item,
                    ...data,
                  },
                  {
                    onSuccess: close,
                  },
                );
              } else {
                createOrganisme.mutate(data, {
                  onSuccess: close,
                });
              }
            }}
          />
        )}
        isDeleting={deleteOrganisme.isPending}
        onDelete={(item) =>
          deleteOrganisme.mutate(item.id, {
            onSuccess: () => dialog.close(),
          })
        }
        deleteDescription={(item) =>
          `Supprimer l'organisme "${item.nom}" ? Cette action est irréversible.`
        }
      />
    </div>
  );
}