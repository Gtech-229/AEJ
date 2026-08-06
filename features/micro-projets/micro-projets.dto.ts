/**
 * API contract for the micro-projets feature — hand-written (independent of Zod).
 */
export type StatutMicroProjet = 'instruction' | 'finance' | 'rejete' | 'cloture';

export interface MicroProjet {
  id: number;
  nom: string;
  promoteur: string;
  secteur: string | null;
  montant: number;
  dateDepot: string;
  statut: StatutMicroProjet;
}

export type CreateMicroProjetPayload = {
  nom: string;
  promoteur: string;
  secteur?: string | null;
  montant: number;
  dateDepot: string;
  statut: StatutMicroProjet;
};
export type UpdateMicroProjetPayload = MicroProjet;