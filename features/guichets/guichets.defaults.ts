import type { CreateGuichetPayload, Guichet } from './guichets.dto';
import type { GuichetInput } from './guichets.schema';

export function getGuichetDefaults(item?: Guichet): GuichetInput {
  return {
    code: item?.code ?? '',
    libelle: item?.libelle ?? '',
    description: item?.description ?? '',
    couleur: item?.couleur ?? '#2563eb',
    montant_min: item ? Number(item.montant_min) : undefined,
    montant_max: item ? Number(item.montant_max) : undefined,
    is_active: item?.is_active ?? true,
    is_form_active: item?.is_form_active ?? true,
    workflow_code: item?.workflow_code ?? undefined,
  };
}

export function toGuichetPayload(data: GuichetInput): CreateGuichetPayload {
  return {
    code: data.code,
    libelle: data.libelle,
    description: data.description || null,
    couleur: data.couleur || null,
    montant_min: data.montant_min ?? 0,
    montant_max: data.montant_max ?? 0,
    is_active: data.is_active ?? true,
    is_form_active: data.is_form_active ?? true,
    workflow_code: data.workflow_code || null,
  };
}
