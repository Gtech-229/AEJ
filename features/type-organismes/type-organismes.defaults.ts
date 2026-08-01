import type { TypeOrganisme } from './type-organismes.dto';
import type { TypeOrganismeInput } from './type-organismes.schema';

/** Default form values — from an existing type (edit) or blanks (create). */
export function getTypeOrganismeDefaults(type?: TypeOrganisme): TypeOrganismeInput {
  return {
    code: type?.code ?? '',
    libelle: type?.libelle ?? '',
  };
}
