import type { User } from './users.dto';
import type { CreateUserInput, UpdateUserInput } from './users.schema';

export function getCreateUserDefaults(): CreateUserInput {
  return {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    mot_de_passe: '',
    role_id: 0,
    fonction_id: 0,
  };
}

export function getUpdateUserDefaults(user: User): UpdateUserInput {
  return {
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    telephone: user.telephone,
    adresse: user.adresse,
    role_id: user.role_id,
    fonction_id: user.fonction_id,
  };
}