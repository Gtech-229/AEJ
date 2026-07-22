/**
 * API contract for the users (personnels) feature — hand-written.
 * Confirmed against the Postman doc (POST/PUT /api/personnels).
 *
 * NB: replaces the earlier demo shape (role: 'admin'|'gestionnaire'|...,
 * statut: 'actif'|'inactif') with the real API contract: role_id/fonction_id
 * are numeric references, and is_active is server-managed (present on read,
 * absent from create/update payloads).
 */
export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  role_id: number;
  fonction_id: number;
  is_active?: boolean;
}

export type CreateUserPayload = {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  mot_de_passe: string;
  role_id: number;
  fonction_id: number;
};

export type UpdateUserPayload = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  role_id: number;
  fonction_id: number;
};