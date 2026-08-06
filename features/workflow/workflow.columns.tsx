'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/data-table/column-header';
import type { DossierWorkflow } from './workflow.types';

export const workflowColumns: ColumnDef<DossierWorkflow>[] = [
  {
    accessorKey: 'code',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
    meta: { label: 'Code' },
  },
  {
    accessorKey: 'beneficiaireNom',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Bénéficiaire" />,
    meta: { label: 'Bénéficiaire' },
  },
  {
    accessorKey: 'banque',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Banque" />,
    meta: { label: 'Banque' },
  },
  {
    accessorKey: 'joursDansEtape',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Jours dans l'étape" />,
    meta: { label: "Jours dans l'étape" },
  },
];
