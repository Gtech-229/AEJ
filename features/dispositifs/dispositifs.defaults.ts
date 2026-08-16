import type { CreateDispositifPayload, Dispositif } from './dispositifs.dto';
import type { DispositifInput } from './dispositifs.schema';

export function getDispositifDefaults(item?: Dispositif): DispositifInput {
  return {
    code: item?.code ?? '',
    projet_id: item?.projet_id ?? 0,
    intitule: item?.intitule ?? '',
    budget_alloue: item ? Number(item.budget_alloue) : 0,
    nbre_emplois_prevu: item?.nbre_emplois_prevu ?? 0,
    nbre_beneficiaire_prevu: item?.nbre_beneficiaire_prevu ?? 0,
    nbre_micro_projet_prevu: item?.nbre_micro_projet_prevu ?? 0,
  };
}

export function toDispositifPayload(data: DispositifInput): CreateDispositifPayload {
  return {
    code: data.code,
    projet_id: data.projet_id,
    intitule: data.intitule,
    budget_alloue: data.budget_alloue,
    nbre_emplois_prevu: data.nbre_emplois_prevu,
    nbre_beneficiaire_prevu: data.nbre_beneficiaire_prevu,
    nbre_micro_projet_prevu: data.nbre_micro_projet_prevu,
  };
}
