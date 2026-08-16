'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import type { LucideIcon } from 'lucide-react';
import { Clock, FileCheck2, Gavel, Settings2, UserCog, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  GenericTable,
  GenericDialogs,
  useDialogState,
  buildEditDeleteActionsColumn,
} from '@/components/generic';
import type {
  WorkflowEtape,
  WorkflowEtapeDecision,
  WorkflowEtapeDeliverable,
  WorkflowEtapeRole,
  WorkflowEtapeSla,
} from './workflow.dto';
import {
  useCreateWorkflowEtapeDecision,
  useCreateWorkflowEtapeDeliverable,
  useCreateWorkflowEtapeRole,
  useCreateWorkflowEtapeSla,
  useDeleteWorkflowEtapeDecision,
  useDeleteWorkflowEtapeDeliverable,
  useDeleteWorkflowEtapeRole,
  useDeleteWorkflowEtapeSla,
  useUpdateWorkflowEtapeDecision,
  useUpdateWorkflowEtapeDeliverable,
  useUpdateWorkflowEtapeRole,
  useUpdateWorkflowEtapeSla,
  useWorkflowDecisionOutcomes,
  useWorkflowDeliverables,
  useWorkflowEtapeDecisions,
  useWorkflowEtapeDeliverables,
  useWorkflowEtapeRoles,
  useWorkflowEtapeSlas,
  useWorkflowRoles,
} from './workflow.hooks';

const DURATION_UNITS = ['JOURS', 'HEURES', 'SEMAINES', 'MOIS'];
/** Verified live (2026-08): the backend only accepts these `delay_type` values. */
const DELAY_TYPES = ['FIXE', 'RELATIF'];

/** Titled section = header + list + create/edit dialog. The section owns its dialog. */
function SectionShell<T extends { id: number }>({
  title,
  icon: Icon,
  addLabel,
  rows,
  isLoading,
  columns,
  emptyText,
  dialog,
  renderForm,
  isDeleting,
  onDelete,
  labelOf,
}: {
  title: string;
  icon: LucideIcon;
  addLabel: string;
  rows: T[];
  isLoading: boolean;
  columns: ColumnDef<T>[];
  emptyText: string;
  dialog: ReturnType<typeof useDialogState<T>>;
  renderForm: (args: { item: T | null; close: () => void }) => ReactNode;
  isDeleting: boolean;
  onDelete: (item: T, done: () => void) => void;
  labelOf: (row: T) => string;
}) {
  const cols: ColumnDef<T>[] = [
    ...columns,
    buildEditDeleteActionsColumn<T>({ onEdit: dialog.openEdit, onDelete: dialog.openDelete }),
  ];
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <Icon className="size-4 text-muted-foreground" />
          {title}
        </h3>
        <Button
          size="sm"
          variant="outline"
          className="cursor-pointer"
          onClick={dialog.openCreate}
        >
          <Plus className="size-4" />
          {addLabel}
        </Button>
      </div>
      <GenericTable<T>
        data={rows}
        columns={cols}
        isLoading={isLoading}
        showSearch={false}
        showPagination={false}
        emptyIcon={Icon}
        emptyTitle={emptyText}
        emptyDescription=""
      />
      <GenericDialogs<T>
        state={dialog}
        titles={{ create: `Ajouter — ${title}`, edit: `Modifier — ${title}`, delete: 'Supprimer' }}
        renderForm={renderForm}
        isDeleting={isDeleting}
        onDelete={(item) => onDelete(item, () => dialog.close())}
        deleteDescription={(item) => `Supprimer « ${labelOf(item)} » ? Cette action est irréversible.`}
      />
    </section>
  );
}

function FieldRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function FormActions({
  item,
  isSaving,
  onCancel,
  disabled,
}: {
  item?: unknown;
  isSaving: boolean;
  onCancel: () => void;
  disabled: boolean;
}) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Annuler
      </Button>
      <Button type="submit" disabled={disabled || isSaving} className="cursor-pointer">
        {item ? 'Modifier' : 'Ajouter'}
      </Button>
    </div>
  );
}

