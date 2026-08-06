/**
 * API contract for the autres feature — hand-written (independent of Zod).
 */
export type StatutAutres = 'termine' | 'encours';

export interface Element {
  id: number;
  nom: string;
  type: string;
  dateModification: string;
  responsable: string | null;
  statut: StatutAutres;
}

export type CreateElementPayload = {
  nom: string;
  type: string;
  dateModification: string;
  responsable?: string | null;
  statut: StatutAutres;
};
export type UpdateElementPayload = Element;
