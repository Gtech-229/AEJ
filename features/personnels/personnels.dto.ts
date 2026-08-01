/**
 * API contract for the personnels feature — hand-written.
 * Confirmed against the Postman doc (POST/PUT /api/personnels).
 *
 * role_id/fonction_id are numeric references; is_active is server-managed
 * (present on read, absent from create/update payloads).
 */
export interface Personnel {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  role_id: number;
  fonction_id: number;
  /** NB: the API returns 0/1, not a boolean (confirmed on /personnel/me). */
  is_active?: number;
}

export type CreatePersonnelPayload = {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  mot_de_passe: string;
  role_id: number;
  fonction_id: number;
};

export type UpdatePersonnelPayload = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  role_id: number;
  fonction_id: number;
};
