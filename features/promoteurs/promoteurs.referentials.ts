'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { refLabel, refOptions, type RefItem } from '@/features/referentials/referentials.types';
import type { PromoteurFkParam } from './promoteurs.dto';

/**
 * FK referentials for promoteurs. They live on the SAME backend as the
 * promoteurs (`apis.aej-ci.net/public/api`), so their ids line up with the
 * promoteur FKs — hence we map on the frontend (fetch small lists once, resolve
 * labels + build filter options from them) rather than embedding full objects
 * on every row.
 *
 * One route per referential under `/aej/…`, enveloped as
 * `{ message, data: [{ id, libelle }] }`.
 */
export const REFERENTIALS_LIVE = true;

export type PromoteurRefKey =
  | 'sexe'
  | 'agenceregionale'
  | 'secteuractivite'
  | 'soussecteuractivite'
  | 'niveauetude'
  | 'situationmatrimoniale'
  | 'typepieceidentite'
  | 'typesituationhandicap'
  | 'paysnationalite';

/** Confirmed endpoint paths (kebab-case, reached via the `/api` rewrite). */
const REF_ENDPOINTS: Record<PromoteurRefKey, string> = {
  sexe: '/aej/sexes',
  agenceregionale: '/aej/agences-regionales',
  secteuractivite: '/aej/secteurs',
  soussecteuractivite: '/aej/sous-secteurs',
  niveauetude: '/aej/niveaux-etudes',
  situationmatrimoniale: '/aej/situations-matrimoniale',
  typepieceidentite: '/aej/types-pieces-identites',
  typesituationhandicap: '/aej/situations-handicaps',
  paysnationalite: '/aej/pays',
};

/** Each filterable FK: its query param, the referential to resolve, and a label. */
export const PROMOTEUR_FK_FILTERS: {
  param: PromoteurFkParam;
  refKey: PromoteurRefKey;
  label: string;
}[] = [
  { param: 'sexe_id', refKey: 'sexe', label: 'Sexe' },
  { param: 'agenceregionale_id', refKey: 'agenceregionale', label: 'Agence régionale' },
  { param: 'secteuractivite_id', refKey: 'secteuractivite', label: "Secteur d'activité" },
  { param: 'soussecteuractivite_id', refKey: 'soussecteuractivite', label: 'Sous-secteur' },
  { param: 'niveauetude_id', refKey: 'niveauetude', label: "Niveau d'étude" },
  {
    param: 'situationmatrimoniale_id',
    refKey: 'situationmatrimoniale',
    label: 'Situation matrimoniale',
  },
  { param: 'typepieceidentite_id', refKey: 'typepieceidentite', label: 'Type de pièce' },
  { param: 'typesituationhandicap_id', refKey: 'typesituationhandicap', label: 'Situation handicap' },
  { param: 'paysnationalite_id', refKey: 'paysnationalite', label: 'Pays de nationalité' },
];

/** Unwrap the `{ message, data: [...] }` envelope (tolerates a bare array too). */
function toList(raw: unknown): RefItem[] {
  if (Array.isArray(raw)) return raw as RefItem[];
  const data = (raw as { data?: unknown } | null | undefined)?.data;
  return Array.isArray(data) ? (data as RefItem[]) : [];
}

function useReferential(key: PromoteurRefKey) {
  return useQuery({
    queryKey: ['promoteur-referential', key],
    queryFn: async () => toList(await apiClient.request<unknown>(REF_ENDPOINTS[key])),
    enabled: REFERENTIALS_LIVE,
    // Referentials change rarely — keep them warm across the session.
    staleTime: 30 * 60 * 1000,
    retry: 1,
  });
}

export interface ReferentialResolver {
  /** Select options for a referential ({ label, value } with string ids). */
  optionsOf: (key: PromoteurRefKey) => { label: string; value: string }[];
  /** Human label for a FK id, falling back to `#id` until referentials load. */
  labelOf: (key: PromoteurRefKey, id: number | null | undefined) => string;
}

export function usePromoteurReferentials(): ReferentialResolver {
  const byKey: Record<PromoteurRefKey, RefItem[]> = {
    sexe: useReferential('sexe').data ?? [],
    agenceregionale: useReferential('agenceregionale').data ?? [],
    secteuractivite: useReferential('secteuractivite').data ?? [],
    soussecteuractivite: useReferential('soussecteuractivite').data ?? [],
    niveauetude: useReferential('niveauetude').data ?? [],
    situationmatrimoniale: useReferential('situationmatrimoniale').data ?? [],
    typepieceidentite: useReferential('typepieceidentite').data ?? [],
    typesituationhandicap: useReferential('typesituationhandicap').data ?? [],
    paysnationalite: useReferential('paysnationalite').data ?? [],
  };

  return {
    optionsOf: (key) =>
      refOptions(byKey[key]).map((o) => ({ label: o.label, value: String(o.value) })),
    labelOf: (key, id) => {
      if (id == null) return '—';
      const item = byKey[key].find((r) => r.id === id);
      return item ? refLabel(item) : `#${id}`;
    },
  };
}
