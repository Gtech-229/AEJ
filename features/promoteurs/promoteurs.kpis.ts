import type { Promoteur } from './promoteurs.dto';
import type { ListKpiItem } from '@/components/generic/list-kpis';

export function getPromoteursKpis(items: Promoteur[]): ListKpiItem[] {
  return [
    { label: 'Total promoteurs', value: items.length },
    { label: 'Actifs', value: items.filter((i) => i.statut === 'actif').length },
    { label: 'En attente', value: items.filter((i) => i.statut === 'attente').length },
    { label: 'Localités distinctes', value: (new Set(items.map((i) => i.localite))).size },
  ];
}
