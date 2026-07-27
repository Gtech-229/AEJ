import type { FormConfig } from '@/components/forms';
import { AGENCE_STATUT_OPTIONS } from './agences.constants';

export const agenceFormConfig: FormConfig = {
    columns: 2,
    fields: [
        { name: 'nom', label: "Nom de l'agence", type: 'text', placeholder: 'Agence Kaloum', required: true, colSpan: 'full' },
        { name: 'ville', label: 'Ville', type: 'text', placeholder: 'Conakry', required: true },
        { name: 'responsable', label: 'Responsable', type: 'text', placeholder: 'Nom du responsable', required: true },
        { name: 'telephone', label: 'Téléphone', type: 'tel', placeholder: '+224 6XX XX XX XX' },
        { name: 'nbEmployes', label: "Nombre d'employés", type: 'number', min: 0, required: true },
        { name: 'adresse', label: 'Adresse', type: 'text', colSpan: 'full' },
        { name: 'statut', label: 'Statut', type: 'select', options: AGENCE_STATUT_OPTIONS, required: true },
    ],
};