import type { Entreprise } from './entreprises.dto';
import type { EntrepriseInput } from './entreprises.schema';

/** Default form values — from an existing entreprise (edit) or blanks (create). */
export function getEntrepriseDefaults(entreprise?: Entreprise): EntrepriseInput {
  return {
    raison_sociale: entreprise?.raison_sociale ?? '',
    // 0 → the select shows its placeholder; validation requires a real type id.
    type_entreprise_id: entreprise?.type_entreprise_id ?? 0,
    numero: entreprise?.numero ?? '',
    sigle: entreprise?.sigle ?? '',
    rccm: entreprise?.rccm ?? '',
    ninea: entreprise?.ninea ?? '',
    adresse: entreprise?.adresse ?? '',
    contact: entreprise?.contact ?? '',
    email: entreprise?.email ?? '',
    commune_id: entreprise?.commune_id ?? undefined,
  };
}
