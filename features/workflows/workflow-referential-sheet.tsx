'use client';

import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import type { LucideIcon } from 'lucide-react';
import { FileCheck2, Gavel, Plus, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import {
  useCreateWorkflowDecisionOutcome,
  useCreateWorkflowDeliverable,
  useCreateWorkflowRole,
  useDeleteWorkflowDecisionOutcome,
  useDeleteWorkflowDeliverable,
  useDeleteWorkflowRole,
  useUpdateWorkflowDecisionOutcome,
  useUpdateWorkflowDeliverable,
  useUpdateWorkflowRole,
  useWorkflowDecisionOutcomes,
  useWorkflowDeliverables,
  useWorkflowRoles,
} from './workflow.hooks';

interface RefField {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
}

/** A simple code+label form for the referential dialogs. */
function RefForm({
  fields,
  item,
  isSaving,
  onCancel,
  onSubmit,
}: {
  fields: RefField[];
  item?: Record<string, unknown> | null;
  isSaving: boolean;
  onCancel: () => void;
  onSubmit: (values: Record<string, string>) => void;
}) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, String(item?.[f.name] ?? '')])),
  );
  const canSubmit = fields.every((f) => !f.required || values[f.name]?.trim());

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onSubmit(values);
      }}
      className="space-y-4"
    >
      {fields.map((f) => (
        <div key={f.name} className="space-y-1.5">
          <Label className="text-sm">
            {f.label}
            {f.required && ' *'}
          </Label>
          {f.textarea ? (
            <Textarea
              rows={2}
              value={values[f.name]}
              placeholder={f.placeholder}
              onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
            />
          ) : (
            <Input
              value={values[f.name]}
              placeholder={f.placeholder}
              onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
            />
          )}
        </div>
      ))}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={!canSubmit || isSaving} className="cursor-pointer">
          {item ? 'Modifier' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
}

/** Reusable "manage referential" side-sheet (dumb UI; the caller wires typed mutations). */
function ReferentialSheet<T extends { id: number }>({
  triggerLabel,
  title,
  description,
  icon: Icon,
  rows,
  isLoading,
  columns,
  fields,
  labelOf,
  isSaving,
  isDeleting,
  onCreate,
  onUpdate,
  onDelete,
}: {
  triggerLabel: string;
  title: string;
  description: string;
  icon: LucideIcon;
  rows: T[];
  isLoading: boolean;
  columns: ColumnDef<T>[];
  fields: RefField[];
  labelOf: (row: T) => string;
  isSaving: boolean;
  isDeleting: boolean;
  onCreate: (values: Record<string, string>, done: () => void) => void;
  onUpdate: (id: number, values: Record<string, string>, done: () => void) => void;
  onDelete: (id: number, done: () => void) => void;
}) {
  const [open, setOpen] = useState(false);
  const dialog = useDialogState<T>();

  const cols: ColumnDef<T>[] = [
    ...columns,
    buildEditDeleteActionsColumn<T>({ onEdit: dialog.openEdit, onDelete: dialog.openDelete }),
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}  >
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="cursor-pointer">
          <Icon className="size-4" />
          {triggerLabel}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[65%] !max-w-none overflow-y-auto p-8 space-y-6 sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Icon className="size-4 text-muted-foreground" />
            {title}
          </SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <GenericTable<T>
            data={rows}
            columns={cols}
            isLoading={isLoading}
            showSearch={false}
            showPagination={false}
            emptyIcon={Icon}
            emptyTitle="Aucun élément"
            emptyDescription="Créez un premier élément."
            toolbarEndSlot={
              <Button size="sm" className="cursor-pointer" onClick={dialog.openCreate}>
                <Plus className="size-4" />
                Ajouter
              </Button>
            }
          />
        </div>

        <GenericDialogs<T>
          state={dialog}
          titles={{ create: `Ajouter — ${title}`, edit: `Modifier — ${title}`, delete: 'Supprimer' }}
          renderForm={({ item, close }) => (
            <RefForm
              fields={fields}
              item={item}
              isSaving={isSaving}
              onCancel={close}
              onSubmit={(values) =>
                item ? onUpdate(item.id, values, close) : onCreate(values, close)
              }
            />
          )}
          isDeleting={isDeleting}
          onDelete={(item) => onDelete(item.id, () => dialog.close())}
          deleteDescription={(item) =>
            `Supprimer "${labelOf(item)}" ? Cette action est irréversible.`
          }
        />
      </SheetContent>
    </Sheet>
  );
}

const CODE_COL = { className: 'font-mono text-xs text-muted-foreground' };

