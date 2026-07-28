import type { FormConfig } from '@/components/forms';
import {
    DEPARTEMENT_OPTIONS,
    POSTE_OPTIONS,
    SEXE_OPTIONS,
    STATUT_OPTIONS,
    TYPE_CONTRAT_OPTIONS,
} from './personnels.constants';

export const personnelFormConfig: FormConfig = {
    columns: 2,
    fields: [
        { name: 'nom', label: 'Nom', type: 'text', placeholder: 'Diallo', required: true },
        { name: 'prenom', label: 'Prénom', type: 'text', placeholder: 'Fatoumata', required: true },
        {
            name: 'email',
            label: 'E-mail',
            type: 'email',
            placeholder: 'fatoumata.diallo@agence.com',
            required: true,
        },
        { name: 'telephone', label: 'Téléphone', type: 'tel', placeholder: '+224 6XX XX XX XX', required: true },
        {
            name: 'poste',
            label: 'Poste',
            type: 'select',
            options: POSTE_OPTIONS,
            required: true,
        },
        {
            name: 'departement',
            label: 'Département',
            type: 'select',
            options: DEPARTEMENT_OPTIONS,
            required: true,
        },
        {
            name: 'typeContrat',
            label: 'Type de contrat',
            type: 'select',
            options: TYPE_CONTRAT_OPTIONS,
            required: true,
        },
        {
            name: 'statut',
            label: 'Statut',
            type: 'select',
            options: STATUT_OPTIONS,
            required: true,
        },
        { name: 'dateEmbauche', label: "Date d'embauche", type: 'date', required: true },
        { name: 'dateNaissance', label: 'Date de naissance', type: 'date' },
        { name: 'sexe', label: 'Sexe', type: 'select', options: SEXE_OPTIONS },
        { name: 'salaire', label: 'Salaire (GNF)', type: 'number', min: 0, step: 1000 },
        { name: 'adresse', label: 'Adresse', type: 'text', colSpan: 'full' },
        {
            name: 'notes',
            label: 'Notes',
            type: 'textarea',
            rows: 3,
            colSpan: 'full',
            helperText: 'Informations complémentaires (optionnel).',
        },
    ],
};