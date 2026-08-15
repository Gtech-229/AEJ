'use client';

import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { GitBranch, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  GenericTable,
  GenericDialogs,
  useDialogState,
  buildEditDeleteActionsColumn,
} from '@/components/generic';
import { DynamicForm } from '@/components/forms';
import type { WorkflowModel, WorkflowVersion } from './workflow.dto';
import { workflowVersionSchema, type WorkflowVersionInput } from './workflow.schema';
import { getWorkflowVersionFormConfig } from './workflow.form';
import { getWorkflowVersionDefaults } from './workflow.defaults';
import {
  useCreateWorkflowVersion,
  useDeleteWorkflowVersion,
  useUpdateWorkflowVersion,
  useWorkflowVersions,
} from './workflow.hooks';

/** Per-model drill-in: manage the versions (campagnes) of one workflow model. */
export function WorkflowVersionsSheet({ model }: { model: WorkflowModel }) {
  const [open, setOpen] = useState(false);
  const { data: all, isLoading } = useWorkflowVersions();
  const create = useCreateWorkflowVersion();
  const update = useUpdateWorkflowVersion();
  const del = useDeleteWorkflowVersion();
  const dialog = useDialogState<WorkflowVersion>();

  const versions = (all ?? []).filter((v) => v.workflow_code === model.code);

  const columns: ColumnDef<WorkflowVersion>[] = [
    {
      accessorKey: 'version',
      header: 'Version',
      cell: ({ row }) => <span className="font-medium">{row.original.version}</span>,
    },
    {
      accessorKey: 'name',
      header: 'Nom',
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.name}</span>,
    },
    {
      id: 'flags',
      header: '',
      cell: ({ row }) => (
        <div className="flex flex-wrap items-center gap-1">
          {row.original.is_default && <Badge variant="secondary">Défaut</Badge>}
          <Badge
            variant="outline"
            className={cn(row.original.is_active ? 'text-success' : 'text-muted-foreground')}
          >
            {row.original.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      ),
    },
    buildEditDeleteActionsColumn<WorkflowVersion>({
      onEdit: dialog.openEdit,
      onDelete: dialog.openDelete,
    }),
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="cursor-pointer">
          <GitBranch className="size-4" />
          Versions
          <Badge variant="secondary" className="ml-1">
            {versions.length}
          </Badge>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <GitBranch className="size-4 text-muted-foreground" />
            Versions — {model.name}
          </SheetTitle>
          <SheetDescription>
            Les versions (campagnes) du workflow «&nbsp;{model.code}&nbsp;».
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <GenericTable<WorkflowVersion>
            data={versions}
            columns={columns}
            isLoading={isLoading}
            showSearch={false}
            showPagination={false}
            emptyIcon={GitBranch}
            emptyTitle="Aucune version"
            emptyDescription="Créez une première version de ce workflow."
            toolbarEndSlot={
              <Button size="sm" className="cursor-pointer" onClick={dialog.openCreate}>
                <Plus className="size-4" />
                Ajouter
              </Button>
            }
          />
        </div>

        <GenericDialogs<WorkflowVersion>
          state={dialog}
          dialogSize="lg"
          titles={{
            create: 'Ajouter une version',
            edit: 'Modifier la version',
            delete: 'Supprimer la version',
          }}
          renderForm={({ item, close }) => (
            <DynamicForm<WorkflowVersionInput>
              config={getWorkflowVersionFormConfig()}
              schema={workflowVersionSchema}
              defaultValues={getWorkflowVersionDefaults(item ?? undefined)}
              isLoading={create.isPending || update.isPending}
              onCancel={close}
              submitText={item ? 'Modifier' : 'Ajouter'}
              onSubmit={(data) => {
                // The DB requires the version's own `code`; default it to the
                // backend's convention (`{workflow_code}_{version}`) when unset.
                const code = data.code?.trim() || `${model.code}_${data.version}`;
                const payload = { ...data, code, workflow_code: model.code };
                if (item) {
                  update.mutate({ ...payload, id: item.id }, { onSuccess: close });
                } else {
                  create.mutate(payload, { onSuccess: close });
                }
              }}
            />
          )}
          isDeleting={del.isPending}
          onDelete={(item) => del.mutate(item.id, { onSuccess: () => dialog.close() })}
          deleteDescription={(item) =>
            `Supprimer la version « ${item.version} » ? Cette action est irréversible.`
          }
        />
      </SheetContent>
    </Sheet>
  );
}
