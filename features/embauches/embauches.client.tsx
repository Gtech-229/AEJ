'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTableColumnHeader } from '@/components/data-table';
import { GenericTable } from '@/components/generic';
import type { Embauche } from './embauches.dto';
import { useEmbauches } from './embauches.hooks';

const ALL = '__all__';

export function EmbauchesClient() {
  const { data: embauches, isLoading } = useEmbauches();
  const rows = useMemo(() => embauches ?? [], [embauches]);
  const [entrepriseFilter, setEntrepriseFilter] = useState(ALL);
  const [typeFilter, setTypeFilter] = useState(ALL);

  // Filter options derived from the data (only values actually present).
  const entrepriseOptions = useMemo(() => {
    const m = new Map<number, string>();
    rows.forEach((e) => {
      if (e.entreprise_id && e.entreprise) m.set(e.entreprise_id, e.entreprise.raison_sociale);
    });
    return [...m].map(([value, label]) => ({ value: String(value), label }));
  }, [rows]);

  const typeOptions = useMemo(() => {
    const m = new Map<number, string>();
    rows.forEach((e) => {
      if (e.type_emploi_id && e.type_emploi) m.set(e.type_emploi_id, e.type_emploi.libelle);
    });
    return [...m].map(([value, label]) => ({ value: String(value), label }));
  }, [rows]);

  const filtered = useMemo(
    () =>
      rows.filter(
        (e) =>
          (entrepriseFilter === ALL || String(e.entreprise_id) === entrepriseFilter) &&
          (typeFilter === ALL || String(e.type_emploi_id) === typeFilter),
      ),
    [rows, entrepriseFilter, typeFilter],
  );

  const typeCounts = useMemo(() => {
    const m = new Map<string, number>();
    filtered.forEach((e) => {
      const label = e.type_emploi?.libelle ?? 'Non précisé';
      m.set(label, (m.get(label) ?? 0) + 1);
    });
    return [...m];
  }, [filtered]);

  const columns: ColumnDef<Embauche>[] = [
    {
      accessorKey: 'poste',
      meta: { label: 'Poste' },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Poste" />,
      cell: ({ row }) => <span className="font-medium">{row.original.poste}</span>,
    },
    {
      id: 'promoteur',
      meta: { label: 'Promoteur' },
      header: 'Promoteur',
      cell: ({ row }) => {
        const p = row.original.promoteur;
        return <span>{p ? `${p.prenom} ${p.nom}` : `#${row.original.promoteur_id}`}</span>;
      },
    },
    {
      id: 'entreprise',
      meta: { label: 'Entreprise' },
      header: 'Entreprise',
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.entreprise?.raison_sociale ?? '—'}
        </span>
      ),
    },
    {
      id: 'micro_projet',
      meta: { label: 'Micro-projet' },
      header: 'Micro-projet',
      cell: ({ row }) => {
        const mp = row.original.micro_projet;
        const id = row.original.micro_projet_id;
        if (!id) return <span className="text-muted-foreground">—</span>;
        return (
          <Link
            href={`/dashboard/projets/${id}`}
            className="font-mono text-xs text-primary hover:underline"
          >
            {mp?.code ?? `#${id}`}
          </Link>
        );
      },
    },
    {
      id: 'type_emploi',
      meta: { label: "Type d'emploi" },
      header: "Type d'emploi",
      cell: ({ row }) =>
        row.original.type_emploi ? (
          <Badge variant="secondary" className="font-normal">
            {row.original.type_emploi.libelle}
          </Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 px-[2.5%] py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Emplois générés</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Traçabilité des embauches liées aux promoteurs, entreprises et micro-projets.
        </p>
      </div>

      {/* Summary */}
      {/* <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div>
            <p className="text-xs text-muted-foreground">Total embauches</p>
            <p className="text-xl font-semibold text-foreground">{filtered.length}</p>
          </div>
          {typeCounts.map(([label, count]) => (
            <Badge key={label} variant="outline" className="font-normal">
              {label} · {count}
            </Badge>
          ))}
        </div>
      </div> */}

      <GenericTable<Embauche>
        data={filtered}
        columns={columns}
        searchKey="poste"
        searchPlaceholder="Rechercher un poste…"
        isLoading={isLoading}
        emptyIcon={Briefcase}
        emptyTitle="Aucune embauche"
        emptyDescription="Aucune embauche ne correspond à ces critères."
        toolbarEndSlot={
          <div className="flex flex-wrap items-center gap-2">
            <Select value={entrepriseFilter} onValueChange={setEntrepriseFilter}>
              <SelectTrigger className="w-full sm:w-52">
                <SelectValue placeholder="Entreprise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Toutes les entreprises</SelectItem>
                {entrepriseOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Type d'emploi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Tous les types</SelectItem>
                {typeOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />
    </div>
  );
}
