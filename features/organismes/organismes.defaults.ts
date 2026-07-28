import type { Organisme } from './organismes.dto';
import type { OrganismeInput } from './organismes.schema';

export function getOrganismeDefaults(organisme?: Organisme): OrganismeInput {
  return {
    nom: organisme?.nom ?? '',
    sigle: organisme?.sigle ?? '',
    type_id: organisme?.type_id ?? 0,
    region_id: organisme?.region_id ?? 0,
  };
}