/**
 * API contracts for the financing module — hand-written from the confirmed
 * `/api/*` bodies. `Budget` matches the real `GET /api/budgets` response.
 */
import type { Projet } from '@/features/projects/projects.dto';
import type { Organisme } from '@/features/organismes/organismes.dto';
import type { Promoteur } from '@/features/promoteurs/promoteurs.dto';
import type { Personnel } from '@/features/personnels/personnels.dto';

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

// Create shape verified live (2026-08): `montant_accorde` is a number, and
// `deblocage` is the OUI/NON enum on write (GET returns it as a boolean).
// `micro_projet_id` is UNIQUE → at most one budget per dossier.
export type CreateBudgetPayload = {
  micro_projet_id: number;
  intitule: string;
  montant_accorde: number;
  date_accord?: string | null;
  source?: string | null;
  statut: BudgetStatut;
  devise: string;
  deblocage: OuiNon;
  date_deblocage?: string | null;
  signature_convention: ConventionEtat;
  date_signature?: string | null;
  reception_acte_credit: OuiNon;
  date_reception?: string | null;
  observations?: string | null;
};
export type UpdateBudgetPayload = CreateBudgetPayload & { id: number };

// ── compte-financements ───────────────────────────────────────────────────────
// Enum values from backend_schema.md (§14 compte_financements). `avis_partenaire`
// is nullable (no default) — a compte can exist before the partner rules.
export type EtatOuverture = 'NON_OUVERT' | 'OUVERT' | 'FERME';
export type AvisPartenaire = 'ACCORDE' | 'AJOURNE' | 'REJETE';

export interface CompteFinancement {
  id: number;
  organisme_id: number;
  micro_projet_id: number;
  etat_ouverture: EtatOuverture;
  localite_ouverture: string | null;
  date_ouverture: string | null;
  avis_partenaire: AvisPartenaire | null;
  observation: string | null;
  created_at?: string;
  updated_at?: string;
  // Embedded relations on the list response.
  organisme?: Organisme;
  micro_projet?: Projet;
}

export type CreateComptePayload = {
  organisme_id: number;
  micro_projet_id: number;
  etat_ouverture: EtatOuverture;
  localite_ouverture?: string | null;
  date_ouverture?: string | null;
  avis_partenaire?: AvisPartenaire | null;
  observation?: string | null;
};

export type UpdateComptePayload = CreateComptePayload & { id: number };

// ── plan-decaissements ────────────────────────────────────────────────────────
export interface PlanDecaissement {
  id: number;
  budget_id: number;
  code: string;
  intitule: string;
  /** Decimal returned as a string, e.g. "1000000.00". */
  montant_planifie: string;
  date_prevue: string;
  // Embedded on the list response.
  budget?: Budget;
}

/** Agence régionale embedded on a décaissement (partial — display fields only). */
export interface AgenceRef {
  id: number;
  code: string | null;
  nom: string;
}

// ── declarations (décaissement + remboursement share the same shape) ──────────
export type DeclarationStatut = 'BROUILLON' | 'SOUMISE' | 'VALIDEE' | 'REJETEE';

export interface DecaissementDeclaration {
  id: number;
  plan_id: number;
  promoteur_id: number;
  /** Decimal returned as a string. */
  montant_declare: string;
  date_declaree: string;
  reference_banque: string | null;
  justificatif_path: string | null;
  observations: string | null;
  statut: DeclarationStatut;
  // Embedded on the list response.
  plan?: PlanDecaissement;
  promoteur?: Promoteur;
}

export interface RemboursementDeclaration {
  id: number;
  promoteur_id: number;
  budget_id: number;
  /** Decimal returned as a string. */
  montant_declare: string;
  date_declaree: string;
  reference_banque: string | null;
  justificatif_path: string | null;
  observations: string | null;
  statut: DeclarationStatut;
  // Embedded on the list response.
  promoteur?: Promoteur;
  budget?: Budget;
}

// ── decaissements ─────────────────────────────────────────────────────────────
export type DecaissementStatut = 'EN_ATTENTE' | 'VALIDE' | 'REJETE';

export interface Decaissement {
  id: number;
  plan_id: number;
  agence_id: number;
  /** Decimal returned as a string, e.g. "1000000.00". */
  montant_decaisse: string;
  date_decaissement: string;
  reference_banque: string | null;
  statut: DecaissementStatut;
  observations: string | null;
  // Embedded relations on the list response.
  plan?: PlanDecaissement;
  agence?: AgenceRef;
}

// ── remboursements ────────────────────────────────────────────────────────────
export type RemboursementStatut = 'EN_ATTENTE' | 'VALIDE' | 'REJETE';

export interface Remboursement {
  id: number;
  promoteur_id: number;
  budget_id: number;
  /** Decimals returned as strings, e.g. "1000000.00". */
  montant_echu: string;
  montant_paye: string;
  montant_impaye: string;
  penalites: string;
  date_paiement: string;
  observations: string | null;
  statut: RemboursementStatut;
  // Embedded relation on the list response (full promoteur object).
  promoteur?: Promoteur;
}

// ── categories-transactions ───────────────────────────────────────────────────
export interface CategorieTransaction {
  id: number;
  code: string;
  libelle: string;
  description: string | null;
  niveau: number;
  parent_id: number | null;
  // Embedded hierarchy on the list response.
  parent?: CategorieTransaction | null;
  children?: CategorieTransaction[];
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
  /** Decimal returned as a string. */
  montant: string;
  statut: TransactionStatut;
  mode_paiement: ModePaiement;
  reference: string | null;
  justificatif_path: string | null;
  observations: string | null;
  date: string;
  // Embedded on the list response (`saisi_par` is the full personnel object).
  saisi_par?: Personnel;
  micro_projet?: Projet;
  promoteur?: Promoteur;
  categorie?: CategorieTransaction;
}
