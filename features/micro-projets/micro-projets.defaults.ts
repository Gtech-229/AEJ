import type { MicroProjet } from './micro-projets.dto';
import type { MicroProjetInput } from './micro-projets.schema';

/** Default form values — from an existing micro-projet (edit) or blanks (create). */
export function getMicroProjetDefaults(microProjet?: MicroProjet): MicroProjetInput {
  return {
    nom: microProjet?.nom ?? '',
    promoteur: microProjet?.promoteur ?? '',
    secteur: microProjet?.secteur ?? '',
    montant: microProjet?.montant ?? 0,
    dateDepot: microProjet?.dateDepot ?? '',
    statut: microProjet?.statut ?? 'instruction',
  };
}