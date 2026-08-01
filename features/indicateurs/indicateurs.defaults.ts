import type { Indicateur } from './indicateurs.dto';
import type { IndicateurInput } from './indicateurs.schema';

/** Default form values — from an existing indicateur (edit) or blanks (create). */
export function getIndicateurDefaults(indicateur?: Indicateur): IndicateurInput {
  return {
    nom: indicateur?.nom ?? '',
    type_valeur: indicateur?.type_valeur ?? '',
    unite: indicateur?.unite ?? '',
    description: indicateur?.description ?? '',
  };
}
