import type { FormConfig } from '@/components/forms';
import { refOptions, type RefItem } from '@/features/referentials/referentials.types';

/** Referential lists (from the AEJ v1.0 API) backing the fiche's selects. */
export interface JeuneFormRefs {
  piecesIdentites: RefItem[];
  situationsMatrimoniales: RefItem[];
  secteurs: RefItem[];
  sousSecteurs: RefItem[];
  niveauxEtudes: RefItem[];
  agencesRegionales: RefItem[];
}

const PLACEHOLDER = 'Sélectionner…';

/** Field config for the create/edit jeune fiche. Names match the API 1:1. */
export function getJeuneFormConfig(refs: JeuneFormRefs): FormConfig {
  return {
    columns: 2,
    fields: [
      { name: 'nom', label: 'Nom', type: 'text', required: true, placeholder: 'Koné' },
      { name: 'prenom', label: 'Prénom', type: 'text', required: true, placeholder: 'Aminata' },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'aminata@exemple.ci', colSpan: 'full' },
      { name: 'telephone', label: 'Téléphone', type: 'tel', required: true, placeholder: '+2250700000000' },
      {
        name: 'sexe',
        label: 'Sexe',
        type: 'select',
        required: true,
        placeholder: PLACEHOLDER,
        options: [
          { label: 'Masculin', value: 'MASCULIN' },
          { label: 'Féminin', value: 'FEMININ' },
        ],
      },
      { name: 'datenaissance', label: 'Date de naissance', type: 'date', required: true },
      { name: 'lieunaissance', label: 'Lieu de naissance', type: 'text', placeholder: 'Abidjan' },
      {
        name: 'niveauetude_id',
        label: "Niveau d'études",
        type: 'select',
        placeholder: PLACEHOLDER,
        options: refOptions(refs.niveauxEtudes),
      },
      {
        name: 'situationmatrimoniale_id',
        label: 'Situation matrimoniale',
        type: 'select',
        placeholder: PLACEHOLDER,
        options: refOptions(refs.situationsMatrimoniales),
      },
      {
        name: 'agence_id',
        label: 'Agence régionale',
        type: 'select',
        placeholder: PLACEHOLDER,
        options: refOptions(refs.agencesRegionales),
      },
      { name: 'matriculeaej', label: 'Matricule AEJ', type: 'text', placeholder: 'AEJ-2026-0001' },
      { name: 'numerocni', label: 'Numéro CNI', type: 'text' },
      { name: 'numerocnps', label: 'Numéro CNPS', type: 'text' },
      {
        name: 'typepieceidentite_id',
        label: "Type de pièce d'identité",
        type: 'select',
        placeholder: PLACEHOLDER,
        options: refOptions(refs.piecesIdentites),
      },
      {
        name: 'secteuractivite_id',
        label: "Secteur d'activité",
        type: 'select',
        placeholder: PLACEHOLDER,
        options: refOptions(refs.secteurs),
      },
      {
        name: 'soussecteuractivite_id',
        label: 'Sous-secteur',
        type: 'select',
        placeholder: PLACEHOLDER,
        options: refOptions(refs.sousSecteurs),
      },
      { name: 'nomdupere', label: 'Nom du père', type: 'text' },
      { name: 'nomdelamere', label: 'Nom de la mère', type: 'text' },
      { name: 'raison_sociale', label: 'Raison sociale (si entreprise)', type: 'text', colSpan: 'full' },
    ],
  };
}
