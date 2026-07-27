'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/data-table/column-header';
import { buildEditDeleteActionsColumn } from '@/components/generic';
import { AGENCE_STATUT_BADGE_CLASSES, AGENCE_STATUT_LABELS } from './agences.constants';
import type { Agence } from './agences.types';

interface BuildColumnsArgs {
  onEdit: (item: Agence) => void;
  onDelete: (item: Agence) => void;
}

export function buildAgencesColumns({ onEdit, onDelete }: BuildColumnsArgs): ColumnDef<Agence>[] {
  return [
    {
      accessorKey: 'nom',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Agence" />,
      meta: { label: 'Agence' },
    },
    {
      accessorKey: 'ville',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Ville" />,
      meta: { label: 'Ville' },
    },
    {
      accessorKey: 'responsable',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Responsable" />,
      meta: { label: 'Responsable' },
    },
    {
      accessorKey: 'nbEmployes',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Employés" />,
      meta: { label: 'Employés' },
    },
    {
      accessorKey: 'statut',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
      meta: { label: 'Statut' },
      cell: ({ row }) => {
        const statut = row.original.statut;
        return (
          <Badge className={cn(AGENCE_STATUT_BADGE_CLASSES[statut])} variant="outline">
            {AGENCE_STATUT_LABELS[statut]}
          </Badge>
        );
      },
    },
    buildEditDeleteActionsColumn<Agence>({ onEdit, onDelete }),
  ];
}