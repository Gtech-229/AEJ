import type { Dossier } from './workflow.dto';
import type { DossierInput } from './workflow.schema';

/** Default form values — from an existing dossier (edit) or blanks (create). */
export function getDossierDefaults(dossier?: Dossier): DossierInput {
  return {
    nom: dossier?.nom ?? '',
    etape: dossier?.etape ?? '',
    responsable: dossier?.responsable ?? '',
    depuis: dossier?.depuis ?? '',
    statut: dossier?.statut ?? 'valide',
  };
}
