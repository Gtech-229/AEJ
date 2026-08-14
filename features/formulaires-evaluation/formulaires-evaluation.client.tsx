'use client';

import { Suspense, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { ClipboardList, Eye, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { DataTableColumnHeader } from '@/components/data-table';
import { GenericTable, buildEditDeleteActionsColumn } from '@/components/generic';
import { GenericDeleteDialog } from '@/components/generic/delete-dialog';
import { LoadingState } from '@/components/generic/loader';
import type { FormulaireEvaluation } from './formulaires-evaluation.dto';
import { PUBLIC_CIBLE_OPTIONS } from './formulaires-evaluation.constants';
import {
  useDeleteFormulaireEvaluation,
  useFormulairesEvaluation,
} from './formulaires-evaluation.hooks';
import { FormulaireBuilderSheet } from './formulaire-builder';
import { FormulairePreviewSheet } from './formulaire-preview';

const cibleLabel = (value: string) =>
  PUBLIC_CIBLE_OPTIONS.find((o) => o.value === value)?.label ?? value;

export function FormulairesEvaluationClient() {
  const { data: formulaires, isLoading } = useFormulairesEvaluation();
  const del = useDeleteFormulaireEvaluation();
  const [editing, setEditing] = useState<FormulaireEvaluation | 'new' | null>(null);
  const [deleting, setDeleting] = useState<FormulaireEvaluation | null>(null);
  const [previewing, setPreviewing] = useState<FormulaireEvaluation | null>(null);

  const columns: ColumnDef<FormulaireEvaluation>[] = [
    {
      accessorKey: 'libelle',
      meta: { label: 'Libellé' },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Libellé" />,
      cell: ({ row }) => <span className="font-medium">{row.original.libelle}</span>,
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
      accessorKey: 'public_cible',
      meta: { label: 'Public cible' },
      header: 'Public cible',
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-normal">
          {cibleLabel(row.original.public_cible)}
        </Badge>
      ),
    },
    {
      id: 'questions',
      meta: { label: 'Questions' },
      header: 'Questions',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.questions?.length ?? 0}</span>
      ),
    },
    {
      id: 'actif',
      meta: { label: 'Statut' },
      header: 'Statut',
      cell: ({ row }) => {
        const active = row.original.actif;
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
    buildEditDeleteActionsColumn<FormulaireEvaluation>({
      onEdit: (item) => setEditing(item),
      onDelete: (item) => setDeleting(item),
      extraActions: (item) => (
        <DropdownMenuItem onClick={() => setPreviewing(item)}>
          <Eye className="mr-2 size-3.5 text-muted-foreground/70" />
          Aperçu
        </DropdownMenuItem>
      ),
    }),
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Formulaires d&apos;évaluation</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Paramétrez les questionnaires d&apos;évaluation et leurs questions.
        </p>
      </div>

      <Suspense fallback={<LoadingState />}>
        <GenericTable<FormulaireEvaluation>
          data={formulaires ?? []}
          columns={columns}
          searchKey="libelle"
          searchPlaceholder="Rechercher un formulaire…"
          isLoading={isLoading}
          emptyIcon={ClipboardList}
          emptyTitle="Aucun formulaire"
          emptyDescription="Créez un premier questionnaire d'évaluation."
          toolbarEndSlot={
            <Button size="sm" className="cursor-pointer" onClick={() => setEditing('new')}>
              <Plus className="size-4" />
              Nouveau formulaire
            </Button>
          }
        />
      </Suspense>

      <FormulaireBuilderSheet formulaire={editing} onClose={() => setEditing(null)} />

      <FormulairePreviewSheet formulaire={previewing} onClose={() => setPreviewing(null)} />

      <GenericDeleteDialog
        open={deleting !== null}
        onOpenChange={(o) => {
          if (!o) setDeleting(null);
        }}
        isLoading={del.isPending}
        title="Supprimer le formulaire"
        description={
          deleting
            ? `Supprimer « ${deleting.libelle} » et ses questions ? Cette action est irréversible.`
            : undefined
        }
        onConfirm={() => {
          if (deleting) del.mutate(deleting.id, { onSuccess: () => setDeleting(null) });
        }}
      />
    </div>
  );
}
