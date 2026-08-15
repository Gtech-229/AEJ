import type { TypeQuestion } from './formulaires-evaluation.dto';

export const TYPE_QUESTION_OPTIONS: { value: TypeQuestion; label: string }[] = [
  { value: 'text', label: 'Texte court' },
  { value: 'textarea', label: 'Texte long' },
  { value: 'number', label: 'Nombre' },
  { value: 'boolean', label: 'Oui / Non' },
  { value: 'date', label: 'Date' },
  { value: 'select', label: 'Liste de choix' },
];

export const TYPE_QUESTION_LABELS: Record<TypeQuestion, string> = Object.fromEntries(
  TYPE_QUESTION_OPTIONS.map((o) => [o.value, o.label]),
) as Record<TypeQuestion, string>;

/** TODO(backend): confirm the full `public_cible` value set (only `promoteur` seen). */
export const PUBLIC_CIBLE_OPTIONS: { value: string; label: string }[] = [
  { value: 'promoteur', label: 'Promoteur' },
  { value: 'entreprise', label: 'Entreprise' },
  { value: 'organisme', label: 'Organisme' },
  { value: 'personnel', label: 'Personnel' },
];
