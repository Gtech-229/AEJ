import type { JournalEntry } from './journal.types';

// TODO: remplacer par un appel API (ex: GET /api/journal?...) une fois le
// backend de journalisation disponible. En attendant, jeu de données de
// démonstration couvrant les principaux types d'actions.
export const SEED_JOURNAL: JournalEntry[] = [
  {
    id: '1',
    horodatage: '2026-07-24T08:12:00Z',
    utilisateur: 'Aïcha Traoré',
    role: 'Administrateur général',
    action: 'connexion',
    ressource: 'Session',
    details: 'Connexion réussie',
    adresseIp: '41.202.12.5',
  },
  {
    id: '2',
    horodatage: '2026-07-24T08:20:00Z',
    utilisateur: 'Moussa Coulibaly',
    role: 'Directeur des Finances et Partenariats',
    action: 'modification',
    ressource: 'Projet financé — INV-004-123',
    details: 'Statut changé de "suspendu" à "en_cours"',
    adresseIp: '41.202.14.9',
  },
  {
    id: '3',
    horodatage: '2026-07-23T16:45:00Z',
    utilisateur: 'Fatoumata Diarra',
    role: 'Directeur du Suivi-Évaluation',
    action: 'creation',
    ressource: "Formulaire d'évaluation",
    details: 'Création du formulaire "Évaluation trimestrielle T3"',
  },
  {
    id: '4',
    horodatage: '2026-07-23T14:02:00Z',
    utilisateur: 'Ismaël Keïta',
    role: "Directeur des Systèmes d'Information",
    action: 'suppression',
    ressource: 'Utilisateur — b.diallo@aej.gouv.ml',
    details: 'Suppression du compte (départ agent)',
    adresseIp: '41.202.10.2',
  },
  {
    id: '5',
    horodatage: '2026-07-23T11:30:00Z',
    utilisateur: 'Bintou Sangaré',
    role: 'Comptable',
    action: 'export',
    ressource: 'Financements',
    details: 'Export CSV des décaissements Q2 2026',
  },
  {
    id: '6',
    horodatage: '2026-07-22T09:15:00Z',
    utilisateur: 'Aïcha Traoré',
    role: 'Administrateur général',
    action: 'modification',
    ressource: 'Rôles & permissions — Analyste',
    details: 'Ajout du droit "modifier" sur Évaluations',
  },
  {
    id: '7',
    horodatage: '2026-07-22T08:05:00Z',
    utilisateur: 'Système',
    role: '—',
    action: 'connexion',
    ressource: 'Session',
    details: 'Échec de connexion (mot de passe incorrect) — a.diarra@aej.gouv.ml',
    adresseIp: '154.72.9.113',
  },
];
