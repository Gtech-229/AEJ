import type { Dossier } from './workflow.dto';
import type { ListKpiItem } from '@/components/generic/list-kpis';

export function getWorkflowKpis(items: Dossier[]): ListKpiItem[] {
  return [
    { label: 'Dossiers en circuit', value: items.length },
    { label: 'Validés', value: items.filter((i) => i.statut === 'valide').length },
    { label: 'En attente', value: items.filter((i) => i.statut === 'attente').length },
    { label: 'Rejetés', value: items.filter((i) => i.statut === 'rejete').length },
  ];
}
