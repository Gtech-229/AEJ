'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/data-table/column-header';
import { Badge } from '@/components/ui/badge';
import { STATUT_ECHEANCE_LABELS } from './remboursement.constants';
import type { Echeance } from './remboursement.types';

const STATUT_STYLES: Record<Echeance['statut'], string> = {
  payee: 'bg-green-100 text-green-700',
  en_retard: 'bg-red-100 text-red-700',
  a_venir: 'bg-blue-100 text-blue-700',
  non_definie: 'bg-gray-100 text-gray-500',
};

export const remboursementColumns: ColumnDef<Echeance>[] = [
  {
    accessorKey: 'mois',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Mois" />,
    meta: { label: 'Mois' },
  },
  {
    accessorKey: 'montant',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Échéance" />,
    meta: { label: 'Échéance' },
    cell: ({ row }) => `${row.original.montant.toLocaleString('fr-FR')} GNF`,
  },
  {
    accessorKey: 'montantPaye',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Montant payé" />,
    meta: { label: 'Montant payé' },
    cell: ({ row }) => `${row.original.montantPaye.toLocaleString('fr-FR')} GNF`,
  },
  {
    accessorKey: 'statut',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
    meta: { label: 'Statut' },
    cell: ({ row }) => (
      <Badge className={`${STATUT_STYLES[row.original.statut]} hover:${STATUT_STYLES[row.original.statut]}`}>
        {STATUT_ECHEANCE_LABELS[row.original.statut]}
      </Badge>
    ),
  },
];
