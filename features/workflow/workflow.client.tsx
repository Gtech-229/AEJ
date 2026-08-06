'use client';

import { Suspense, useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
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
import type { Dossier, StatutWorkflow } from './workflow.dto';
import type { DossierInput } from './workflow.schema';
import { dossierSchema } from './workflow.schema';
import { getDossierFormConfig } from './workflow.form';
import { getDossierDefaults } from './workflow.defaults';
import { getWorkflowKpis } from './workflow.kpis';
import {
  useCreateDossier,
  useDeleteDossier,
  useWorkflow,
  useUpdateDossier,
} from './workflow.hooks';

const STATUT_CONFIG: Record<
  StatutWorkflow,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  valide: { label: 'Validé', variant: 'default' },
  attente: { label: 'En attente', variant: 'outline' },
  rejete: { label: 'Rejeté', variant: 'destructive' },
};

const FACETS: FacetedFilter[] = [
  {
    columnId: 'statut',
    title: 'Statut',
    options: Object.entries(STATUT_CONFIG).map(([value, { label }]) => ({ label, value })),
  },
];

export function WorkflowClient() {
  const { data: dossiers, isLoading } = useWorkflow();
  const createDossier = useCreateDossier();
  const updateDossier = useUpdateDossier();
  const deleteDossier = useDeleteDossier();
  const dialog = useDialogState<Dossier>();

  const kpis = useMemo(() => getWorkflowKpis(dossiers ?? []), [dossiers]);

  const columns: ColumnDef<Dossier>[] = useMemo(
    () => [
      {
        accessorKey: 'nom',
        meta: { label: 'Dossier' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Dossier" />,
        cell: ({ row }) => <span className="font-medium">{row.original.nom}</span>,
      },
      {
        accessorKey: 'etape',
        meta: { label: 'Étape actuelle' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Étape actuelle" />,
        cell: ({ row }) => row.original.etape ?? '—',
      },
      {
        accessorKey: 'responsable',
        meta: { label: 'Responsable' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Responsable" />,
        cell: ({ row }) => row.original.responsable ?? '—',
      },
      {
        accessorKey: 'depuis',
        meta: { label: 'Depuis' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Depuis" />,
        cell: ({ row }) => row.original.depuis ?? '—',
      },
      {
        accessorKey: 'statut',
        meta: { label: 'Statut' },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
        cell: ({ row }) => {
          const config = STATUT_CONFIG[row.original.statut];
          return <Badge variant={config.variant}>{config.label}</Badge>;
        },
      },
      buildEditDeleteActionsColumn<Dossier>({
        onEdit: dialog.openEdit,
        onDelete: dialog.openDelete,
      }),
    ],
    [dialog.openEdit, dialog.openDelete],
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Workflow</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Circuit de validation et étapes d'approbation des dossiers.
        </p>
      </div>

      <ListKpis items={kpis} />

      <Suspense fallback={<div className="text-sm text-muted-foreground">Chargement…</div>}>
        <GenericTable<Dossier>
          data={dossiers ?? []}
          columns={columns}
          searchKey="nom"
          searchPlaceholder="Rechercher un dossier…"
          facetedFilters={FACETS}
          isLoading={isLoading}
          toolbarEndSlot={
            <Button size="sm" onClick={dialog.openCreate}>
              <Plus className="size-4" />
              Ajouter
            </Button>
          }
        />
      </Suspense>

      <GenericDialogs<Dossier>
        state={dialog}
        dialogSize="lg"
        titles={{
          create: 'Ajouter',
          edit: 'Modifier',
          delete: 'Supprimer',
        }}
        renderForm={({ item, close }) => (
          <DynamicForm<DossierInput>
            config={getDossierFormConfig()}
            schema={dossierSchema}
            defaultValues={getDossierDefaults(item ?? undefined)}
            isLoading={createDossier.isPending || updateDossier.isPending}
            onCancel={close}
            submitText={item ? 'Modifier' : 'Ajouter'}
            onSubmit={(data) => {
              if (item) {
                updateDossier.mutate({ ...item, ...data }, { onSuccess: close });
              } else {
                createDossier.mutate(data, { onSuccess: close });
              }
            }}
          />
        )}
        isDeleting={deleteDossier.isPending}
        onDelete={(item) => deleteDossier.mutate(item.id, { onSuccess: () => dialog.close() })}
        deleteDescription={(item) =>
          `Supprimer "${item.nom}" ? Cette action est irréversible.`
        }
      />
    </div>
  );
}
