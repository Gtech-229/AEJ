export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqSection {
  id: string;
  title: string;
  items: FaqItem[];
}

// Contenu de départ — à enrichir au fur et à mesure des retours utilisateurs.
// Chaque section correspond à un module visible dans la Sidebar.
export const FAQ_SECTIONS: FaqSection[] = [
  {
    id: 'stagiaires',
    title: 'Stagiaires',
    items: [
      {
        question: 'Comment ajouter un nouveau stagiaire ?',
        answer:
          "Depuis la page Stagiaires, cliquez sur « Ajouter un stagiaire » en haut à droite. Renseignez les informations personnelles, la formation suivie et le statut, puis validez.",
      },
      {
        question: "Comment suivre l'évolution d'un stage en cours ?",
        answer:
          "Ouvrez la fiche du stagiaire depuis la liste : vous y trouverez le statut du stage, les dates clés et l'historique des évaluations associées.",
      },
    ],
  },
  {
    id: 'offres',
    title: 'Offres & Matching',
    items: [
      {
        question: 'Quelle est la différence entre une offre de stage et une offre d\'emploi ?',
        answer:
          "Les offres de stage concernent des placements temporaires liés à une formation, tandis que les offres d'emploi correspondent à des postes durables proposés par les entreprises partenaires.",
      },
      {
        question: 'Comment fonctionne le matching automatique ?',
        answer:
          "Le module Matching rapproche le profil des stagiaires (compétences, secteur, région) avec les offres disponibles et propose une liste de correspondances classées par pertinence.",
      },
    ],
  },
  {
    id: 'financements',
    title: 'Financements',
    items: [
      {
        question: 'Où voir le budget consommé par projet ?',
        answer:
          "La page Financements > Projets financés affiche pour chaque projet le budget alloué, le montant décaissé et le statut d'avancement.",
      },
      {
        question: 'Qui peut ajouter un nouveau partenaire financier ?',
        answer:
          "L'ajout de partenaires est réservé aux profils Direction Finances & Partenariats, Comptable et aux administrateurs.",
      },
    ],
  },
  {
    id: 'evaluations',
    title: 'Évaluations',
    items: [
      {
        question: "Comment créer un nouveau formulaire d'évaluation ?",
        answer:
          "Depuis Évaluations > Formulaires, cliquez sur « Créer un formulaire », choisissez le modèle de départ ou partez d'un formulaire vierge, puis ajoutez vos champs.",
      },
      {
        question: 'Où consulter les résultats consolidés ?',
        answer:
          "La page Évaluations > Résultats regroupe les réponses par formulaire, avec des filtres par période et par région.",
      },
    ],
  },
  {
    id: 'personnel',
    title: 'Personnel & Paramétrage',
    items: [
      {
        question: "Comment ajouter un membre du personnel de l'agence ?",
        answer:
          "Depuis Personnel, cliquez sur « Ajouter un employé ». Ce module est réservé aux administrateurs et à la Direction des Systèmes d'Information.",
      },
      {
        question: 'Comment modifier les droits associés à un rôle ?',
        answer:
          "Rendez-vous dans Paramétrage > Rôles & permissions. Seuls l'administrateur général et le directeur général peuvent modifier la matrice de droits ; les autres profils la consultent en lecture seule.",
      },
      {
        question: "Où consulter l'historique des actions effectuées sur la plateforme ?",
        answer:
          "Le Journal d'activité (Paramétrage > Journal d'activité) liste chronologiquement les connexions, créations, modifications et suppressions effectuées par les utilisateurs.",
      },
    ],
  },
];
