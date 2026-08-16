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

/**
 * Best display label for a referential item. Pass `key` to force a specific
 * field (e.g. `refLabel(r, 'nom')`); it falls back to the default cascade
 * (libelle → intitule → nom → code → `#id`) when that field is empty.
 */
export function refLabel(r: RefItem, key?: keyof RefItem): string {
  if (key) {
    const value = r[key];
    if (value != null && value !== '') return String(value);
  }
  return r.libelle || r.intitule || r.nom || r.code || `#${r.id}`;
}

/**
 * Build DynamicForm select options from a referential list. Pass `key` to force
 * the label field (forwarded to `refLabel`).
 */
export function refOptions(items: RefItem[] | undefined, key?: keyof RefItem) {
  return (items ?? []).map((r) => ({ label: refLabel(r, key), value: r.id }));
}
