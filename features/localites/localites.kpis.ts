import type { Localite } from './localites.dto';
import type { ListKpiItem } from '@/components/generic/list-kpis';

export function getLocalitesKpis(localites: Localite[]): ListKpiItem[] {
  const total = localites.length;
  const urbaines = localites.filter((l) => l.couche_cartographique === 'zone_urbaine').length;
  const rurales = localites.filter((l) => l.couche_cartographique === 'zone_rurale').length;
  const niveauxDistincts = new Set(localites.map((l) => l.niveau_localite_id)).size;

  return [
    { label: 'Total localités', value: total },
    { label: 'Zones urbaines', value: urbaines },
    { label: 'Zones rurales', value: rurales },
    { label: 'Niveaux distincts', value: niveauxDistincts },
  ];
}