import type { Element } from './autres.dto';
import type { ElementInput } from './autres.schema';

/** Default form values — from an existing element (edit) or blanks (create). */
export function getElementDefaults(element?: Element): ElementInput {
  return {
    nom: element?.nom ?? '',
    type: element?.type ?? '',
    dateModification: element?.dateModification ?? '',
    responsable: element?.responsable ?? '',
    statut: element?.statut ?? 'termine',
  };
}
