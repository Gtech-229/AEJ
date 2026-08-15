/**
 * AEJ geographic reference hierarchy — exposed READ-ONLY under `/aej/*` on the
 * main API. The old flat `localites` + `niveaux_localite` model was dropped
 * backend-side (2026-08); these national referentials replace it.
 *
 * Hierarchy: Division régionale → Ville → Commune / Lieu d'habitation.
 * Verified live (2026-08) against apis.aej-ci.net.
 */
export interface DivisionRegionale {
  id: number;
  code: string | null;
  nom: string;
}

export interface Ville {
  id: number;
  /** Present in the shape but currently null across the dataset. */
  departement_id: number | null;
  code: string | null;
  nom: string;
}

export interface Commune {
  id: number;
  nom: string;
  ville_id: number | null;
  divisionregionaleaej_id: number | null;
}

export interface LieuHabitation {
  id: number;
  nom: string;
  ville_id: number | null;
}
