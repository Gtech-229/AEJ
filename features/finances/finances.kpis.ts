import type { Operation } from './finances.dto';
import type { ListKpiItem } from '@/components/generic/list-kpis';

export function getFinancesKpis(items: Operation[]): ListKpiItem[] {
  return [
    { label: 'Total opérations', value: items.length },
    { label: 'Effectuées', value: items.filter((i) => i.statut === 'effectue').length },
    { label: 'En attente', value: items.filter((i) => i.statut === 'attente').length },
    { label: 'Montant total (FCFA)', value: items.reduce((sum, i) => sum + i.montant, 0) },
  ];
}
