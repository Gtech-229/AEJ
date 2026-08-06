import type { Element } from './autres.dto';
import type { ListKpiItem } from '@/components/generic/list-kpis';

export function getAutresKpis(items: Element[]): ListKpiItem[] {
  return [
    { label: 'Éléments', value: items.length },
    { label: 'Terminés', value: items.filter((i) => i.statut === 'termine').length },
    { label: 'En cours', value: items.filter((i) => i.statut === 'encours').length },
  ];
}
