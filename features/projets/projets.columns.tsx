'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/data-table/column-header';
import { PROJET_STATUT_BADGE_CLASSES, PROJET_STATUT_LABELS } from './projets.constants';
import type { Projet } from './projets.types';

export const projetsColumns: ColumnDef<Projet>[] = [
    {
        accessorKey: 'code',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
        meta: { label: 'Code' },
    },
    {
        accessorKey: 'intitule',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Intitulé" />,
        meta: { label: 'Intitulé' },
    },
    {
        accessorKey: 'montantFinance',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Montant financé" />,
        meta: { label: 'Montant financé' },
        cell: ({ row }) => `${row.original.montantFinance.toLocaleString('fr-FR')} FCFA`,
    },
    {
        accessorKey: 'dateDebut',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Début" />,
        meta: { label: 'Début' },
        cell: ({ row }) => new Date(row.original.dateDebut).toLocaleDateString('fr-FR'),
    },
    {
        accessorKey: 'statut',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
        meta: { label: 'Statut' },
        cell: ({ row }) => {
            const statut = row.original.statut;
            return (
                <Badge className={cn(PROJET_STATUT_BADGE_CLASSES[statut])} variant="outline">
                    {PROJET_STATUT_LABELS[statut]}
                </Badge>
            );
        },
    },
];