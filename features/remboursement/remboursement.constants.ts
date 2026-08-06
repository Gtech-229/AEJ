import type { ModePaiement, StatutEcheance } from './remboursement.types';

export const MODES_PAIEMENT: { value: ModePaiement; label: string }[] = [
  { value: 'especes', label: 'Espèces' },
  { value: 'mobile_money', label: 'Mobile Money' },
  { value: 'virement', label: 'Virement bancaire' },
  { value: 'cheque', label: 'Chèque' },
];

export const STATUT_ECHEANCE_LABELS: Record<StatutEcheance, string> = {
  payee: 'Payée',
  en_retard: 'En retard',
  a_venir: 'À venir',
  non_definie: 'Non définie',
};
