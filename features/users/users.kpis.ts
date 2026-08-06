import type { User } from './users.dto';
import type { ListKpiItem } from '@/components/generic/list-kpis';

export function getUsersKpis(users: User[]): ListKpiItem[] {
  const total = users.length;
  const actifs = users.filter((u) => !!u.is_active).length;
  const inactifs = total - actifs;
  const rolesDistincts = new Set(users.map((u) => u.role_id)).size;

  return [
    { label: 'Total personnels', value: total },
    { label: 'Actifs', value: actifs, tone: 'success' },
    { label: 'Inactifs', value: inactifs, tone: inactifs > 0 ? 'warning' : 'default' },
    { label: 'Rôles distincts', value: rolesDistincts },
  ];
}