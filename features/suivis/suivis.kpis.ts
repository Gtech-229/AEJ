import type { Suivi } from './suivis.dto';
import type { ListKpiItem } from '@/components/generic/list-kpis';

export function getSuivisKpis(items: Suivi[]): ListKpiItem[] {
  return [
    { label: 'Visites planifiées', value: items.length },
    { label: 'Réalisées', value: items.filter((i) => i.statut === 'realisee').length },
    { label: 'En retard', value: items.filter((i) => i.statut === 'retard').length },
    { label: 'Agents distincts', value: (new Set(items.map((i) => i.agent))).size },
  ];
}
