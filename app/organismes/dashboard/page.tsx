'use client';

import { Wallet, Landmark, CreditCard, TrendingUp, RefreshCcw, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/legacy-ui/PageHeader';
import KpiCard from '@/components/dashboard/KpiCard';
import SimpleBarChart from '@/components/dashboard/SimpleBarChart';
import ListWidget from '@/components/dashboard/ListWidget';
import LegendWidget from '@/components/dashboard/LegendWidget';
import TableWidget from '@/components/dashboard/TableWidget';
import ActionsWidget from '@/components/dashboard/ActionsWidget';
import CIMapCI from '@/components/dashboard/CIMapCI';
import RegionBankFilters from '@/components/dashboard/RegionBankFilters';
import { COLORS, ACCENTS, type AccentName } from '@/lib/design/tokens';
import { useActeurGuard } from '@/hooks/useActeurGuard';
import {
  getOrganismesDashboardConfig,
  type OrganismeKpiId,
} from '@/features/organismes-dashboard/organismes-dashboard.config';
import type { OrganismeRole } from '@/lib/auth/roles.organismes';

const KPI_DATA: Array<{
  id: OrganismeKpiId;
  icon: typeof Wallet;
  label: string;
  value: number | string;
  variation: number;
  accent: AccentName;
}> = [
  { id: 'portefeuille_global', icon: Wallet, label: 'Portefeuille global (FCFA)', value: 1250000000, variation: 12.4, accent: 'green' },
  { id: 'montant_total_finance', icon: Landmark, label: 'Montant total financé', value: 980000000, variation: 8.1, accent: 'blue' },
  { id: 'nombre_credits', icon: CreditCard, label: 'Crédits actifs', value: 3421, variation: 5.6, accent: 'violet' },
  { id: 'encours_credit', icon: TrendingUp, label: 'Encours de crédit', value: 412000000, variation: -2.3, accent: 'orange' },
  { id: 'taux_remboursement', icon: RefreshCcw, label: 'Taux de remboursement', value: '91%', variation: 1.8, accent: 'teal' },
  { id: 'taux_retard', icon: AlertTriangle, label: 'Taux de retard', value: '6%', variation: -0.9, accent: 'orange' },
];

const BANQUES = ['Toutes les banques', 'SFD Advans', 'SFD Baobab', 'Coris Bank', 'NSIA Banque'];
const REGIONS = ['Toutes les régions', 'Abidjan', 'Bouaké', 'Yamoussoukro', 'San Pédro', 'Korhogo'];
const REGION_PILLS = ['Abidjan', 'Bouaké', 'Yamoussoukro'];

const REPAYMENT_EVOLUTION = [
  { label: 'Jan', value: 32 }, { label: 'Fév', value: 40 }, { label: 'Mar', value: 44 },
  { label: 'Avr', value: 50 }, { label: 'Mai', value: 53 }, { label: 'Jun', value: 60 },
];

const LOAN_EVOLUTION = [
  { label: 'Jan', value: 40 }, { label: 'Fév', value: 55 }, { label: 'Mar', value: 48 },
  { label: 'Avr', value: 62 }, { label: 'Mai', value: 58 }, { label: 'Jun', value: 70 },
];

const REPARTITION_CREDITS = [
  { label: 'Actifs', pourcentage: 68, color: COLORS.green },
  { label: 'Soldés', pourcentage: 26, color: '#94a3b8' },
  { label: 'En retard', pourcentage: 6, color: '#DC2626' },
];

const AGENCES_TABLE = [
  { id: 1, nom: 'Agence Abidjan-Plateau', region: 'Abidjan', credits: 1240, tauxRetard: '4%' },
  { id: 2, nom: 'Agence Bouaké', region: 'Bouaké', credits: 860, tauxRetard: '7%' },
  { id: 3, nom: 'Agence Yamoussoukro', region: 'Yamoussoukro', credits: 640, tauxRetard: '5%' },
  { id: 4, nom: 'Agence San Pédro', region: 'San Pédro', credits: 420, tauxRetard: '9%' },
];

const RACCOURCIS = [
  { label: 'Générer un rapport PDF', href: '/organismes/rapports', accentBg: ACCENTS.green.bg, accentDot: ACCENTS.green.fg },
  { label: 'Rechercher un bénéficiaire', href: '/organismes/beneficiaires', accentBg: ACCENTS.blue.bg, accentDot: ACCENTS.blue.fg },
  { label: 'Nouveau crédit', href: '/organismes/credits', accentBg: ACCENTS.violet.bg, accentDot: ACCENTS.violet.fg },
  { label: 'Paramètres', href: '/organismes/parametrage', accentBg: ACCENTS.orange.bg, accentDot: ACCENTS.orange.fg },
];

export default function OrganismeDashboardPage() {
  const { user, loading, allowed } = useActeurGuard('organismes');

  if (loading || !allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.bg }}>
        <p className="text-sm text-muted-foreground">Chargement du tableau de bord…</p>
      </div>
    );
  }

  const config = getOrganismesDashboardConfig(user!.role as OrganismeRole | undefined);
  const visibleKpis = KPI_DATA.filter((kpi) => config.kpis.includes(kpi.id));

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6" style={{ backgroundColor: COLORS.bg }}>
      <PageHeader
        title={`Bienvenue, ${user!.nom} ${user!.prenom}`}
        subtitle="Vue d'ensemble de votre portefeuille de crédits"
        actions={<RegionBankFilters banques={BANQUES} regions={REGIONS} regionPills={REGION_PILLS} />}
      />

      <div className="mt-6 flex flex-col gap-6">
        {visibleKpis.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
            {visibleKpis.map((item) => (
              <KpiCard
                key={item.id}
                icon={item.icon}
                label={item.label}
                value={item.value}
                variation={item.variation}
                accent={item.accent}
              />
            ))}
          </div>
        )}

        {(config.widgets.includes('carte') ||
          config.widgets.includes('evolution') ||
          config.widgets.includes('prets_chart')) && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {config.widgets.includes('carte') && <CIMapCI />}
            {config.widgets.includes('evolution') && (
              <SimpleBarChart title="Évolution des remboursements" data={REPAYMENT_EVOLUTION} color={COLORS.blue} />
            )}
            {config.widgets.includes('prets_chart') && (
              <SimpleBarChart title="Évolution des prêts accordés" data={LOAN_EVOLUTION} color={COLORS.green} />
            )}
          </div>
        )}

        {(config.widgets.includes('agences') || config.widgets.includes('repartition')) && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {config.widgets.includes('agences') && (
              <ListWidget
                title="Crédits par agence"
                rows={AGENCES_TABLE.map((a) => ({ label: a.nom, value: a.credits }))}
              />
            )}
            {config.widgets.includes('repartition') && (
              <LegendWidget title="Répartition des crédits" rows={REPARTITION_CREDITS} />
            )}
          </div>
        )}

        {(config.widgets.includes('agences_table') || config.widgets.includes('raccourcis')) && (
          <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
            {config.widgets.includes('agences_table') && (
              <TableWidget
                title="Agences"
                rows={AGENCES_TABLE}
                rowKey={(r) => r.id}
                columns={[
                  { key: 'nom', label: 'Agence', render: (r) => <span className="font-medium">{r.nom}</span> },
                  { key: 'region', label: 'Région', render: (r) => r.region },
                  { key: 'credits', label: 'Crédits', align: 'right', render: (r) => r.credits },
                  {
                    key: 'tauxRetard',
                    label: 'Taux de retard',
                    align: 'right',
                    render: (r) => (
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: '#FDF0E3', color: COLORS.orange }}
                      >
                        {r.tauxRetard}
                      </span>
                    ),
                  },
                ]}
              />
            )}
            {config.widgets.includes('raccourcis') && (
              <ActionsWidget title="Raccourcis rapides" items={RACCOURCIS} />
            )}
          </div>
        )}

        {config.widgets.includes('credits') && !config.widgets.includes('agences_table') && (
          <TableWidget
            title="Crédits récents"
            rows={[
              { id: 1, code: 'CRD-2026-041', beneficiaire: 'Aïssatou Bah', montant: 2500000, statut: 'Actif' },
              { id: 2, code: 'CRD-2026-040', beneficiaire: 'Ibrahima Sow', montant: 1800000, statut: 'En retard' },
            ]}
            rowKey={(r) => r.id}
            columns={[
              { key: 'code', label: 'Code', render: (r) => <span className="font-medium">{r.code}</span> },
              { key: 'beneficiaire', label: 'Bénéficiaire', render: (r) => r.beneficiaire },
              { key: 'montant', label: 'Montant', render: (r) => `${r.montant.toLocaleString('fr-FR')} FCFA` },
              { key: 'statut', label: 'Statut', render: (r) => r.statut },
            ]}
          />
        )}
      </div>
    </div>
  );
}