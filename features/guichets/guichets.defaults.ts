import type { Guichet } from './guichets.dto';
import type { GuichetInput } from './guichets.schema';

/** Default form values — from an existing guichet (edit) or blanks (create). */
export function getGuichetDefaults(guichet?: Guichet): GuichetInput {
  return {
    code: guichet?.code ?? '',
    libelle: guichet?.libelle ?? '',
    dispositif_id: guichet?.dispositif_id ?? 0,
  };
}