export function WorkflowRolesSheet() {
  const { data, isLoading } = useWorkflowRoles();
  const create = useCreateWorkflowRole();
  const update = useUpdateWorkflowRole();
  const del = useDeleteWorkflowRole();
  return (
    <ReferentialSheet
      triggerLabel="Rôles"
      title="Rôles du workflow"
      description="Les acteurs qui interviennent dans les étapes (CIP, chef d'agence…)."
      icon={UserCog}
      rows={data ?? []}
      isLoading={isLoading}
      isSaving={create.isPending || update.isPending}
      isDeleting={del.isPending}
      fields={[
        { name: 'code', label: 'Code', required: true, placeholder: 'ex: CIP' },
        { name: 'name', label: 'Nom', required: true },
        { name: 'description', label: 'Description', textarea: true },
      ]}
      columns={[
        {
          accessorKey: 'name',
          header: 'Nom',
          cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
        },
        {
          accessorKey: 'code',
          header: 'Code',
          cell: ({ row }) => <span className={CODE_COL.className}>{row.original.code}</span>,
        },
      ]}
      labelOf={(r) => r.name}
      onCreate={(v, done) =>
        create.mutate(
          { code: v.code, name: v.name, description: v.description || undefined },
          { onSuccess: done },
        )
      }
      onUpdate={(id, v, done) =>
        update.mutate(
          { id, code: v.code, name: v.name, description: v.description || undefined },
          { onSuccess: done },
        )
      }
      onDelete={(id, done) => del.mutate(id, { onSuccess: done })}
    />
  );
}

export function WorkflowDeliverablesSheet() {
  const { data, isLoading } = useWorkflowDeliverables();
  const create = useCreateWorkflowDeliverable();
  const update = useUpdateWorkflowDeliverable();
  const del = useDeleteWorkflowDeliverable();
  return (
    <ReferentialSheet
      triggerLabel="Livrables"
      title="Livrables du workflow"
      description="Les pièces produites aux étapes (plan d'affaires, PV…)."
      icon={FileCheck2}
      rows={data ?? []}
      isLoading={isLoading}
      isSaving={create.isPending || update.isPending}
      isDeleting={del.isPending}
      fields={[
        { name: 'code', label: 'Code', required: true, placeholder: 'ex: PLAN_AFFAIRES' },
        { name: 'name', label: 'Nom', required: true },
        { name: 'description', label: 'Description', textarea: true },
      ]}
      columns={[
        {
          accessorKey: 'name',
          header: 'Nom',
          cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
        },
        {
          accessorKey: 'code',
          header: 'Code',
          cell: ({ row }) => <span className={CODE_COL.className}>{row.original.code}</span>,
        },
      ]}
      labelOf={(r) => r.name}
      onCreate={(v, done) =>
        create.mutate(
          { code: v.code, name: v.name, description: v.description || undefined },
          { onSuccess: done },
        )
      }
      onUpdate={(id, v, done) =>
        update.mutate(
          { id, code: v.code, name: v.name, description: v.description || undefined },
          { onSuccess: done },
        )
      }
      onDelete={(id, done) => del.mutate(id, { onSuccess: done })}
    />
  );
}

export function WorkflowDecisionOutcomesSheet() {
  const { data, isLoading } = useWorkflowDecisionOutcomes();
  const create = useCreateWorkflowDecisionOutcome();
  const update = useUpdateWorkflowDecisionOutcome();
  const del = useDeleteWorkflowDecisionOutcome();
  return (
    <ReferentialSheet
      triggerLabel="Issues de décision"
      title="Issues de décision"
      description="Les résultats possibles d'une décision (approuvé, rejeté, ajourné…)."
      icon={Gavel}
      rows={data ?? []}
      isLoading={isLoading}
      isSaving={create.isPending || update.isPending}
      isDeleting={del.isPending}
      fields={[
        { name: 'code', label: 'Code', required: true, placeholder: 'ex: APPROUVE' },
        { name: 'label', label: 'Libellé', required: true, placeholder: 'ex: Approuvé' },
      ]}
      columns={[
        {
          accessorKey: 'label',
          header: 'Libellé',
          cell: ({ row }) => <span className="font-medium">{row.original.label}</span>,
        },
        {
          accessorKey: 'code',
          header: 'Code',
          cell: ({ row }) => <span className={CODE_COL.className}>{row.original.code}</span>,
        },
      ]}
      labelOf={(r) => r.label}
      onCreate={(v, done) => create.mutate({ code: v.code, label: v.label }, { onSuccess: done })}
      onUpdate={(id, v, done) =>
        update.mutate({ id, code: v.code, label: v.label }, { onSuccess: done })
      }
      onDelete={(id, done) => del.mutate(id, { onSuccess: done })}
    />
  );
}

export function WorkflowReferentialSheets() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <WorkflowRolesSheet />
      <WorkflowDeliverablesSheet />
      <WorkflowDecisionOutcomesSheet />
    </div>
  );
}
