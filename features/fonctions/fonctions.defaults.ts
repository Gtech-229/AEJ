import type { Fonction } from './fonctions.dto';
import type { FonctionInput } from './fonctions.schema';

/** Default form values — from an existing fonction (edit) or blanks (create). */
export function getFonctionDefaults(fonction?: Fonction): FonctionInput {
  return {
    nom: fonction?.nom ?? '',
    code: fonction?.code ?? '',
    description: fonction?.description ?? '',
    service_id: fonction?.service_id ?? 0,
  };
}