import type { EmploiPrevu } from './emplois-prevus.dto';
import type { EmploiPrevuInput } from './emplois-prevus.schema';

/** Default form values — from an existing emploi prévu (edit) or blanks (create). */
export function getEmploiPrevuDefaults(emploi?: EmploiPrevu): EmploiPrevuInput {
  return {
    intitule_poste: emploi?.intitule_poste ?? '',
    guichet_id: emploi?.guichet_id ?? 0,
    localite_id: emploi?.localite_id ?? 0,
    nombre_prevu: emploi?.nombre_prevu ?? 0,
  };
}
