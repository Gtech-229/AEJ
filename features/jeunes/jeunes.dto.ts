/**
 * API contract for the jeunes (bénéficiaires) feature — hand-written from the
 * `jeunes` table (see .claude/backend_schema.md §12).
 *
 * TODO(backend): confirm endpoint (assumed /jeunes) + response envelope, and the
 * creation/credential flow — jeunes self-register on mobile (#2), so the
 * backoffice create form omits `mot_de_passe` (backend-generated or set on
 * mobile). `matriculeaej` and `statut` are treated as server-managed on create.
 */
export type Sexe = 'MASCULIN' | 'FEMININ';

export interface Jeune {
  id: number;
  nom: string;
  prenom: string;
  email: string | null;
  telephone: string;
  sexe: Sexe;
  datenaissance: string; // yyyy-MM-dd
  lieunaissance: string | null;
  matriculeaej: string | null;
  numerocni: string | null;
  numerocnps: string | null;
  raison_sociale: string | null;
  typepieceidentite_id: number | null;
  secteuractivite_id: number | null;
  soussecteuractivite_id: number | null;
  situationmatrimoniale_id: number | null;
  // TODO(backend): confirm the jeune field names for these AEJ referentials
  // (niveau d'études + agence régionale) — not in the base `jeunes` schema.
  niveauetude_id: number | null;
  agence_id: number | null;
  nomdupere: string | null;
  nomdelamere: string | null;
  /** 0/1, server-managed (present on read). */
  statut?: number;
  created_at?: string;
  updated_at?: string;
}

export type CreateJeunePayload = {
  nom: string;
  prenom: string;
  email?: string;
  telephone: string;
  sexe: Sexe;
  datenaissance: string;
  lieunaissance?: string;
  matriculeaej?: string;
  numerocni?: string;
  numerocnps?: string;
  raison_sociale?: string;
  typepieceidentite_id?: number;
  secteuractivite_id?: number;
  soussecteuractivite_id?: number;
  situationmatrimoniale_id?: number;
  niveauetude_id?: number;
  agence_id?: number;
  nomdupere?: string;
  nomdelamere?: string;
};

export type UpdateJeunePayload = CreateJeunePayload & { id: number };
