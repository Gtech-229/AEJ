'use client';

import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { LineChart, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { GenericTable } from '@/components/generic';
import { formatDate } from '@/lib/date';
import type { Indicateur, IndicateurSuivi } from './indicateurs.dto';
import { useAddIndicateurValeur, useIndicateurSuivi } from './indicateurs.hooks';

/**
 * "Renseigner" — a per-indicateur side sheet to capture a new measurement
 * (`indicateurs_suivi`) and read its dated history. Fetches the history only
 * while open.
 */
export function RenseignerButton({ indicateur }: { indicateur: Indicateur }) {
  const [open, setOpen] = useState(false);
  const [valeur, setValeur] = useState('');
  const { data: suivi, isLoading } = useIndicateurSuivi(indicateur.id, open);
  const addValeur = useAddIndicateurValeur(indicateur.id);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const v = valeur.trim();
    if (!v) return;
    addValeur.mutate({ valeur: v }, { onSuccess: () => setValeur('') });
  }

  const columns: ColumnDef<IndicateurSuivi>[] = [
    {
      accessorKey: 'valeur',
      header: 'Valeur',
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.valeur}
          {indicateur.unite ? <span className="text-muted-foreground"> {indicateur.unite}</span> : null}
        </span>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Date',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{formatDate(row.original.created_at)}</span>
      ),
    },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className='cursor-pointer' variant="outline" size="sm">
          <LineChart className="size-4" />
          Renseigner
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <LineChart className="size-4 text-muted-foreground" />
            {indicateur.nom}
          </SheetTitle>
          <SheetDescription>
            Historique des mesures{indicateur.unite ? ` · unité : ${indicateur.unite}` : ''}.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={submit} className="flex items-end gap-2 px-4">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="indicateur-valeur">Nouvelle valeur</Label>
            <Input
              id="indicateur-valeur"
              value={valeur}
              onChange={(e) => setValeur(e.target.value)}
              placeholder={indicateur.unite ? `Valeur en ${indicateur.unite}` : 'Valeur mesurée'}
            />
          </div>
          <Button className='cursor-pointer' type="submit" disabled={addValeur.isPending || !valeur.trim()}>
            {addValeur.isPending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            Ajouter
          </Button>
        </form>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
          <GenericTable<IndicateurSuivi>
            data={suivi ?? []}
            columns={columns}
            isLoading={isLoading}
            showSearch={false}
            showViewOptions={false}
            showPagination={false}
            emptyIcon={LineChart}
            emptyTitle="Aucune valeur"
            emptyDescription="Renseignez une première valeur pour cet indicateur."
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
