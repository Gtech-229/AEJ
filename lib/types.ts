import { Departement, Poste, Sexe, StatutPersonnel, TypeContrat } from "@/features/personnels/personnels.constants";

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'gestionnaire' | 'consultant';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface KpiData {
  total_stagiaires: number;
  stages_en_cours: number;
  stages_acheves: number;
  emplois_obtenus: number;
  taux_insertion: number;
  variation_stagiaires: number;
  variation_stages_cours: number;
  variation_stages_acheves: number;
  variation_emplois: number;
}

export interface EvolutionPoint {
  mois: string;
  financement: number;
  stage: number;
}

export interface RepartitionItem {
  label: string;
  pourcentage: number;
  valeur: number;
  color: string;
}

export interface Financement {
  id: number;
  code: string;
  partenaire: string;
  date: string;
  statut: 'en_cours' | 'acheve' | 'suspendu';
  montant_total: number;
  montant_decaisse: number;
}

export interface Entreprise {
  id: number;
  nom: string;
  secteur: string;
  initiales: string;
}

export interface Stagiaire {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  statut: 'en_stage' | 'stage_acheve' | 'emploi_obtenu' | 'en_recherche';
  entreprise?: string;
  date_debut?: string;
  date_fin?: string;
}

export interface Offre {
  id: number;
  titre: string;
  entreprise: string;
  secteur: string;
  type: 'stage' | 'emploi';
  date_limite: string;
  statut: 'active' | 'pourvue' | 'expiree';
  candidatures: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface Personnel {
  id: number;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  poste: Poste;
  departement: Departement;
  typeContrat: TypeContrat;
  statut: StatutPersonnel;
  dateEmbauche: string; // ISO (yyyy-MM-dd)
  dateNaissance?: string;
  sexe?: Sexe;
  adresse?: string;
  salaire?: number;
  superviseurId?: string | null;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}



export type CreatePersonnelInput = Omit<
  Personnel,
  'id' | 'matricule' | 'createdAt' | 'updatedAt'
>;
 
export type UpdatePersonnelInput = Partial<CreatePersonnelInput> & { id: number };
 
export interface PersonnelListParams {
  page?: number;
  size?: number;
  q?: string;
  departement?: Departement;
  statut?: StatutPersonnel;
  sort?: string;
}
 
export interface PersonnelListResponse {
  data: Personnel[];
  total: number;
  page: number;
  size: number;
}