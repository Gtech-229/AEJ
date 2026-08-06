/**
 * API contracts for the financing module — hand-written from the confirmed
 * `/api/*` bodies. `Budget` matches the real `GET /api/budgets` response.
 */
import type { Projet } from '@/features/projects/projects.dto';
import type { Organisme } from '@/features/organismes/organismes.dto';

// ── budgets ───────────────────────────────────────────────────────────────────
export type BudgetStatut = 'EN_ATTENTE' | 'APPROUVE' | 'REJETE';
export type ConventionEtat = 'NON_SIGNEE' | 'SIGNEE';
export type OuiNon = 'OUI' | 'NON';

export interface Budget {
  id: number;
  micro_projet_id: number;
  intitule: string;
  /** Decimal returned as a string, e.g. "1000000.00". */
  montant_accorde: string;
  date_accord: string | null;
  source: string | null;
  statut: BudgetStatut;
  devise: string;
  deblocage: boolean;
  date_deblocage: string | null;
  signature_convention: ConventionEtat;
  date_signature: string | null;
  reception_acte_credit: OuiNon;
  date_reception: string | null;
  observations: string | null;
  valide_par: number | null;
  created_at?: string;
  updated_at?: string;
  // Embedded relations on the list response.
  micro_projet?: Projet;
  plan_decaissements?: PlanDecaissement[];
  remboursements?: Remboursement[];
  budgets_remboursement?: unknown | null;
}

// TODO(backend): the create body documented `montant_accorde` as a number and
// `deblocage` as a string ("NON"), while GET returns a decimal string + boolean.
// Confirm the create shape when building the form.
export type CreateBudgetPayload = {
  micro_projet_id: number;
  intitule: string;
  montant_accorde: number;
  date_accord?: string | null;
  source?: string | null;
  statut: BudgetStatut;
  devise: string;
  deblocage: boolean;
  date_deblocage?: string | null;
  signature_convention: ConventionEtat;
  date_signature?: string | null;
  reception_acte_credit: OuiNon;
  date_reception?: string | null;
  observations?: string | null;
};
export type UpdateBudgetPayload = CreateBudgetPayload & { id: number };

// ── compte-financements ───────────────────────────────────────────────────────
export type EtatOuverture = 'NON_OUVERT' | 'OUVERT';
export type AvisPartenaire = 'ACCORDE' | 'AJOURNE' | 'REJETE';

export interface CompteFinancement {
  id: number;
  organisme_id: number;
  micro_projet_id: number;
  etat_ouverture: EtatOuverture;
  localite_ouverture: string;
  date_ouverture: string | null;
  avis_partenaire: AvisPartenaire;
  observation: string | null;
  created_at?: string;
  updated_at?: string;
  // Embedded relations on the list response.
  organisme?: Organisme;
  micro_projet?: Projet;
}

// ── plan-decaissements ────────────────────────────────────────────────────────
export interface PlanDecaissement {
  id: number;
  budget_id: number;
  code: string;
  intitule: string;
  montant_planifie: number;
  date_prevue: string;
}

// ── declarations (décaissement + remboursement share the same shape) ──────────
export type DeclarationStatut = 'BROUILLON' | 'SOUMISE' | 'VALIDEE' | 'REJETEE';

export interface DecaissementDeclaration {
  id: number;
  plan_id: number;
  promoteur_id: number;
  montant_declare: number;
  date_declaree: string;
  reference_banque: string | null;
  justificatif_path: string | null;
  observations: string | null;
  statut: DeclarationStatut;
}

export interface RemboursementDeclaration {
  id: number;
  promoteur_id: number;
  budget_id: number;
  montant_declare: number;
  date_declaree: string;
  reference_banque: string | null;
  justificatif_path: string | null;
  observations: string | null;
  statut: DeclarationStatut;
}

// ── decaissements ─────────────────────────────────────────────────────────────
export type DecaissementStatut = 'EN_ATTENTE' | 'VALIDE' | 'REJETE';

export interface Decaissement {
  id: number;
  plan_id: number;
  agence_id: number;
  montant_decaisse: number;
  date_decaissement: string;
  reference_banque: string | null;
  statut: DecaissementStatut;
  observations: string | null;
  projet_intitule?: string;
  plan_intitule?: string;
}

// ── remboursements ────────────────────────────────────────────────────────────
export type RemboursementStatut = 'EN_ATTENTE' | 'VALIDE' | 'REJETE';

export interface Remboursement {
  id: number;
  promoteur_id: number;
  budget_id: number;
  montant_echu: number;
  montant_paye: number;
  montant_impaye: number;
  penalites: number;
  date_paiement: string;
  observations: string | null;
  statut: RemboursementStatut;
  projet_intitule?: string;
  promoteur?: string;
}

// ── categories-transactions ───────────────────────────────────────────────────
export interface CategorieTransaction {
  id: number;
  code: string;
  libelle: string;
  description: string | null;
  niveau: number;
  parent_id: number | null;
}

// ── transactions ──────────────────────────────────────────────────────────────
export type TransactionType = 'DEPENSE' | 'RECETTE';
export type TransactionStatut = 'BROUILLON' | 'VALIDE' | 'REJETE';
export type ModePaiement = 'BANQUE' | 'ESPECES' | 'MOBILE_MONEY';

export interface Transaction {
  id: number;
  micro_projet_id: number;
  promoteur_id: number;
  categorie_id: number;
  libelle: string;
  type: TransactionType;
  montant: number;
  statut: TransactionStatut;
  mode_paiement: ModePaiement;
  reference: string | null;
  justificatif_path: string | null;
  observations: string | null;
  date: string;
  saisi_par: number;
}
