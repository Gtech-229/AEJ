import type { TypeEntreprise } from './type-entreprises.dto';
import type { TypeEntrepriseInput } from './type-entreprises.schema';

/** Default form values — from an existing type (edit) or blanks (create). */
export function getTypeEntrepriseDefaults(type?: TypeEntreprise): TypeEntrepriseInput {
  return {
    code: type?.code ?? '',
    libelle: type?.libelle ?? '',
  };
}
