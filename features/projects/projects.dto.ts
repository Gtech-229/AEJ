/**
 * API contract for micro-projets — hand-written from `GET /api/projects`
 * (apis.aej-ci.net), enveloped as `{ message, data: [...] }`. The FK to the
 * owner is `promoteur_id` (a promoteur is a jeune with ≥1 micro-projet).
 */
export type ProjetStade = 'CREATION' | 'DEVELOPPEMENT';
export type ProjetType = 'INDIVIDUEL' | 'COLLECTIF';
export type ProjetStatut =
  | 'BROUILLON'
  | 'EN_SOUMISSION'
  | 'EN_COURS'
  | 'EN_ANALYSE'
  | 'EN_FORMATION'
  | 'EN_FINANCEMENT'
  | 'EN_DECAISSEMENT'
  | 'EN_SUIVI'
  | 'EN_REMBOURSEMENT'
  | 'TERMINE';

export interface Projet {
  id: number;
  code: string;
  intitule: string;
  matricule: string;
  description: string | null;
  /** Decimal returned as a string, e.g. "31433885.07". */
  montant_total: string | null;
  dispositif_id: number | null;
  organisme_id: number | null;
  guichet_id: number | null;
  secteur_id: number | null;
  commune_id: number | null;
  agence_id: number | null;
  promoteur_id: number;
  stade_projet: ProjetStade;
  type_projet: ProjetType;
  statut: ProjetStatut;
  localisation: string | null;
  geolocalisation: string | null;
  date_certification: string | null;
  date_transmission_partenaire: string | null;
  created_at?: string;
  updated_at?: string;
}
