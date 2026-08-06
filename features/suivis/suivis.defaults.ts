import type { Suivi } from './suivis.dto';
import type { SuiviInput } from './suivis.schema';

/** Default form values — from an existing suivi (edit) or blanks (create). */
export function getSuiviDefaults(suivi?: Suivi): SuiviInput {
  return {
    projet: suivi?.projet ?? '',
    agent: suivi?.agent ?? '',
    dateVisite: suivi?.dateVisite ?? '',
    type: suivi?.type ?? '',
    statut: suivi?.statut ?? 'realisee',
  };
}
