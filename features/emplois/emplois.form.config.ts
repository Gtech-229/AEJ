import type { FormConfig } from '@/components/forms';
import { EMPLOI_STATUT_OPTIONS, EMPLOI_TYPE_CONTRAT_OPTIONS } from './emplois.constants';

export const emploiFormConfig: FormConfig = {
    columns: 2,
    fields: [
        { name: 'intitule', label: 'Intitulé du poste', type: 'text', placeholder: 'Développeur Frontend', required: true, colSpan: 'full' },
        { name: 'description', label: 'Description', type: 'textarea', rows: 3, colSpan: 'full' },
        { name: 'typeContrat', label: 'Type de contrat', type: 'select', options: EMPLOI_TYPE_CONTRAT_OPTIONS, required: true },
        { name: 'salaire', label: 'Salaire (GNF)', type: 'number', min: 0 },
        { name: 'datePublication', label: 'Date de publication', type: 'date', required: true },
        { name: 'statut', label: 'Statut', type: 'select', options: EMPLOI_STATUT_OPTIONS, required: true },
    ],
};