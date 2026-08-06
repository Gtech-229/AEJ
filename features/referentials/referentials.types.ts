/**
 * Generic AEJ referential item. Different endpoints label their entries
 * differently (libelle / intitule / nom / code), so we accept them all and
 * resolve a display label defensively.
 */
export interface RefItem {
  id: number;
  libelle?: string | null;
  intitule?: string | null;
  nom?: string | null;
  code?: string | null;
  /** ISO-2 country code (present on `/aej/pays`), e.g. "CI" — used for flags. */
  code_iso?: string | null;
}

/** Best display label for a referential item. */
export function refLabel(r: RefItem): string {
  return r.libelle || r.intitule || r.nom || r.code || `#${r.id}`;
}

/** Build DynamicForm select options from a referential list. */
export function refOptions(items: RefItem[] | undefined) {
  return (items ?? []).map((r) => ({ label: refLabel(r), value: r.id }));
}
