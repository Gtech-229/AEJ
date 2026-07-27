import type { Localite } from './localites.dto';
import type { LocaliteInput } from './localites.schema';

/** Default form values — from an existing localite (edit) or blanks (create). */
export function getLocaliteDefaults(localite?: Localite): LocaliteInput {
  return {
    nom: localite?.nom ?? '',
    code: localite?.code ?? '',
    couche_cartographique: localite?.couche_cartographique ?? '',
    niveau_localite_id: localite?.niveau_localite_id ?? 0,
  };
}