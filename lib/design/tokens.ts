/**
 * Design tokens — AEJ Dashboard V2 (cf. AEJ-Dashboard-V2-Design-System.pdf).
 * Source de vérité unique pour les couleurs, évite de disperser des hex en dur
 * dans chaque composant.
 */
export const COLORS = {
    green: '#167C3B',
    orange: '#F57C00',
    blue: '#2563EB',
    violet: '#8B5CF6',
    teal: '#16A085',
    bg: '#F6F8FB',
    text: '#1F2937',
} as const;

export type AccentName = 'green' | 'blue' | 'violet' | 'orange' | 'teal';

/** Cercle d'icône pastel + couleur pleine, comme sur les cartes KPI de la maquette. */
export const ACCENTS: Record<AccentName, { bg: string; fg: string }> = {
    green: { bg: '#E7F5EC', fg: COLORS.green },
    blue: { bg: '#EAF1FE', fg: COLORS.blue },
    violet: { bg: '#F1EDFC', fg: COLORS.violet },
    orange: { bg: '#FDF0E3', fg: COLORS.orange },
    teal: { bg: '#E5F5F1', fg: COLORS.teal },
};

/** Rayon de carte du design system (16–20px) — utiliser rounded-2xl (16px) par défaut. */
export const CARD_RADIUS = 'rounded-2xl';