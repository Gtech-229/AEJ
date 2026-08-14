import type { Personnel } from './personnels.dto';
import type { CreatePersonnelInput, UpdatePersonnelInput } from './personnels.schema';

export function getCreatePersonnelDefaults(): CreatePersonnelInput {
  return {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    role_id: 0,
    fonction_id: 0,
    organisme_id: undefined,
    agence_regionale_id: undefined,
  };
}

export function getUpdatePersonnelDefaults(personnel: Personnel): UpdatePersonnelInput {
  return {
    nom: personnel.nom,
    prenom: personnel.prenom,
    email: personnel.email,
    telephone: personnel.telephone,
    adresse: personnel.adresse,
    role_id: personnel.role_id,
    fonction_id: personnel.fonction_id,
    organisme_id: personnel.organisme_id ?? undefined,
    agence_regionale_id: personnel.agence_regionale_id ?? undefined,
  };
}