// ── SLA section ──────────────────────────────────────────────────────────────
function SlaSection({ etape }: { etape: WorkflowEtape }) {
  const { data: all, isLoading } = useWorkflowEtapeSlas();
  const create = useCreateWorkflowEtapeSla();
  const update = useUpdateWorkflowEtapeSla();
  const del = useDeleteWorkflowEtapeSla();
  const dialog = useDialogState<WorkflowEtapeSla>();
  const rows = (all ?? []).filter((r) => r.etape_code === etape.code);

  const columns: ColumnDef<WorkflowEtapeSla>[] = [
    {
      id: 'duree',
      header: 'Délai',
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.duration_value} {row.original.duration_unit}
        </span>
      ),
    },
    {
      accessorKey: 'delay_type',
      header: 'Type',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.delay_type ?? '—'}</span>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.description ?? '—'}</span>
      ),
    },
  ];

  return (
    <SectionShell
      title="Délai (SLA)"
      icon={Clock}
      addLabel="Ajouter"
      rows={rows}
      isLoading={isLoading}
      columns={columns}
      emptyText="Aucun délai défini"
      dialog={dialog}
      isDeleting={del.isPending}
      onDelete={(item, done) => del.mutate(item.id, { onSuccess: done })}
      labelOf={(r) => `${r.duration_value} ${r.duration_unit}`}
      renderForm={({ item, close }) => (
        <SlaForm
          item={item}
          isSaving={create.isPending || update.isPending}
          onCancel={close}
          onSubmit={(v) => {
            const payload = {
              etape_code: etape.code,
              duration_value: Number(v.duration_value),
              duration_unit: v.duration_unit,
              delay_type: v.delay_type,
              description: v.description || undefined,
            };
            if (item) update.mutate({ ...payload, id: item.id }, { onSuccess: close });
            else create.mutate(payload, { onSuccess: close });
          }}
        />
      )}
    />
  );
}

