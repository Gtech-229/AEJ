'use client';

import { useRouter } from 'next/navigation';
import type { ColumnDef } from '@tanstack/react-table';
import { Landmark, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DynamicForm } from '@/components/forms';
import {
  GenericTable,
  GenericDialogs,
  buildEditDeleteActionsColumn,
  useDialogState,
} from '@/components/generic';
import { DataTableColumnHeader } from '@/components/data-table';
import { useFormatMontant } from '@/features/configurations/configurations.hooks';
import { useWorkflowModels } from '@/features/workflows/workflow.hooks';
import type { Guichet } from './guichets.dto';
import {
  useGuichets,
  useCreateGuichet,
  useUpdateGuichet,
  useDeleteGuichet,
} from './guichets.hooks';
import { getGuichetFormConfig } from './guichets.form';
import { guichetSchema, type GuichetInput } from './guichets.schema';
import { getGuichetDefaults, toGuichetPayload } from './guichets.defaults';

/**
 * Guichets de financement — standalone module. Each guichet defines a montant
 * range, a display colour, and the **workflow** (circuit) a routed dossier
 * follows. Wide layout so the table breathes.
 */
export function GuichetsClient() {
  const router = useRouter();
  const list = useGuichets();
  const workflows = useWorkflowModels();
  const formatMontant = useFormatMontant();
  const create = useCreateGuichet();
  const update = useUpdateGuichet();
  const remove = useDeleteGuichet();
  const dialog = useDialogState<Guichet>();

  const columns: ColumnDef<Guichet>[] = [
    {
      accessorKey: 'code',
      meta: { label: 'Code' },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span
            className="size-3 shrink-0 rounded-full border border-border"
            style={{ backgroundColor: row.original.couleur ?? 'transparent' }}
          />
          <span className="font-mono text-xs text-muted-foreground">{row.original.code}</span>
        </div>
      ),
    },
    {
      accessorKey: 'libelle',
      meta: { label: 'Libellé' },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Libellé" />,
      cell: ({ row }) => <span className="font-medium">{row.original.libelle}</span>,
    },
    {
      id: 'workflow',
      meta: { label: 'Workflow' },
      header: 'Workflow',
      cell: ({ row }) => {
        const w = row.original.workflow;
        const code = row.original.workflow_code;
        if (!w && !code) return <span className="text-muted-foreground">—</span>;
        return (
          <span className="inline-flex items-center gap-1.5">
            {/* <WorkflowIcon className="size-3.5 text-muted-foreground" /> */}
            <span className="text-sm">{code}</span>
          </span>
        );
      },
    },
    {
      id: 'montant',
      meta: { label: 'Montant' },
      header: 'Montant',
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-muted-foreground">
          {formatMontant(row.original.montant_min)} – {formatMontant(row.original.montant_max)}
        </span>
      ),
    },
    {
      id: 'statut',
      meta: { label: 'Statut' },
      header: 'Statut',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          <Badge
            variant="outline"
            className={
              row.original.is_active
                ? 'border-success/30 bg-success/10 font-normal text-success'
                : 'font-normal text-muted-foreground'
            }
          >
            {row.original.is_active ? 'Actif' : 'Inactif'}
          </Badge>
          {/* {row.original.is_form_active && (
            <Badge variant="outline" className="font-normal text-muted-foreground">
              Formulaire actif
            </Badge>
          )} */}
        </div>
      ),
    },
    buildEditDeleteActionsColumn<Guichet>({ onEdit: dialog.openEdit, onDelete: dialog.openDelete }),
  ];

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 px-6 py-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <Landmark className="size-6 text-primary" /> Guichets
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Guichets de financement : plage de montant, workflow (circuit) et disponibilité.
        </p>
      </div>

      <GenericTable<Guichet>
        data={list.data ?? []}
        columns={columns}
        searchKey="libelle"
        searchPlaceholder="Rechercher un guichet…"
        isLoading={list.isLoading}
        emptyIcon={Landmark}
        emptyTitle="Aucun guichet"
        emptyDescription="Créez un guichet de financement."
        onRowClick={(g) => router.push(`/dashboard/guichets/${g.id}`)}
        toolbarEndSlot={
          <Button size="sm" className="cursor-pointer" onClick={dialog.openCreate}>
            <Plus className="size-4" />
            Nouveau guichet
          </Button>
        }
      />

      <GenericDialogs<Guichet>
        state={dialog}
        dialogSize="lg"
        titles={{ create: 'Nouveau guichet', edit: 'Modifier le guichet', delete: 'Supprimer le guichet' }}
        renderForm={({ item, close }) => (
          <DynamicForm<GuichetInput>
            config={getGuichetFormConfig(workflows.data ?? [])}
            schema={guichetSchema}
            defaultValues={getGuichetDefaults(item ?? undefined)}
            isLoading={create.isPending || update.isPending}
            onCancel={close}
            submitText={item ? 'Modifier' : 'Créer'}
            onSubmit={(data) => {
              const payload = toGuichetPayload(data);
              if (item) update.mutate({ id: item.id, ...payload }, { onSuccess: close });
              else create.mutate(payload, { onSuccess: close });
            }}
          />
        )}
        isDeleting={remove.isPending}
        onDelete={(item) => remove.mutate(item.id, { onSuccess: () => dialog.close() })}
        deleteDescription={(item) => `Supprimer le guichet "${item.libelle}" ? Cette action est irréversible.`}
      />
    </div>
  );
}
