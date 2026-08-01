import type { Organisme } from './organismes.dto';
import type { OrganismeInput } from './organismes.schema';

/** Default form values — from an existing organisme (edit) or blanks (create). */
export function getOrganismeDefaults(organisme?: Organisme): OrganismeInput {
  return {
    nom: organisme?.nom ?? '',
    sigle: organisme?.sigle ?? '',
    // 0 → the select shows its placeholder; validation requires a real type id.
    type: organisme?.type ?? 0,
    email: organisme?.email ?? '',
    telephone: organisme?.telephone ?? '',
    adresse: organisme?.adresse ?? '',
    site_web: organisme?.site_web ?? '',
    description: organisme?.description ?? '',
  };
}
