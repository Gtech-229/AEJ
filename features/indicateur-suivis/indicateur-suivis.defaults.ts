import type { IndicateurSuivi } from './indicateur-suivis.dto';
import type { IndicateurSuiviInput } from './indicateur-suivis.schema';

/** Default form values — from an existing indicateurSuivi (edit) or blanks (create). */
export function getIndicateurSuiviDefaults(indicateurSuivi?: IndicateurSuivi): IndicateurSuiviInput {
  return {
    indicateur: indicateurSuivi?.indicateur ?? '',
    periode: indicateurSuivi?.periode ?? '',
    valeur: indicateurSuivi?.valeur ?? '',
    evolution: indicateurSuivi?.evolution ?? '',
    statut: indicateurSuivi?.statut ?? 'hausse',
  };
}
