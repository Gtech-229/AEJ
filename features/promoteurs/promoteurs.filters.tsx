'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Filter, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  PROMOTEUR_FK_PARAMS,
  PROMOTEUR_PROJET_PARAMS,
  type PromoteurQuery,
} from './promoteurs.dto';
import { PROMOTEUR_FK_FILTERS, usePromoteurReferentials } from './promoteurs.referentials';
import {
  PROJET_STADE_OPTIONS,
  PROJET_STATUT_OPTIONS,
  PROJET_TYPE_OPTIONS,
} from '@/features/projects/projects.constants';

/** Radix `SelectItem` can't hold an empty value, so "all" needs a sentinel. */
const ALL = '__all__';

type Option = { value: string; label: string };

/** TODO(backend): confirm the full set of `tranche_age` values. */
const TRANCHE_AGE_OPTIONS: Option[] = [
  { value: '18_40', label: '18 – 40 ans' },
  { value: 'moins_18', label: 'Moins de 18 ans' },
  { value: 'plus_40', label: 'Plus de 40 ans' },
];

const STATUT_OPTIONS: Option[] = [
  { value: '1', label: 'Actif' },
  { value: '0', label: 'Inactif' },
];

type Filters = Partial<Omit<PromoteurQuery, 'page' | 'perPage'>>;
type SelectConfig = { param: string; label: string; options: Option[]; disabled: boolean };

/** Categorical filters live in the dialog; `search` stays inline. */
const CATEGORICAL_KEYS = [
  'statut',
  'tranche_age',
  ...PROMOTEUR_FK_PARAMS,
  ...PROMOTEUR_PROJET_PARAMS,
] as const;
const FILTER_KEYS = ['search', ...CATEGORICAL_KEYS] as const;

/** Current filter values, read from the URL (the single source of truth). */
export function usePromoteurFilters(): Filters {
  const searchParams = useSearchParams();
  const key = searchParams.toString();
  return useMemo(() => {
    const params = new URLSearchParams(key);
    const out: Record<string, string> = {};
    for (const k of FILTER_KEYS) {
      const v = params.get(k);
      if (v) out[k] = v;
    }
    return out as Filters;
  }, [key]);
}

/**
 * Filter controls for the promoteurs list: an always-visible search box, plus a
 * "Filtres" button that opens a dialog grouping the categorical filters into a
 * "Promoteur" section (Statut, Tranche d'âge, and one dropdown per FK) and a
 * "Projet" section (project status / stade / type). The button reflects how many
 * filters are applied; a "Réinitialiser" appears once anything is active.
 * Everything is URL-driven and resets to page 1.
 *
 * NB: the backend doesn't filter on these params yet (and filtering promoteurs by
 * project attributes needs the promoteur→micro-projet join server-side) — the UI
 * is ready for when it does.
 */
export function PromoteursFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = usePromoteurFilters();
  const refs = usePromoteurReferentials();

  const [searchInput, setSearchInput] = useState(filters.search ?? '');

  useEffect(() => {
    setSearchInput(filters.search ?? '');
  }, [filters.search]);

  const setParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      params.set('page', '1'); // any filter change resets to the first page
      const next = params.toString();
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
      setParams((params) => {
        if (searchInput) params.set('search', searchInput);
        else params.delete('search');
      });
    }, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  function setSelect(param: string, value: string) {
    setParams((params) => {
      if (value === ALL) params.delete(param);
      else params.set(param, value);
    });
  }

  function reset() {
    setSearchInput('');
    setParams((params) => {
      for (const k of FILTER_KEYS) params.delete(k);
    });
  }

  const activeCount = CATEGORICAL_KEYS.filter(
    (k) => (filters as Record<string, string | undefined>)[k],
  ).length;
  const hasAnyActive = activeCount > 0 || !!filters.search;

  // Statut + Tranche are self-contained; the FK selects come from referentials
  // and are disabled until those load.
  const promoteurSelects: SelectConfig[] = [
    { param: 'statut', label: 'Statut', options: STATUT_OPTIONS, disabled: false },
    { param: 'tranche_age', label: "Tranche d'âge", options: TRANCHE_AGE_OPTIONS, disabled: false },
    ...PROMOTEUR_FK_FILTERS.map((f) => {
      const options = refs.optionsOf(f.refKey);
      return { param: f.param, label: f.label, options, disabled: options.length === 0 };
    }),
  ];
  const projetSelects: SelectConfig[] = [
    { param: 'projet_statut', label: 'Statut du projet', options: PROJET_STATUT_OPTIONS, disabled: false },
    { param: 'projet_stade', label: 'Stade du projet', options: PROJET_STADE_OPTIONS, disabled: false },
    { param: 'projet_type', label: 'Type de projet', options: PROJET_TYPE_OPTIONS, disabled: false },
  ];

  const renderSelect = (s: SelectConfig) => (
    <div key={s.param} className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{s.label}</Label>
      <Select
        value={(filters as Record<string, string>)[s.param] ?? ALL}
        onValueChange={(v) => setSelect(s.param, v)}
        disabled={s.disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={s.label} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Tous</SelectItem>
          {s.options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Rechercher un promoteur (nom, prénom, email, matricule)…"
          className="pl-8"
        />
      </div>

      <div className="flex items-center gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={activeCount > 0 ? 'default' : 'outline'}>
              <Filter className="size-4" />
              Filtres
              {activeCount > 0 && (
                <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-foreground/20 px-1.5 text-xs font-semibold text-primary-foreground">
                  {activeCount}
                </span>
              )}
            </Button>
          </DialogTrigger>

          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Filtres</DialogTitle>
              <DialogDescription>Affinez la liste des promoteurs.</DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-2">
              <div>
                <h4 className="mb-2 text-sm font-semibold text-foreground">Promoteur</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {promoteurSelects.map(renderSelect)}
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-semibold text-foreground">Micro Projet</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {projetSelects.map(renderSelect)}
                </div>
              </div>
            </div>

            <DialogFooter>
              {hasAnyActive && (
                <Button variant="ghost" onClick={reset} className="sm:mr-auto">
                  <X className="size-4" />
                  Réinitialiser
                </Button>
              )}
              <DialogClose asChild>
                <Button>Fermer</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {hasAnyActive && (
          <Button variant="ghost" size="sm" onClick={reset} className="shrink-0">
            <X className="size-4" />
            Réinitialiser
          </Button>
        )}
      </div>
    </div>
  );
}
