/**
 * API contract for the indicateurs feature — hand-written (independent of Zod).
 */
export type StatutIndicateurs = 'atteinte' | 'dessous';

export interface Indicateur {
  id: number;
  nom: string;
  cible: string;
  valeurActuelle: string;
  ecart: string | null;
  statut: StatutIndicateurs;
}

export type CreateIndicateurPayload = {
  nom: string;
  cible: string;
  valeurActuelle: string;
  ecart?: string | null;
  statut: StatutIndicateurs;
};
export type UpdateIndicateurPayload = Indicateur;
