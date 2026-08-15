'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { ColumnDef } from '@tanstack/react-table';
import { FolderKanban, Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTableColumnHeader } from '@/components/data-table';
import { GenericTable, usePageParams } from '@/components/generic';
import { useFormatMontant } from '@/features/configurations/configurations.hooks';
import type { Projet } from './projects.dto';
import { DEFAULT_PROJETS_PER_PAGE } from './projects.dto';
import { useProjectsPage } from './projects.hooks';
import {
  PROJET_STADE_LABELS,
  PROJET_STADE_OPTIONS,
  PROJET_STATUT_LABELS,
  PROJET_STATUT_OPTIONS,
  PROJET_TYPE_LABELS,
  PROJET_TYPE_OPTIONS,
} from './projects.constants';

/** Radix `SelectItem` can't hold an empty value, so "all" needs a sentinel. */
const ALL = '__all__';
const FILTER_KEYS = ['search', 'statut', 'stade_projet', 'type_projet'] as const;

/**
 * Paginated + filtered micro-projets list. Pagination is server-side (`/projets`
 * is a 10k-row paginator); the filters are URL-driven and forwarded to the API —
 * the backend doesn't honor them yet, so they'll light up once it does (see
 * backend-asks). Each row opens the reusable 360 view.
 */
export function ProjectsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { page, perPage } = usePageParams({ perPage: DEFAULT_PROJETS_PER_PAGE });
  const formatMontant = useFormatMontant();

  const filters = useMemo(() => {
    const p = new URLSearchParams(searchParams.toString());
    const out: Record<string, string> = {};
    for (const k of FILTER_KEYS) {
      const v = p.get(k);
      if (v) out[k] = v;
    }
    return out;
  }, [searchParams]);

  const query = useMemo(() => ({ page, perPage, ...filters }), [page, perPage, filters]);
  const { data, isLoading } = useProjectsPage(query);

  const [searchInput, setSearchInput] = useState(filters.search ?? '');
  useEffect(() => {
    setSearchInput(filters.search ?? '');
  }, [filters.search]);

  const setParams = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const p = new URLSearchParams(searchParams.toString());
      mutate(p);
      p.set('page', '1'); // any filter change resets to the first page
      const next = p.toString();
      if (next === searchParams.toString()) return;
      router.replace(`${pathname}?${next}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  // Debounce the search input so we don't fire a request per keystroke.
  useEffect(() => {
    const current = filters.search ?? '';
    if (searchInput === current) return;
    const timer = setTimeout(() => {
      setParams((p) => {
        if (searchInput) p.set('search', searchInput);
        else p.delete('search');
      });
    }, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  function setSelect(key: string, value: string) {
    setParams((p) => {
      if (value === ALL) p.delete(key);
      else p.set(key, value);
    });
  }

  function reset() {
    setSearchInput('');
    setParams((p) => {
      for (const k of FILTER_KEYS) p.delete(k);
    });
  }

  const hasActive = FILTER_KEYS.some((k) => filters[k]);

  const columns: ColumnDef<Projet>[] = [
    {
      accessorKey: 'code',
      meta: { label: 'Code' },
      header: 'Code',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">{row.original.code}</span>
      ),
    },
    {
      accessorKey: 'intitule',
      meta: { label: 'Intitulé' },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Intitulé" />,
      cell: ({ row }) => <span className="font-medium">{row.original.intitule}</span>,
    },
    {
      accessorKey: 'montant_total',
      meta: { label: 'Montant' },
      header: 'Montant',
      cell: ({ row }) => (
        <span className="font-medium">{formatMontant(row.original.montant_total)}</span>
      ),
    },
    {
      accessorKey: 'statut',
      meta: { label: 'Statut' },
      header: 'Statut',
      cell: ({ row }) => (
        <Badge variant="secondary">
          {PROJET_STATUT_LABELS[row.original.statut] ?? row.original.statut}
        </Badge>
      ),
    },
    {
      accessorKey: 'stade_projet',
      meta: { label: 'Stade' },
      header: 'Stade',
      cell: ({ row }) => (
        <Badge variant="outline">
          {PROJET_STADE_LABELS[row.original.stade_projet] ?? row.original.stade_projet}
        </Badge>
      ),
    },
    {
      accessorKey: 'type_projet',
      meta: { label: 'Type' },
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant="outline">
          {PROJET_TYPE_LABELS[row.original.type_projet] ?? row.original.type_projet}
        </Badge>
      ),
    },
  ];

  const selects: { key: string; label: string; options: { value: string; label: string }[] }[] = [
    { key: 'statut', label: 'Statut', options: PROJET_STATUT_OPTIONS },
    { key: 'stade_projet', label: 'Stade', options: PROJET_STADE_OPTIONS },
    { key: 'type_projet', label: 'Type', options: PROJET_TYPE_OPTIONS },
  ];

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 px-[2.5%] py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Micro-projets</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Liste des micro-projets du programme
          {typeof data?.total === 'number' && ` — ${data.total.toLocaleString('fr-FR')} au total`}.
        </p>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Rechercher un projet (intitulé, code)…"
            className="pl-8"
          />
        </div>
        {selects.map((s) => (
          <Select
            key={s.key}
            value={filters[s.key] ?? ALL}
            onValueChange={(v) => setSelect(s.key, v)}
          >
            <SelectTrigger className="w-full lg:w-44">
              <SelectValue placeholder={s.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>{s.label} : tous</SelectItem>
              {s.options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
        {hasActive && (
          <Button variant="ghost" size="sm" onClick={reset} className="shrink-0">
            <X className="size-4" />
            Réinitialiser
          </Button>
        )}
      </div>

      <GenericTable<Projet>
        data={data?.items ?? []}
        columns={columns}
        showSearch={false}
        isLoading={isLoading}
        defaultPageSize={DEFAULT_PROJETS_PER_PAGE}
        manualPagination={{ pageCount: data?.lastPage ?? 1, rowCount: data?.total }}
        onRowClick={(p) => router.push(`/dashboard/projets/${p.id}`)}
        emptyIcon={FolderKanban}
        emptyTitle="Aucun micro-projet"
        emptyDescription="Aucun micro-projet ne correspond à ces critères."
      />
    </div>
  );
}
