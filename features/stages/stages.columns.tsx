'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/data-table/column-header';
import { buildEditDeleteActionsColumn } from '@/components/generic';
import { STAGE_STATUT_BADGE_CLASSES, STAGE_STATUT_LABELS } from './stages.constants';
import type { Stage } from './stages.types';

interface BuildColumnsArgs {
    onEdit: (item: Stage) => void;
    onDelete: (item: Stage) => void;
}

export function buildStagesColumns({ onEdit, onDelete }: BuildColumnsArgs): ColumnDef<Stage>[] {
    return [
        {
            accessorKey: 'intitule',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Intitulé" />,
            meta: { label: 'Intitulé' },
        },
        {
            accessorKey: 'nombrePlaces',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Places" />,
            meta: { label: 'Places' },
        },
        {
            accessorKey: 'dateDebut',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Début" />,
            meta: { label: 'Début' },
            cell: ({ row }) => new Date(row.original.dateDebut).toLocaleDateString('fr-FR'),
        },
        {
            accessorKey: 'dateFin',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Fin" />,
            meta: { label: 'Fin' },
            cell: ({ row }) => new Date(row.original.dateFin).toLocaleDateString('fr-FR'),
        },
        {
            accessorKey: 'statut',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
            meta: { label: 'Statut' },
            cell: ({ row }) => {
                const statut = row.original.statut;
                return (
                    <Badge className={cn(STAGE_STATUT_BADGE_CLASSES[statut])} variant="outline">
                        {STAGE_STATUT_LABELS[statut]}
                    </Badge>
                );
            },
        },
        buildEditDeleteActionsColumn<Stage>({ onEdit, onDelete }),
    ];
}