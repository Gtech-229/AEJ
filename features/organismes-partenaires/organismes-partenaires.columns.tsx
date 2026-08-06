'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/data-table/column-header';
import { buildEditDeleteActionsColumn } from '@/components/generic';
import { Badge } from '@/components/ui/badge';
import type { OrganismePartenaire } from './use-organismes-partenaires';

const TYPE_LABELS: Record<OrganismePartenaire['type'], string> = {
  banque: 'Banque',
  sfd: 'SFD',
  fonds_garantie: 'Fonds de garantie',
};

interface Args {
  onEdit: (o: OrganismePartenaire) => void;
  onDelete: (o: OrganismePartenaire) => void;
}

export function buildOrganismesColumns({ onEdit, onDelete }: Args): ColumnDef<OrganismePartenaire>[] {
  return [
    {
      accessorKey: 'nom',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Organisme" />,
      cell: ({ row }) => <span className="font-medium text-gray-800">{row.original.nom}</span>,
    },
    {
      accessorKey: 'type',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
      cell: ({ row }) => <Badge variant="secondary">{TYPE_LABELS[row.original.type]}</Badge>,
    },
    {
      accessorKey: 'contact',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Contact" />,
    },
    {
      accessorKey: 'dossiersActifs',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Dossiers actifs" />,
    },
    {
      accessorKey: 'statut',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
      cell: ({ row }) =>
        row.original.statut === 'actif' ? (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Actif</Badge>
        ) : (
          <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-100">Inactif</Badge>
        ),
    },
    buildEditDeleteActionsColumn<OrganismePartenaire>({ onEdit, onDelete }),
  ];
}
