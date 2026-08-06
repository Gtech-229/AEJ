import type { TypeRapport } from './rapport.types';

export const TYPES_RAPPORT: { id: TypeRapport; icon: string; title: string; description: string; items: string[] }[] = [
  { id: 'global', icon: '📊', title: 'Rapport global', description: "Vue d'ensemble des financements, remboursements et performances.", items: ['Résumé financier', 'Indicateurs clés', 'Répartition par banque & région'] },
  { id: 'par_banque', icon: '🏦', title: 'Rapport par banque', description: 'Synthèse des dossiers financés par banque.', items: ['Engagements par banque', 'Remboursements', 'Taux de performance'] },
  { id: 'par_agence', icon: '🏢', title: 'Rapport par agence', description: 'Analyse des performances par agence.', items: ['Portefeuille par agence', 'État des remboursements', 'Alertes & retards'] },
  { id: 'par_secteur', icon: '📈', title: 'Rapport par secteur', description: "Performance des bénéficiaires par secteur d'activité.", items: ['Répartition sectorielle', 'Rentabilité moyenne', "Indicateurs d'impact"] },
  { id: 'periodique', icon: '📅', title: 'Rapport périodique', description: 'Rapport automatique selon une périodicité définie.', items: ['Mensuel', 'Trimestriel', 'Annuel'] },
  { id: 'personnalise', icon: '👤', title: 'Rapport personnalisé', description: 'Créez un rapport avec des champs personnalisés.', items: ['Choix des champs', 'Filtres spécifiques', 'Mise en page personnalisée'] },
];
