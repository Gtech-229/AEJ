'use client';

import { useRouter } from 'next/navigation';
import type { ColumnDef } from '@tanstack/react-table';
import { Info, Plus, Workflow } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { DataTableColumnHeader } from '@/components/data-table';
import {
  GenericTable,
  GenericDialogs,
  useDialogState,
  buildEditDeleteActionsColumn,
} from '@/components/generic';
import { DynamicForm } from '@/components/forms';
import type { WorkflowModel } from './workflow.dto';
import { workflowModelSchema, type WorkflowModelInput } from './workflow.schema';
import { getWorkflowModelFormConfig } from './workflow.form';
import { getWorkflowModelDefaults } from './workflow.defaults';
import {
  useCreateWorkflowModel,
  useDeleteWorkflowModel,
  useUpdateWorkflowModel,
  useWorkflowModels,
} from './workflow.hooks';
import { WorkflowReferentialSheets } from './workflow-referential-sheet';

export function WorkflowsClient() {
  const router = useRouter();
  const { data: models, isLoading } = useWorkflowModels();
  const create = useCreateWorkflowModel();
  const update = useUpdateWorkflowModel();
  const del = useDeleteWorkflowModel();
  const dialog = useDialogState<WorkflowModel>();

  const columns: ColumnDef<WorkflowModel>[] = [
    {
      accessorKey: 'name',
      meta: { label: 'Nom' },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nom" />,
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: 'code',
      meta: { label: 'Code' },
      header: 'Code',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">{row.original.code}</span>
      ),
    },
    {
      id: 'is_active',
      meta: { label: 'Statut' },
      header: 'Statut',
      cell: ({ row }) => {
        const active = row.original.is_active;
        return (
          <Badge
            variant="outline"
            className={cn(
              'gap-1.5',
              active ? 'border-success/30 bg-success/10 text-success' : 'text-muted-foreground',
            )}
          >
            <span
              className={cn('size-1.5 rounded-full', active ? 'bg-success' : 'bg-muted-foreground')}
            />
            {active ? 'Actif' : 'Inactif'}
          </Badge>
        );
      },
    },
    buildEditDeleteActionsColumn<WorkflowModel>({
      onEdit: dialog.openEdit,
      onDelete: dialog.openDelete,
      extraActions: (item) => (
        <DropdownMenuItem
          onClick={() => router.push(`/dashboard/parametrage/workflows/${item.code}`)}
        >
          <Info className="mr-2 size-3.5 text-muted-foreground/70" />
          À propos
        </DropdownMenuItem>
      ),
    }),
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Workflows</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Paramétrage des procédures de traitement : modèles, versions et étapes.
        </p>
      </div>

      <GenericTable<WorkflowModel>
        data={models ?? []}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Rechercher un workflow…"
        isLoading={isLoading}
        onRowClick={(m) => router.push(`/dashboard/parametrage/workflows/${m.code}`)}
        emptyIcon={Workflow}
        emptyTitle="Aucun workflow"
        emptyDescription="Créez un premier modèle de workflow."
        toolbarEndSlot={
          <div className="flex flex-wrap items-center gap-2">
            <WorkflowReferentialSheets />
            <Button size="sm" className="cursor-pointer" onClick={dialog.openCreate}>
              <Plus className="size-4" />
              Nouveau workflow
            </Button>
          </div>
        }
      />

      <GenericDialogs<WorkflowModel>
        state={dialog}
        dialogSize="lg"
        titles={{
          create: 'Ajouter un workflow',
          edit: 'Modifier le workflow',
          delete: 'Supprimer le workflow',
        }}
        renderForm={({ item, close }) => (
          <DynamicForm<WorkflowModelInput>
            config={getWorkflowModelFormConfig()}
            schema={workflowModelSchema}
            defaultValues={getWorkflowModelDefaults(item ?? undefined)}
            isLoading={create.isPending || update.isPending}
            onCancel={close}
            submitText={item ? 'Modifier' : 'Ajouter'}
            onSubmit={(data) => {
              if (item) update.mutate({ ...data, id: item.id }, { onSuccess: close });
              else create.mutate(data, { onSuccess: close });
            }}
          />
        )}
        isDeleting={del.isPending}
        onDelete={(item) => del.mutate(item.id, { onSuccess: () => dialog.close() })}
        deleteDescription={(item) =>
          `Supprimer le workflow « ${item.name} » ? Ses versions et étapes seront affectées.`
        }
      />
    </div>
  );
}
