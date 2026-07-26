'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/data-table/column-header';
import { Badge } from '@/components/ui/badge';
import type { JournalActionType, JournalEntry } from './journal.types';

const ACTION_LABELS: Record<JournalActionType, string> = {
  creation: 'Création',
  modification: 'Modification',
  suppression: 'Suppression',
  connexion: 'Connexion',
  export: 'Export',
};

const ACTION_STYLES: Record<JournalActionType, string> = {
  creation: 'bg-green-100 text-green-700 hover:bg-green-100',
  modification: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  suppression: 'bg-red-100 text-red-700 hover:bg-red-100',
  connexion: 'bg-gray-100 text-gray-600 hover:bg-gray-100',
  export: 'bg-orange-100 text-orange-700 hover:bg-orange-100',
};

export const JOURNAL_COLUMNS: ColumnDef<JournalEntry>[] = [
  {
    accessorKey: 'horodatage',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date & heure" />,
    cell: ({ row }) =>
      new Date(row.original.horodatage).toLocaleString('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
  },
  {
    accessorKey: 'utilisateur',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Utilisateur" />,
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-gray-800">{row.original.utilisateur}</p>
        <p className="text-xs text-muted-foreground">{row.original.role}</p>
      </div>
    ),
  },
  {
    accessorKey: 'action',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
    cell: ({ row }) => (
      <Badge className={ACTION_STYLES[row.original.action]}>
        {ACTION_LABELS[row.original.action]}
      </Badge>
    ),
  },
  {
    accessorKey: 'ressource',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ressource" />,
  },
  {
    accessorKey: 'details',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Détails" />,
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">{row.original.details}</span>
    ),
  },
  {
    accessorKey: 'adresseIp',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Adresse IP" />,
    cell: ({ row }) => row.original.adresseIp ?? '—',
  },
];
