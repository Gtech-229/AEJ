import type { User } from './users.dto';
import type { UserInput } from './users.schema';

/** Default form values — from an existing user (edit) or blanks (create). */
export function getUserDefaults(user?: User): UserInput {
  return {
    nom: user?.nom ?? '',
    prenom: user?.prenom ?? '',
    email: user?.email ?? '',
    telephone: user?.telephone ?? '',
    role: user?.role ?? 'consultant',
    statut: user?.statut ?? 'actif',
  };
}
