/**
 * API contract for the organismes feature.
 */

export interface Organisme {
  id: number;
  nom: string;
  sigle: string | null;
  type: number;
  adresse: string | null;
  telephone: string | null;
  email: string | null;
  site_web: string | null;
  description: string | null;
}

export type CreateOrganismePayload = {
  nom: string;
  sigle?: string | null;
  type: number;
  adresse?: string | null;
  telephone?: string | null;
  email?: string | null;
  site_web?: string | null;
  description?: string | null;
};

export type UpdateOrganismePayload = Organisme;