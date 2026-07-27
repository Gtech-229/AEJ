'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/data-table/column-header';
import type { Beneficiaire } from './beneficiaires.types';

export const beneficiairesColumns: ColumnDef<Beneficiaire>[] = [
    {
        id: 'nomComplet',
        accessorFn: (row) => `${row.prenom} ${row.nom}`,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nom" />,
        meta: { label: 'Nom' },
        cell: ({ row }) => `${row.original.prenom} ${row.original.nom}`,
    },
    {
        accessorKey: 'telephone',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Téléphone" />,
        meta: { label: 'Téléphone' },
    },
    {
        accessorKey: 'region',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Région" />,
        meta: { label: 'Région' },
    },
    {
        accessorKey: 'secteurActivite',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Secteur" />,
        meta: { label: 'Secteur' },
    },
    {
        accessorKey: 'nombreCredits',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Crédits" />,
        meta: { label: 'Crédits' },
    },
    {
        accessorKey: 'montantTotalFinance',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Montant total" />,
        meta: { label: 'Montant total' },
        cell: ({ row }) => `${row.original.montantTotalFinance.toLocaleString('fr-FR')} GNF`,
    },
];