function SlaForm({
  item,
  isSaving,
  onCancel,
  onSubmit,
}: {
  item?: WorkflowEtapeSla | null;
  isSaving: boolean;
  onCancel: () => void;
  onSubmit: (v: Record<string, string>) => void;
}) {
  const [v, setV] = useState<Record<string, string>>(() => ({
    duration_value: String(item?.duration_value ?? ''),
    duration_unit: item?.duration_unit ?? 'JOURS',
    delay_type: item?.delay_type ?? 'FIXE',
    description: item?.description ?? '',
  }));
  const set = (k: string, val: string) => setV((s) => ({ ...s, [k]: val }));
  const ok = !!v.duration_value && !!v.duration_unit && !!v.delay_type.trim();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (ok) onSubmit(v);
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <FieldRow label="Valeur *">
          <Input
            type="number"
            min={0}
            value={v.duration_value}
            onChange={(e) => set('duration_value', e.target.value)}
          />
        </FieldRow>
        <FieldRow label="Unité *">
          <Select value={v.duration_unit} onValueChange={(val) => set('duration_unit', val)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DURATION_UNITS.map((u) => (
                <SelectItem key={u} value={u}>
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldRow>
      </div>
      <FieldRow label="Type de délai *">
        <Select value={v.delay_type} onValueChange={(val) => set('delay_type', val)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DELAY_TYPES.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldRow>
      <FieldRow label="Description">
        <Textarea
          rows={2}
          value={v.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </FieldRow>
      <FormActions item={item} isSaving={isSaving} onCancel={onCancel} disabled={!ok} />
    </form>
  );
}

// ── Deliverables section ─────────────────────────────────────────────────────
function DeliverablesSection({ etape }: { etape: WorkflowEtape }) {
  const { data: all, isLoading } = useWorkflowEtapeDeliverables();
  const { data: refs } = useWorkflowDeliverables();
  const create = useCreateWorkflowEtapeDeliverable();
  const update = useUpdateWorkflowEtapeDeliverable();
  const del = useDeleteWorkflowEtapeDeliverable();
  const dialog = useDialogState<WorkflowEtapeDeliverable>();
  const rows = (all ?? []).filter((r) => r.etape_code === etape.code);

  const columns: ColumnDef<WorkflowEtapeDeliverable>[] = [
    {
      id: 'name',
      header: 'Livrable',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name ?? row.original.deliverable_code}</span>
      ),
    },
    {
      accessorKey: 'deliverable_code',
      header: 'Code',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.original.deliverable_code ?? '—'}
        </span>
      ),
    },
    {
      id: 'required',
      header: () => null,
      cell: ({ row }) =>
        row.original.is_required ? (
          <Badge variant="outline" className="text-success">
            Requis
          </Badge>
        ) : (
          <Badge variant="outline" className='text-muted-foreground'>
            optionel
          </Badge>
        ),
    },
  ];

  return (
    <SectionShell
      title="Livrables"
      icon={FileCheck2}
      addLabel="Rattacher"
      rows={rows}
      isLoading={isLoading}
      columns={columns}
      emptyText="Aucun livrable rattaché"
      dialog={dialog}
      isDeleting={del.isPending}
      onDelete={(item, done) => del.mutate(item.id, { onSuccess: done })}
      labelOf={(r) => r.name ?? r.deliverable_code ?? ''}
      renderForm={({ item, close }) => (
        <DeliverableForm
          item={item}
          options={(refs ?? []).map((d) => ({ value: d.code, label: d.name }))}
          isSaving={create.isPending || update.isPending}
          onCancel={close}
          onSubmit={(v) => {
            const payload = {
              etape_code: etape.code,
              name: v.name,
              deliverable_code: v.deliverable_code || undefined,
              is_required: v.is_required,
            };
            if (item) update.mutate({ ...payload, id: item.id }, { onSuccess: close });
            else create.mutate(payload, { onSuccess: close });
          }}
        />
      )}
    />
  );
}

function DeliverableForm({
  item,
  options,
  isSaving,
  onCancel,
  onSubmit,
}: {
  item?: WorkflowEtapeDeliverable | null;
  options: { value: string; label: string }[];
  isSaving: boolean;
  onCancel: () => void;
  onSubmit: (v: { name: string; deliverable_code: string; is_required: boolean }) => void;
}) {
  const [code, setCode] = useState(item?.deliverable_code ?? '');
  const [required, setRequired] = useState(!!item?.is_required);

  // The join's `name` (NOT NULL label) is derived from the chosen catalog
  // deliverable, so there's no separate Libellé field to fill. Falls back to the
  // item's existing name for a legacy row that has no code.
  const derivedName = options.find((o) => o.value === code)?.label ?? item?.name ?? '';

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (derivedName.trim())
          onSubmit({ name: derivedName.trim(), deliverable_code: code, is_required: required });
      }}
      className="space-y-4"
    >
      <FieldRow label="Livrable">
        <Select value={code || undefined} onValueChange={setCode}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choisir un livrable…" />
          </SelectTrigger>
          <SelectContent>
            {options.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldRow>
      <div className="flex items-center gap-2">
        <Switch checked={required} onCheckedChange={setRequired} />
        <Label className="font-normal">Livrable requis</Label>
      </div>
      <FormActions item={item} isSaving={isSaving} onCancel={onCancel} disabled={!derivedName.trim()} />
    </form>
  );
}

