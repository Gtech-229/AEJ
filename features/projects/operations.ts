/**
 * Project operations — the dépenses / recettes recorded against a micro-projet,
 * from which its profitability (rentabilité) is derived.
 *
 * TODO(backend): no endpoint yet. Once it exists, fetch a project's operations
 * and feed them to `computeProfitability`.
 */
export type OperationType = 'DEPENSE' | 'RECETTE';

export interface Operation {
  id: number;
  projet_id: number;
  type: OperationType;
  libelle: string;
  /** Decimal, possibly a string like the project's `montant_total`. */
  montant: string | number;
  date?: string;
}

export interface Profitability {
  recettes: number;
  depenses: number;
  resultat: number;
  /** Marge = résultat / recettes, in [−∞, 1]; `null` when there are no recettes. */
  marge: number | null;
}

export function computeProfitability(operations: Operation[]): Profitability {
  let recettes = 0;
  let depenses = 0;
  for (const op of operations) {
    const montant = Number(op.montant) || 0;
    if (op.type === 'RECETTE') recettes += montant;
    else depenses += montant;
  }
  const resultat = recettes - depenses;
  const marge = recettes > 0 ? resultat / recettes : null;
  return { recettes, depenses, resultat, marge };
}
