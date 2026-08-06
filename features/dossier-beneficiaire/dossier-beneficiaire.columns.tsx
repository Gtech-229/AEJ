'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/data-table/column-header';
import { Badge } from '@/components/ui/badge';
import type { Credit } from '../credits/credits.types';

const STATUT_LABELS: Record<Credit['statutWorkflow'], string> = {
  instruction: 'Instruction',
  plan_affaires: "Plan d'affaires",
  transmission_partenaire: 'Transmission partenaire',
  traitement_partenaire: 'Traitement partenaire',
  suivi_exploitation: 'Suivi & exploitation',
};

/** Table des crédits associés à un bénéficiaire, affichée dans son dossier. */
export const dossierBeneficiaireColumns: ColumnDef<Credit>[] = [
  {
    accessorKey: 'code',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
    meta: { label: 'Code' },
  },
  {
    accessorKey: 'banque',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Banque" />,
    meta: { label: 'Banque' },
  },
  {
    accessorKey: 'montantFinance',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Montant financé" />,
    meta: { label: 'Montant financé' },
    cell: ({ row }) => `${row.original.montantFinance.toLocaleString('fr-FR')} GNF`,
  },
  {
    accessorKey: 'tauxRemboursement',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Taux remb." />,
    meta: { label: 'Taux remb.' },
    cell: ({ row }) => `${row.original.tauxRemboursement}%`,
  },
  {
    accessorKey: 'statutWorkflow',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
    meta: { label: 'Statut' },
    cell: ({ row }) => <Badge variant="secondary">{STATUT_LABELS[row.original.statutWorkflow]}</Badge>,
  },
];
