import type { Indicateur } from './indicateurs.dto';
import type { ListKpiItem } from '@/components/generic/list-kpis';

export function getIndicateursKpis(items: Indicateur[]): ListKpiItem[] {
  return [
    { label: 'Indicateurs suivis', value: items.length },
    { label: 'Cible atteinte', value: items.filter((i) => i.statut === 'atteinte').length },
    { label: 'En dessous cible', value: items.filter((i) => i.statut === 'dessous').length },
  ];
}
