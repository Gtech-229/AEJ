import type { Organisme } from './organismes.dto';
import type { ListKpiItem } from '@/components/generic/list-kpis';

export function getOrganismesKpis(
  organismes: Organisme[],
): ListKpiItem[] {
  const total = organismes.length;

  const avecEmail = organismes.filter(
    (o) => !!o.email?.trim(),
  ).length;

  const avecTelephone = organismes.filter(
    (o) => !!o.telephone?.trim(),
  ).length;

  const typesDistincts = new Set(
    organismes.map((o) => o.type),
  ).size;

  return [
    { label: 'Total organismes', value: total },
    { label: 'Types distincts', value: typesDistincts },
    { label: 'Avec téléphone', value: avecTelephone },
    { label: 'Avec e-mail', value: avecEmail },
  ];
}