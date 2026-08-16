import type { FormConfig } from '@/components/forms';
import type { Secteur } from '@/features/secteurs/secteurs.dto';

/** Field config for the create/edit programme form. `secteur_id` from /aej/secteurs. */
export function getMegaProjetFormConfig(secteurs: Secteur[]): FormConfig {
  return {
    columns: 1,
    fields: [
      {
        name: 'titre',
        label: 'Titre du projet',
        type: 'text',
        required: true,
        placeholder: 'ex: Projet de développement agricole',
      },
      {
        name: 'secteur_id',
        label: "Secteur d'activité",
        type: 'combobox',
        placeholder: 'Sélectionner un secteur…',
        options: secteurs.map((s) => ({ label: s.libelle, value: s.id })),
      },
    ],
  };
}
