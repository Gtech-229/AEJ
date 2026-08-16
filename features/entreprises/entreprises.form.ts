import type { FormConfig } from '@/components/forms';
import type { TypeEntreprise } from '@/features/type-entreprises/type-entreprises.dto';
import type { Commune } from '@/features/localites/localites.dto';

/**
 * Field config for the create/edit entreprise form. Names match the API 1:1.
 * `type_entreprise_id` is a <select> fed by the type-entreprises list; `commune_id`
 * is a searchable combobox fed by the /aej/communes referential (~400 entries).
 */
export function getEntrepriseFormConfig(
  types: TypeEntreprise[],
  communes: Commune[],
): FormConfig {
  return {
    columns: 2,
    fields: [
      {
        name: 'raison_sociale',
        label: 'Raison sociale',
        type: 'text',
        required: true,
        placeholder: 'ex: Entreprise Agricole SA',
        colSpan: 'full',
      },
      { name: 'sigle', label: 'Sigle', type: 'text', placeholder: 'ex: EASA' },
      {
        name: 'type_entreprise_id',
        label: "Type d'entreprise",
        type: 'select',
        required: true,
        placeholder: 'Sélectionner un type…',
        options: types.map((t) => ({ label: t.libelle, value: t.id })),
      },
      { name: 'numero', label: 'Numéro', type: 'text', placeholder: 'ex: ENT-001' },
      { name: 'rccm', label: 'RCCM', type: 'text', placeholder: 'ex: CI-ABJ-2025-B-12345' },
      { name: 'ninea', label: 'NINEA', type: 'text', placeholder: 'Identifiant fiscal' },
      { name: 'contact', label: 'Contact', type: 'tel', placeholder: '+2250700000000' },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'contact@entreprise.ci' },
      {
        name: 'commune_id',
        label: 'Commune',
        type: 'combobox',
        placeholder: 'Sélectionner une commune…',
        options: communes.map((c) => ({ label: c.nom, value: c.id })),
      },
      { name: 'adresse', label: 'Adresse', type: 'text', colSpan: 'full' },
    ],
  };
}
