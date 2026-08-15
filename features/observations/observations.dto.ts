import type { Personnel } from '@/features/personnels/personnels.dto';

/**
 * Agent observations on a micro-projet (`/observations`). Create contract
 * verified live (2026-08): requires `micro_projet_id`, `auteur_id`, `observation`.
 */
export interface Observation {
  id: number;
  micro_projet_id: number;
  auteur_id: number;
  observation: string;
  created_at?: string;
  updated_at?: string;
  /** Embedded author (when the API returns it). */
  auteur?: Personnel;
}

export type CreateObservationPayload = {
  micro_projet_id: number;
  auteur_id: number;
  observation: string;
};
