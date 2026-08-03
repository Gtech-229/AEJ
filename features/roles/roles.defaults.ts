import type { Role } from './roles.dto';
import type { RoleInput } from './roles.schema';

/** Default form values — from an existing role (edit) or blanks (create). */
export function getRoleDefaults(role?: Role): RoleInput {
  return {
    code: role?.code ?? '',
    libelle: role?.libelle ?? '',
    description: role?.description ?? '',
  };
}
