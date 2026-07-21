/**
 * API contract for the users feature — hand-written (independent of Zod).
 */
export type UserRole = 'admin' | 'gestionnaire' | 'consultant';
export type UserStatut = 'actif' | 'inactif';

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: UserRole;
  statut: UserStatut;
}

export type CreateUserPayload = Omit<User, 'id'>;
export type UpdateUserPayload = User;
