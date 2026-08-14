import type { Secteur } from '@/features/secteurs/secteurs.dto';

/**
 * Mega-projets = the AEJ programmes (§9 `projets`), the top-level cadre a
 * dispositif (§11) and zones d'intervention hang off. Endpoint `/mega-projets`.
 * NB: `/projets` is the micro-projets, not these. Shape verified live (2026-08).
 */
export interface MegaProjet {
  id: number;
  secteur_id: number | null;
  titre: string;
  created_at?: string;
  updated_at?: string;
  /** Embedded on read. */
  secteur?: Secteur | null;
}

export type CreateMegaProjetPayload = {
  titre: string;
  secteur_id?: number | null;
};

export type UpdateMegaProjetPayload = CreateMegaProjetPayload & { id: number };