// ── Roles section ────────────────────────────────────────────────────────────
function RolesSection({ etape }: { etape: WorkflowEtape }) {
  const { data: all, isLoading } = useWorkflowEtapeRoles();
  const { data: refs } = useWorkflowRoles();
  const create = useCreateWorkflowEtapeRole();
  const update = useUpdateWorkflowEtapeRole();
  const del = useDeleteWorkflowEtapeRole();
  const dialog = useDialogState<WorkflowEtapeRole>();
  const rows = (all ?? []).filter((r) => r.etape_code === etape.code);
  const roleName = (code: string) => refs?.find((r) => r.code === code)?.name ?? code;

  const columns: ColumnDef<WorkflowEtapeRole>[] = [
    {
      id: 'role',
      header: 'Rôle',
      cell: ({ row }) => <span className="font-medium">{roleName(row.original.role_code)}</span>,
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">{row.original.action ?? '—'}</span>
      ),
    },
  ];

  return (
    <SectionShell
      title="Rôles"
      icon={UserCog}
      addLabel="Rattacher"
      rows={rows}
      isLoading={isLoading}
      columns={columns}
      emptyText="Aucun rôle rattaché"
      dialog={dialog}
      isDeleting={del.isPending}
      onDelete={(item, done) => del.mutate(item.id, { onSuccess: done })}
      labelOf={(r) => roleName(r.role_code)}
      renderForm={({ item, close }) => (
        <RoleForm
          item={item}
          options={(refs ?? []).map((r) => ({ value: r.code, label: r.name }))}
          isSaving={create.isPending || update.isPending}
          onCancel={close}
          onSubmit={(v) => {
            const payload = {
              etape_code: etape.code,
              role_code: v.role_code,
              action: v.action,
            };
            if (item) update.mutate({ ...payload, id: item.id }, { onSuccess: close });
            else create.mutate(payload, { onSuccess: close });
          }}
        />
      )}
    />
  );
}

function RoleForm({
  item,
  options,
  isSaving,
  onCancel,
  onSubmit,
}: {
  item?: WorkflowEtapeRole | null;
  options: { value: string; label: string }[];
  isSaving: boolean;
  onCancel: () => void;
  onSubmit: (v: { role_code: string; action: string }) => void;
}) {
  const [code, setCode] = useState(item?.role_code ?? '');
  const [action, setAction] = useState(item?.action ?? '');

  const canSubmit = !!code && !!action.trim();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onSubmit({ role_code: code, action: action.trim() });
      }}
      className="space-y-4"
    >
      <FieldRow label="Rôle *">
        <Select value={code || undefined} onValueChange={setCode}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choisir un rôle…" />
          </SelectTrigger>
          <SelectContent>
            {options.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldRow>
      <FieldRow label="Action *">
        <Input
          value={action}
          placeholder="ex: VALIDATION, TRANSMISSION, CONSULTATION…"
          onChange={(e) => setAction(e.target.value)}
        />
      </FieldRow>
      <FormActions item={item} isSaving={isSaving} onCancel={onCancel} disabled={!canSubmit} />
    </form>
  );
}

// ── Decisions section ────────────────────────────────────────────────────────
function DecisionsSection({ etape }: { etape: WorkflowEtape }) {
  const { data: all, isLoading } = useWorkflowEtapeDecisions();
  const { data: outcomes } = useWorkflowDecisionOutcomes();
  const create = useCreateWorkflowEtapeDecision();
  const update = useUpdateWorkflowEtapeDecision();
  const del = useDeleteWorkflowEtapeDecision();
  const dialog = useDialogState<WorkflowEtapeDecision>();
  const rows = (all ?? []).filter((r) => r.etape_code === etape.code);

  const columns: ColumnDef<WorkflowEtapeDecision>[] = [
    {
      accessorKey: 'name',
      header: 'Décision',
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      id: 'outcomes',
      header: 'Issues',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {(row.original.outcomes?.split('|').filter(Boolean) ?? []).map((o) => (
            <Badge key={o} variant="secondary" className="font-normal">
              {o}
            </Badge>
          ))}
        </div>
      ),
    },
  ];

  return (
    <SectionShell
      title="Décisions"
      icon={Gavel}
      addLabel="Ajouter"
      rows={rows}
      isLoading={isLoading}
      columns={columns}
      emptyText="Aucune décision définie"
      dialog={dialog}
      isDeleting={del.isPending}
      onDelete={(item, done) => del.mutate(item.id, { onSuccess: done })}
      labelOf={(r) => r.name}
      renderForm={({ item, close }) => (
        <DecisionForm
          item={item}
          outcomeOptions={(outcomes ?? []).map((o) => ({ value: o.code, label: o.label }))}
          isSaving={create.isPending || update.isPending}
          onCancel={close}
          onSubmit={(v) => {
            const payload = {
              etape_code: etape.code,
              name: v.name,
              code: v.code || undefined,
              description: v.description || undefined,
              outcomes: v.outcomes || undefined,
            };
            if (item) update.mutate({ ...payload, id: item.id }, { onSuccess: close });
            else create.mutate(payload, { onSuccess: close });
          }}
        />
      )}
    />
  );
}

