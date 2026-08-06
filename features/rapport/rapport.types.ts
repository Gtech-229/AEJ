export type TypeRapport = 'global' | 'par_banque' | 'par_agence' | 'par_secteur' | 'periodique' | 'personnalise';
export type FormatExport = 'pdf' | 'excel' | 'csv';

export interface RapportFiltres {
  type: TypeRapport;
  banque?: string;
  agence?: string;
  region?: string;
  periodeDebut?: string;
  periodeFin?: string;
  statutDossier?: string;
  secteurActivite?: string;
}

export interface RapportResultat {
  totalBeneficiaires: number;
  montantTotalEngage: number;
  montantTotalRembourse: number;
  soldeRestant: number;
  tauxRemboursement: number;
}

export interface PlanifierRapportInput extends RapportFiltres {
  periodicite: 'mensuel' | 'trimestriel' | 'annuel';
  destinataires: string[];
}
