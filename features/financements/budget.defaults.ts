import type { Budget, CreateBudgetPayload, OuiNon } from './financements.dto';
import type { BudgetInput } from './budget.schema';

/** Build the form's default values from an existing budget (edit) or blank. */
export function getBudgetDefaults(item?: Budget): BudgetInput {
  return {
    intitule: item?.intitule ?? '',
    montant_accorde: item ? Number(item.montant_accorde) : 0,
    devise: item?.devise ?? 'XOF',
    source: item?.source ?? '',
    statut: item?.statut ?? 'EN_ATTENTE',
    signature_convention: item?.signature_convention ?? 'NON_SIGNEE',
    reception_acte_credit: item?.reception_acte_credit ?? 'NON',
    deblocage: item?.deblocage ? 'OUI' : 'NON',
    date_accord: item?.date_accord?.slice(0, 10) ?? '',
    date_signature: item?.date_signature?.slice(0, 10) ?? '',
    date_reception: item?.date_reception?.slice(0, 10) ?? '',
    date_deblocage: item?.date_deblocage?.slice(0, 10) ?? '',
    observations: item?.observations ?? '',
  };
}

/** Map validated form input → API payload (empty strings → null). */
export function toBudgetPayload(data: BudgetInput, micro_projet_id: number): CreateBudgetPayload {
  return {
    micro_projet_id,
    intitule: data.intitule,
    montant_accorde: data.montant_accorde,
    devise: data.devise,
    source: data.source || null,
    statut: data.statut,
    signature_convention: data.signature_convention,
    reception_acte_credit: data.reception_acte_credit,
    deblocage: data.deblocage,
    date_accord: data.date_accord || null,
    date_signature: data.date_signature || null,
    date_reception: data.date_reception || null,
    date_deblocage: data.date_deblocage || null,
    observations: data.observations || null,
  };
}

/** Map an existing budget → payload (for status-only actions like "valider"). */
export function budgetToPayload(b: Budget): CreateBudgetPayload {
  return {
    micro_projet_id: b.micro_projet_id,
    intitule: b.intitule,
    montant_accorde: Number(b.montant_accorde),
    devise: b.devise,
    source: b.source,
    statut: b.statut,
    signature_convention: b.signature_convention,
    reception_acte_credit: b.reception_acte_credit,
    deblocage: (b.deblocage ? 'OUI' : 'NON') as OuiNon,
    date_accord: b.date_accord,
    date_signature: b.date_signature,
    date_reception: b.date_reception,
    date_deblocage: b.date_deblocage,
    observations: b.observations,
  };
}
