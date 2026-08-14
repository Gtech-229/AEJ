import type {
  AvisPartenaire,
  BudgetStatut,
  ConventionEtat,
  DecaissementStatut,
  DeclarationStatut,
  EtatOuverture,
  ModePaiement,
  OuiNon,
  RemboursementStatut,
  TransactionStatut,
  TransactionType,
} from './financements.dto';

export const BUDGET_STATUT_LABELS: Record<BudgetStatut, string> = {
  EN_ATTENTE: 'En attente',
  APPROUVE: 'Approuvé',
  REJETE: 'Rejeté',
};
export const CONVENTION_LABELS: Record<ConventionEtat, string> = {
  NON_SIGNEE: 'Non signée',
  SIGNEE: 'Signée',
};
export const OUI_NON_LABELS: Record<OuiNon, string> = { OUI: 'Reçu', NON: 'Non reçu' };
export const ETAT_OUVERTURE_LABELS: Record<EtatOuverture, string> = {
  NON_OUVERT: 'Non ouvert',
  OUVERT: 'Ouvert',
  FERME: 'Fermé',
};
export const AVIS_PARTENAIRE_LABELS: Record<AvisPartenaire, string> = {
  ACCORDE: 'Accordé',
  AJOURNE: 'Ajourné',
  REJETE: 'Rejeté',
};

export const ETAT_OUVERTURE_OPTIONS = (
  Object.keys(ETAT_OUVERTURE_LABELS) as EtatOuverture[]
).map((value) => ({ value, label: ETAT_OUVERTURE_LABELS[value] }));

export const AVIS_PARTENAIRE_OPTIONS = (
  Object.keys(AVIS_PARTENAIRE_LABELS) as AvisPartenaire[]
).map((value) => ({ value, label: AVIS_PARTENAIRE_LABELS[value] }));
export const DECAISSEMENT_STATUT_LABELS: Record<DecaissementStatut, string> = {
  EN_ATTENTE: 'En attente',
  VALIDE: 'Validé',
  REJETE: 'Rejeté',
};
export const REMBOURSEMENT_STATUT_LABELS: Record<RemboursementStatut, string> = {
  EN_ATTENTE: 'En attente',
  VALIDE: 'Validé',
  REJETE: 'Rejeté',
};
export const DECLARATION_STATUT_LABELS: Record<DeclarationStatut, string> = {
  BROUILLON: 'Brouillon',
  SOUMISE: 'Soumise',
  VALIDEE: 'Validée',
  REJETEE: 'Rejetée',
};
export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  DEPENSE: 'Dépense',
  RECETTE: 'Recette',
};
export const TRANSACTION_STATUT_LABELS: Record<TransactionStatut, string> = {
  BROUILLON: 'Brouillon',
  VALIDE: 'Validé',
  REJETE: 'Rejeté',
};
export const MODE_PAIEMENT_LABELS: Record<ModePaiement, string> = {
  BANQUE: 'Banque',
  ESPECES: 'Espèces',
  MOBILE_MONEY: 'Mobile money',
};

/** Shared status → colour tone for financing badges (values are unique). */
export type FinancementTone = 'success' | 'warning' | 'danger' | 'neutral';

export function financementTone(value: string): FinancementTone {
  if (['APPROUVE', 'SIGNEE', 'OUI', 'OUVERT', 'VALIDE', 'VALIDEE', 'ACCORDE'].includes(value))
    return 'success';
  if (
    ['EN_ATTENTE', 'PARTIEL', 'NON_SIGNEE', 'NON', 'NON_OUVERT', 'SOUMISE', 'AJOURNE'].includes(value)
  )
    return 'warning';
  if (['REJETE', 'REJETEE', 'IMPAYE'].includes(value)) return 'danger';
  return 'neutral';
}
