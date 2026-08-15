'use client';

import { Suspense, useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Building2, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/data-table';
import {
  GenericTable,
  GenericDialogs,
  useDialogState,
  buildEditDeleteActionsColumn,
} from '@/components/generic';
import { LoadingState } from '@/components/generic/loader';
import { DynamicForm } from '@/components/forms';
import { ManageTypeEntreprisesButton } from '@/features/type-entreprises/type-entreprises.client';
import { useTypeEntreprises } from '@/features/type-entreprises/type-entreprises.hooks';
import { useCommunes } from '@/features/localites/localites.hooks';
import type { Entreprise } from './entreprises.dto';
import { entrepriseSchema, type EntrepriseInput } from './entreprises.schema';
import { getEntrepriseFormConfig } from './entreprises.form';
import { getEntrepriseDefaults } from './entreprises.defaults';
import {
  useCreateEntreprise,
  useDeleteEntreprise,
  useEntreprises,
  useUpdateEntreprise,
} from './entreprises.hooks';

export function EntreprisesClient() {
  const { data: entreprises, isLoading } = useEntreprises();
  const { data: types } = useTypeEntreprises();
  const { data: communes } = useCommunes();
  const createEntreprise = useCreateEntreprise();
  const updateEntreprise = useUpdateEntreprise();
  const deleteEntreprise = useDeleteEntreprise();
  const dialog = useDialogState<Entreprise>();

  // Fallback resolver for the type label when the row embed is absent.
  const typeName = useMemo(() => {
    const map = new Map<number, string>();
    (types ?? []).forEach((t) => map.set(t.id, t.libelle));
    return (id: number | null) => (id == null ? '—' : (map.get(id) ?? `#${id}`));
  }, [types]);

  const columns: ColumnDef<Entreprise>[] = [
    {
      accessorKey: 'raison_sociale',
      meta: { label: 'Raison sociale' },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Raison sociale" />,
      cell: ({ row }) => <span className="font-medium">{row.original.raison_sociale}</span>,
    },
    {
      accessorKey: 'sigle',
      meta: { label: 'Sigle' },
      header: 'Sigle',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">{row.original.sigle ?? '—'}</span>
      ),
    },
    {
      accessorKey: 'type_entreprise_id',
      meta: { label: 'Type' },
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-normal">
          {row.original.type_entreprise?.libelle ?? typeName(row.original.type_entreprise_id)}
        </Badge>
      ),
    },
    {
      accessorKey: 'email',
      meta: { label: 'Email' },
      header: 'Email',
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.email ?? '—'}</span>,
    },
    {
      accessorKey: 'contact',
      meta: { label: 'Contact' },
      header: 'Contact',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.contact ?? '—'}</span>
      ),
    },
    {
      id: 'commune',
      meta: { label: 'Commune' },
      header: 'Commune',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.commune?.nom ?? '—'}</span>
      ),
    },
    buildEditDeleteActionsColumn<Entreprise>({
      onEdit: dialog.openEdit,
      onDelete: dialog.openDelete,
    }),
  ];

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 px-[2.5%] py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Entreprises</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Répertoire des entreprises partenaires (accueil de promoteurs, embauches).
        </p>
      </div>

      <Suspense fallback={<LoadingState />}>
        <GenericTable<Entreprise>
          data={entreprises ?? []}
          columns={columns}
          searchKey="raison_sociale"
          searchPlaceholder="Rechercher une entreprise…"
          isLoading={isLoading}
          emptyIcon={Building2}
          emptyTitle="Aucune entreprise"
          emptyDescription="Ajoutez une première entreprise partenaire au répertoire."
          toolbarEndSlot={
            <div className="flex items-center gap-2">
              <ManageTypeEntreprisesButton />
              <Button size="sm" className="cursor-pointer" onClick={dialog.openCreate}>
                <Plus className="size-4" />
                Nouvelle entreprise
              </Button>
            </div>
          }
        />
      </Suspense>

      <GenericDialogs<Entreprise>
        state={dialog}
        dialogSize="lg"
        titles={{
          create: 'Ajouter une entreprise',
          edit: "Modifier l'entreprise",
          delete: "Supprimer l'entreprise",
        }}
        renderForm={({ item, close }) => (
          <DynamicForm<EntrepriseInput>
            config={getEntrepriseFormConfig(types ?? [], communes ?? [])}
            schema={entrepriseSchema}
            defaultValues={getEntrepriseDefaults(item ?? undefined)}
            isLoading={createEntreprise.isPending || updateEntreprise.isPending}
            onCancel={close}
            submitText={item ? 'Modifier' : 'Ajouter'}
            onSubmit={(data) => {
              if (item) {
                updateEntreprise.mutate({ ...data, id: item.id }, { onSuccess: close });
              } else {
                createEntreprise.mutate(data, { onSuccess: close });
              }
            }}
          />
        )}
        isDeleting={deleteEntreprise.isPending}
        onDelete={(item) => deleteEntreprise.mutate(item.id, { onSuccess: () => dialog.close() })}
        deleteDescription={(item) =>
          `Supprimer l'entreprise "${item.raison_sociale}" ? Cette action est irréversible.`
        }
      />
    </div>
  );
}
