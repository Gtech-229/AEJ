'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Tag, Tags } from 'lucide-react';
import { DataTableColumnHeader } from '@/components/data-table';
import { GenericTable } from '@/components/generic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Secteur, SousSecteur } from './secteurs.dto';
import { useSecteurs, useSousSecteurs } from './secteurs.hooks';

/**
 * Read-only browser of the AEJ activity-sector referential (Secteurs +
 * Sous-secteurs), sourced from `/aej/secteurs` and `/aej/sous-secteurs`.
 */
export function SecteursClient() {
  const secteurs = useSecteurs();
  const sousSecteurs = useSousSecteurs();

  const secteurColumns: ColumnDef<Secteur>[] = [
    {
      accessorKey: 'libelle',
      meta: { label: 'Libellé' },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Libellé" />,
      cell: ({ row }) => <span className="font-medium">{row.original.libelle}</span>,
    },
  ];

  const sousSecteurColumns: ColumnDef<SousSecteur>[] = [
    {
      accessorKey: 'libelle',
      meta: { label: 'Libellé' },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Libellé" />,
      cell: ({ row }) => <span className="font-medium">{row.original.libelle}</span>,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 px-[2.5%] py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Secteurs d&apos;activité</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Référentiel des secteurs et sous-secteurs d&apos;activité (AEJ, en lecture seule).
        </p>
      </div>

      <Tabs defaultValue="secteurs">
        <TabsList variant="solid" className="flex h-auto flex-wrap justify-start">
          <TabsTrigger value="secteurs" className="cursor-pointer gap-1.5">
            <Tag /> Secteurs
          </TabsTrigger>
          <TabsTrigger value="sous-secteurs" className="cursor-pointer gap-1.5">
            <Tags /> Sous-secteurs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="secteurs">
          <GenericTable<Secteur>
            data={secteurs.data ?? []}
            columns={secteurColumns}
            searchKey="libelle"
            searchPlaceholder="Rechercher un secteur…"
            isLoading={secteurs.isLoading}
            emptyIcon={Tag}
            emptyTitle="Aucun secteur"
            emptyDescription="Le référentiel des secteurs est vide."
          />
        </TabsContent>

        <TabsContent value="sous-secteurs">
          <GenericTable<SousSecteur>
            data={sousSecteurs.data ?? []}
            columns={sousSecteurColumns}
            searchKey="libelle"
            searchPlaceholder="Rechercher un sous-secteur…"
            isLoading={sousSecteurs.isLoading}
            emptyIcon={Tags}
            emptyTitle="Aucun sous-secteur"
            emptyDescription="Le référentiel des sous-secteurs est vide."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
