'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/data-table/column-header';
import { buildEditDeleteActionsColumn } from '@/components/generic';
import {
    EMPLOI_STATUT_BADGE_CLASSES,
    EMPLOI_STATUT_LABELS,
    EMPLOI_TYPE_CONTRAT_LABELS,
} from './emplois.constants';
import type { Emploi } from './emplois.types';

interface BuildColumnsArgs {
    onEdit: (item: Emploi) => void;
    onDelete: (item: Emploi) => void;
}

export function buildEmploisColumns({ onEdit, onDelete }: BuildColumnsArgs): ColumnDef<Emploi>[] {
    return [
        {
            accessorKey: 'intitule',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Intitulé" />,
            meta: { label: 'Intitulé' },
        },
        {
            accessorKey: 'typeContrat',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Contrat" />,
            meta: { label: 'Contrat' },
            cell: ({ row }) => EMPLOI_TYPE_CONTRAT_LABELS[row.original.typeContrat],
        },
        {
            accessorKey: 'datePublication',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Publié le" />,
            meta: { label: 'Publié le' },
            cell: ({ row }) => new Date(row.original.datePublication).toLocaleDateString('fr-FR'),
        },
        {
            accessorKey: 'statut',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
            meta: { label: 'Statut' },
            cell: ({ row }) => {
                const statut = row.original.statut;
                return (
                    <Badge className={cn(EMPLOI_STATUT_BADGE_CLASSES[statut])} variant="outline">
                        {EMPLOI_STATUT_LABELS[statut]}
                    </Badge>
                );
            },
        },
        buildEditDeleteActionsColumn<Emploi>({ onEdit, onDelete }),
    ];
}