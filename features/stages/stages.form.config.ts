import type { FormConfig } from '@/components/forms';
import { STAGE_STATUT_OPTIONS } from './stages.constants';

export const stageFormConfig: FormConfig = {
    columns: 2,
    fields: [
        { name: 'intitule', label: 'Intitulé', type: 'text', placeholder: 'Stagiaire Marketing Digital', required: true, colSpan: 'full' },
        { name: 'description', label: 'Description', type: 'textarea', rows: 3, colSpan: 'full' },
        { name: 'nombrePlaces', label: 'Nombre de places', type: 'number', min: 1, required: true },
        { name: 'remuneration', label: 'Rémunération (GNF)', type: 'number', min: 0 },
        { name: 'dateDebut', label: 'Date de début', type: 'date', required: true },
        { name: 'dateFin', label: 'Date de fin', type: 'date', required: true },
        { name: 'statut', label: 'Statut', type: 'select', options: STAGE_STATUT_OPTIONS, required: true },
    ],
};