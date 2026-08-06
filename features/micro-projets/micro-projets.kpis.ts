import type { MicroProjet } from './micro-projets.dto';
import type { ListKpiItem } from '@/components/generic/list-kpis';

export function getMicroProjetsKpis(microProjets: MicroProjet[]): ListKpiItem[] {
  const total = microProjets.length;
  const finances = microProjets.filter((p) => p.statut === 'finance').length;
  const enInstruction = microProjets.filter((p) => p.statut === 'instruction').length;
  const budgetTotal = microProjets.reduce((sum, p) => sum + p.montant, 0);

  return [
    { label: 'Total projets', value: total },
    { label: 'Financés', value: finances },
    { label: 'En instruction', value: enInstruction },
    { label: 'Budget total (FCFA)', value: budgetTotal },
  ];
}