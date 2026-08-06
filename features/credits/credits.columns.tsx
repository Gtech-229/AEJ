'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/data-table/column-header';
import { CREDIT_STATUT_BADGE_CLASSES, CREDIT_STATUT_LABELS } from './credits.constants';
import type { Credit } from './credits.types';

export const creditsColumns: ColumnDef<Credit>[] = [
    {
        accessorKey: 'code',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
        meta: { label: 'Code' },
    },
    {
        accessorKey: 'beneficiaire',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Bénéficiaire" />,
        meta: { label: 'Bénéficiaire' },
    },
    {
        accessorKey: 'montantFinance',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Montant" />,
        meta: { label: 'Montant' },
        cell: ({ row }) => `${row.original.montantFinance.toLocaleString('fr-FR')} F CFA`,
    },
    {
        accessorKey: 'montantRembourse',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Remboursé" />,
        meta: { label: 'Remboursé' },
        cell: ({ row }) => `${row.original.montantRembourse.toLocaleString('fr-FR')} F CFA`,
    },
    {
        accessorKey: 'dateDecaissement',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Échéance" />,
        meta: { label: 'Échéance' },
        cell: ({ row }) => new Date(row.original.dateDecaissement).toLocaleDateString('fr-FR'),
    },
    {
        accessorKey: 'statutCredit',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
        meta: { label: 'Statut' },
        cell: ({ row }) => {
            const statut = row.original.statutCredit as keyof typeof CREDIT_STATUT_LABELS;
            return (
                <Badge className={cn(CREDIT_STATUT_BADGE_CLASSES[statut])} variant="outline">
                    {CREDIT_STATUT_LABELS[statut]}
                </Badge>
            );
        },
    },
];