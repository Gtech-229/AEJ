import type { Promoteur } from '@/features/promoteurs/promoteurs.dto';
import type { Entreprise } from '@/features/entreprises/entreprises.dto';
import type { Projet } from '@/features/projects/projects.dto';

/**
 * API contract for the embauches / emplois générés (§13.2) — `/embauches`.
 * Verified live (2026-08): each row embeds `promoteur`, `entreprise`,
 * `micro_projet`, `type_emploi`. Only `promoteur_id` + `poste` are required on create.
 */
export interface TypeEmploi {
  id: number;
  code: string;
  libelle: string;
}

export interface Embauche {
  id: number;
  promoteur_id: number;
  entreprise_id: number | null;
  micro_projet_id: number | null;
  type_emploi_id: number | null;
  poste: string;
  // Embedded on read.
  promoteur?: Promoteur;
  entreprise?: Entreprise;
  micro_projet?: Projet;
  type_emploi?: TypeEmploi;
  created_at?: string;
  updated_at?: string;
}

export type CreateEmbauchePayload = {
  promoteur_id: number;
  poste: string;
  entreprise_id?: number;
  micro_projet_id?: number;
  type_emploi_id?: number;
};

export type UpdateEmbauchePayload = CreateEmbauchePayload & { id: number };
