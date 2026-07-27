'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/data-table/column-header';
import { buildEditDeleteActionsColumn } from '@/components/generic';
import {
    DEPARTEMENT_LABELS,
    POSTE_LABELS,
    STATUT_BADGE_CLASSES,
    STATUT_LABELS,
    TYPE_CONTRAT_LABELS,
} from './personnels.constants';
import type { Personnel } from '@/lib/types';

interface BuildColumnsArgs {
    onEdit: (item: Personnel) => void;
    onDelete: (item: Personnel) => void;
}

export function buildPersonnelColumns({
    onEdit,
    onDelete,
}: BuildColumnsArgs): ColumnDef<Personnel>[] {
    return [
        {
            id: 'nomComplet',
            accessorFn: (row) => `${row.prenom} ${row.nom}`,
            header: ({ column }) => <DataTableColumnHeader column={column} title="Nom" />,
            meta: { label: 'Nom' },
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">
                        {row.original.prenom} {row.original.nom}
                    </span>
                    <span className="text-xs text-muted-foreground">{row.original.matricule}</span>
                </div>
            ),
        },
        {
            accessorKey: 'email',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Contact" />,
            meta: { label: 'Contact' },
            cell: ({ row }) => (
                <div className="flex flex-col text-sm">
                    <span>{row.original.email}</span>
                    <span className="text-muted-foreground">{row.original.telephone}</span>
                </div>
            ),
        },
        {
            accessorKey: 'poste',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Poste" />,
            meta: { label: 'Poste' },
            cell: ({ row }) => POSTE_LABELS[row.original.poste],
        },
        {
            accessorKey: 'departement',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Département" />,
            meta: { label: 'Département' },
            cell: ({ row }) => DEPARTEMENT_LABELS[row.original.departement],
        },
        {
            accessorKey: 'typeContrat',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Contrat" />,
            meta: { label: 'Contrat' },
            cell: ({ row }) => TYPE_CONTRAT_LABELS[row.original.typeContrat],
        },
        {
            accessorKey: 'dateEmbauche',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Embauché(e) le" />,
            meta: { label: "Date d'embauche" },
            cell: ({ row }) =>
                new Date(row.original.dateEmbauche).toLocaleDateString('fr-FR'),
        },
        {
            accessorKey: 'statut',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
            meta: { label: 'Statut' },
            cell: ({ row }) => {
                const statut = row.original.statut;
                return (
                    <Badge className={cn(STATUT_BADGE_CLASSES[statut])} variant="outline">
                        {STATUT_LABELS[statut]}
                    </Badge>
                );
            },
        },
        buildEditDeleteActionsColumn<Personnel>({ onEdit, onDelete }),
    ];
}