import type { IndicateurSuivi } from './indicateur-suivis.dto';
import type { ListKpiItem } from '@/components/generic/list-kpis';

export function getIndicateurSuivisKpis(items: IndicateurSuivi[]): ListKpiItem[] {
  return [
    { label: 'Mesures ce mois', value: items.length },
    { label: 'Tendance positive', value: items.filter((i) => i.statut === 'hausse').length },
    { label: 'Tendance négative', value: items.filter((i) => i.statut === 'baisse').length },
  ];
}
