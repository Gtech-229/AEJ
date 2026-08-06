import type { Organisme } from './organismes.dto';
import type { OrganismeInput } from './organismes.schema';

/**
 * Default form values — from an existing organisme (edit)
 * or blank values (create).
 */
export function getOrganismeDefaults(
  organisme?: Organisme,
): OrganismeInput {
  return {
    nom: organisme?.nom ?? '',
    sigle: organisme?.sigle ?? '',
    type: organisme?.type ?? 0,
    adresse: organisme?.adresse ?? '',
    telephone: organisme?.telephone ?? '',
    email: organisme?.email ?? '',
    site_web: organisme?.site_web ?? '',
    description: organisme?.description ?? '',
  };
}