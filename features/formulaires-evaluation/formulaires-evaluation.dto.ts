/**
 * API contract for the evaluation forms (§14.1) — `/formulaires-evaluation`.
 * A formulaire embeds its `questions[]`; questions are created nested in the
 * formulaire payload. Verified live (2026-08).
 */
export type TypeQuestion = 'text' | 'textarea' | 'number' | 'boolean' | 'date' | 'select';

export interface FormulaireQuestion {
  id?: number;
  formulaire_id?: number;
  code: string;
  libelle: string;
  type_question: TypeQuestion;
  /** List of choices for `select`; `null` for other types. */
  options: string[] | null;
  ordre: number;
  affichage: boolean;
  obligatoire: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FormulaireEvaluation {
  id: number;
  code: string;
  libelle: string;
  /** Who the form targets, e.g. "promoteur". */
  public_cible: string;
  actif: boolean;
  questions: FormulaireQuestion[];
  created_at?: string;
  updated_at?: string;
}

export type QuestionPayload = {
  code: string;
  libelle: string;
  type_question: TypeQuestion;
  options: string[] | null;
  ordre: number;
  affichage: boolean;
  obligatoire: boolean;
};

export type CreateFormulairePayload = {
  code: string;
  libelle: string;
  public_cible: string;
  actif: boolean;
  questions: QuestionPayload[];
};

export type UpdateFormulairePayload = CreateFormulairePayload & { id: number };
