export type StatutEcheance = 'payee' | 'en_retard' | 'a_venir' | 'non_definie';

export interface Echeance {
  id: string;
  creditId: string;
  mois: string;
  montant: number;
  montantPaye: number;
  datePaiement?: string;
  modePaiement?: ModePaiement;
  statut: StatutEcheance;
}

export type ModePaiement = 'especes' | 'mobile_money' | 'virement' | 'cheque';

export interface EcheanceListParams {
  creditId: string;
}

/** Payload du formulaire "Enregistrer un paiement". */
export interface EnregistrerPaiementInput {
  echeanceId: string;
  montantPaye: number;
  datePaiement: string;
  modePaiement: ModePaiement;
}
