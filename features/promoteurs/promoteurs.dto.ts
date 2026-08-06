/**
 * API contract for the promoteurs feature — hand-written (independent of Zod).
 */
export type StatutPromoteurs = 'actif' | 'attente' | 'inactif';

export interface Promoteur {
  id: number;
  nom: string;
  localite: string;
  telephone: string | null;
  nombreProjets: number;
  statut: StatutPromoteurs;
}

export type CreatePromoteurPayload = {
  nom: string;
  localite: string;
  telephone?: string | null;
  nombreProjets: number;
  statut: StatutPromoteurs;
};
export type UpdatePromoteurPayload = Promoteur;
