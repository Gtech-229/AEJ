'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/data-table/column-header';
import type { ImpactPeriode } from './impact.types';

/** Détail mensuel affiché sous le graphique "Évolution des indicateurs dans le temps". */
export const impactColumns: ColumnDef<ImpactPeriode>[] = [
  {
    accessorKey: 'mois',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Mois" />,
    meta: { label: 'Mois' },
  },
  {
    accessorKey: 'emploisCrees',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Emplois créés" />,
    meta: { label: 'Emplois créés' },
  },
  {
    accessorKey: 'femmes',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Dont femmes" />,
    meta: { label: 'Dont femmes' },
  },
];