function DecisionForm({
  item,
  outcomeOptions,
  isSaving,
  onCancel,
  onSubmit,
}: {
  item?: WorkflowEtapeDecision | null;
  outcomeOptions: { value: string; label: string }[];
  isSaving: boolean;
  onCancel: () => void;
  onSubmit: (v: { name: string; code: string; description: string; outcomes: string }) => void;
}) {
  const [name, setName] = useState(item?.name ?? '');
  const [code, setCode] = useState(item?.code ?? '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [selected, setSelected] = useState<string[]>(() =>
    item?.outcomes ? item.outcomes.split('|').filter(Boolean) : [],
  );
  const toggle = (value: string) =>
    setSelected((s) => (s.includes(value) ? s.filter((x) => x !== value) : [...s, value]));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (name.trim()) {
          onSubmit({ name: name.trim(), code, description, outcomes: selected.join('|') });
        }
      }}
      className="space-y-4"
    >
      <FieldRow label="Nom *">
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </FieldRow>
      <FieldRow label="Code">
        <Input
          value={code}
          placeholder="ex: AGRC_DEC_APPROBATION"
          onChange={(e) => setCode(e.target.value)}
        />
      </FieldRow>
      <FieldRow label="Issues possibles">
        <div className="flex flex-wrap gap-1.5">
          {outcomeOptions.map((o) => {
            const on = selected.includes(o.value);
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => toggle(o.value)}
                className={cn(
                  'cursor-pointer rounded-full border px-2.5 py-1 text-xs transition-colors',
                  on
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:bg-muted',
                )}
              >
                {o.label}
              </button>
            );
          })}
          {outcomeOptions.length === 0 && (
            <span className="text-xs text-muted-foreground">
              Aucune issue — créez-en dans « Issues de décision ».
            </span>
          )}
        </div>
      </FieldRow>
      <FieldRow label="Description">
        <Textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
      </FieldRow>
      <FormActions item={item} isSaving={isSaving} onCancel={onCancel} disabled={!name.trim()} />
    </form>
  );
}

// ── The config sheet ─────────────────────────────────────────────────────────
export function WorkflowEtapeConfigSheet({ etape }: { etape: WorkflowEtape }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="cursor-pointer">
          <Settings2 className="size-4" />
          Configurer
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto p-6 sm:max-w-xl">
        <SheetHeader className="px-0">
          <SheetTitle className="flex items-center gap-2">
            <Settings2 className="size-4 text-muted-foreground" />
            Configuration — {etape.name}
          </SheetTitle>
          <SheetDescription>
            Délai, livrables, rôles et décisions de l&apos;étape «&nbsp;{etape.code}&nbsp;».
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8 py-4">
          <SlaSection etape={etape} />
          <DeliverablesSection etape={etape} />
          <RolesSection etape={etape} />
          <DecisionsSection etape={etape} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
