import type { Fonction } from './fonctions.dto';
import type { ListKpiItem } from '@/components/generic/list-kpis';

export function getFonctionsKpis(fonctions: Fonction[]): ListKpiItem[] {
  const total = fonctions.length;
  const servicesDistincts = new Set(fonctions.map((f) => f.service_id)).size;
  const sansCode = fonctions.filter((f) => !f.code).length;

  return [
    { label: 'Total fonctions', value: total },
    { label: 'Services couverts', value: servicesDistincts },
    {
      label: 'Sans code renseigné',
      value: sansCode,
      tone: sansCode > 0 ? 'warning' : 'success',
    },
  ];
}