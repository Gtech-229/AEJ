'use client';

import { Users, Clock3, CircleCheckBig, BriefcaseBusiness, ChartColumnIncreasing, Wallet } from 'lucide-react';
import KpiCardV2 from '@/components/dashboard/KpiCard';
import SimpleBarChart from '@/components/dashboard/SimpleBarChart';
import ListWidget from '@/components/dashboard/ListWidget';
import LegendWidget from '@/components/dashboard/LegendWidget';
import ActionsWidget from '@/components/dashboard/ActionsWidget';
import TableWidget from '@/components/dashboard/TableWidget';
import AlertsWidget from '@/components/dashboard/AlertsWidget';
import { COLORS, ACCENTS, type AccentName } from '@/lib/design/tokens';
import { useActeurGuard } from '@/hooks/useActeurGuard';
import { getDashboardConfig, type KpiId } from '@/features/dashboard/dashboard.config';
import type { UserRole } from '@/lib/auth/roles';

// ─── Fake data (en attendant l'API) ──────────────────────────────────────────

const KPI_DATA: Array<{
  id: KpiId;
  icon: typeof Users;
  label: string;
  value: string | number;
  variation: number;
  accent: AccentName;
}> = [
    { id: 'stagiaires', icon: Users, label: 'Total Stagiaires', value: 12723, variation: 69.7, accent: 'green' },
    { id: 'stages_cours', icon: Clock3, label: 'Stages en cours', value: 9506, variation: 37.2, accent: 'blue' },
    { id: 'stages_acheves', icon: CircleCheckBig, label: 'Stages achevés', value: 2494, variation: 9.5, accent: 'violet' },
    { id: 'emplois', icon: BriefcaseBusiness, label: 'Emplois obtenus', value: 5933, variation: 20.3, accent: 'orange' },
    { id: 'taux_insertion', icon: ChartColumnIncreasing, label: "Taux d'insertion", value: '84%', variation: 3.8, accent: 'teal' },
    { id: 'budget_consomme', icon: Wallet, label: 'Budget consommé (FCFA)', value: '4,15 Mrd', variation: 65, accent: 'green' },
  ];

const EVOLUTION_STAGES = [
  { label: 'Jan', value: 820 }, { label: 'Fév', value: 950 }, { label: 'Mar', value: 1100 },
  { label: 'Avr', value: 1350 }, { label: 'Mai', value: 1580 }, { label: 'Jun', value: 1720 },
  { label: 'Jul', value: 1800 },
];

const REGIONS = [
  { label: 'Abidjan', value: 2145 },
  { label: 'Bouaké', value: 1287 },
  { label: 'Korhogo', value: 956 },
  { label: 'Daloa', value: 768 },
  { label: 'Autres', value: 1245 },
];

const SECTEURS = [
  { label: 'Agriculture', pourcentage: 28, color: COLORS.green },
  { label: 'BTP', pourcentage: 24, color: COLORS.blue },
  { label: 'Commerce', pourcentage: 20, color: COLORS.orange },
  { label: 'Services', pourcentage: 18, color: COLORS.violet },
  { label: 'Industrie', pourcentage: 10, color: COLORS.teal },
];

const ACTIONS = [
  { label: 'Nouvelle offre', href: '/dashboard/offres/stages', accentBg: ACCENTS.green.bg, accentDot: ACCENTS.green.fg },
  { label: 'Ajouter un stagiaire', href: '/dashboard/stagiaires', accentBg: ACCENTS.blue.bg, accentDot: ACCENTS.blue.fg },
  { label: 'Créer une évaluation', href: '/dashboard/evaluations', accentBg: ACCENTS.violet.bg, accentDot: ACCENTS.violet.fg },
];

const TOP_ENTREPRISES = [
  { id: 1, nom: 'SODECI', stagiaires: 452, emplois: 210, statut: 'Actif' },
  { id: 2, nom: 'ORANGE CI', stagiaires: 386, emplois: 178, statut: 'Actif' },
  { id: 3, nom: 'BOLLORÉ TRANSPORT', stagiaires: 312, emplois: 145, statut: 'Actif' },
];

const ALERTES = [
  { label: '12 évaluations en retard', severity: 'critique' as const },
  { label: '5 contrats à approuver', severity: 'attention' as const },
  { label: '3 rapports à générer', severity: 'info' as const },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user, loading, allowed } = useActeurGuard('agence');

  if (loading || !allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.bg }}>
        <p className="text-sm text-muted-foreground">Chargement du tableau de bord…</p>
      </div>
    );
  }

  const config = getDashboardConfig(user!.role as UserRole);
  const visibleKpis = KPI_DATA.filter((kpi) => config.kpis.includes(kpi.id));

  return (
    <div className="p-6 space-y-5 max-w-[1400px]" style={{ backgroundColor: COLORS.bg }}>
      <div>
        <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>
          Bienvenue, {user!.name}
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Vue d'ensemble de toutes les activités de l'agence</p>
      </div>

      {visibleKpis.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {visibleKpis.map((kpi) => (
            <KpiCardV2
              key={kpi.id}
              icon={kpi.icon}
              label={kpi.label}
              value={kpi.value}
              variation={kpi.variation}
              accent={kpi.accent}
            />
          ))}
        </div>
      )}

      {(config.widgets.includes('evolution') ||
        config.widgets.includes('regions') ||
        config.widgets.includes('secteurs')) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {config.widgets.includes('evolution') && (
              <SimpleBarChart title="Évolution des stages" data={EVOLUTION_STAGES} color={COLORS.green} />
            )}
            {config.widgets.includes('regions') && <ListWidget title="Répartition par région" rows={REGIONS} />}
            {config.widgets.includes('secteurs') && (
              <LegendWidget title="Répartition par secteur" rows={SECTEURS} showBar />
            )}
          </div>
        )}

      {(config.widgets.includes('actions_rapides') ||
        config.widgets.includes('top_entreprises') ||
        config.widgets.includes('alertes')) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {config.widgets.includes('actions_rapides') && (
              <ActionsWidget title="Actions rapides" items={ACTIONS} />
            )}

            {config.widgets.includes('top_entreprises') && (
              <TableWidget
                title="Top entreprises partenaires"
                rows={TOP_ENTREPRISES}
                rowKey={(r) => r.id}
                columns={[
                  { key: 'nom', label: 'Entreprise', render: (r) => <span className="font-medium">{r.nom}</span> },
                  { key: 'stagiaires', label: 'Stagiaires', align: 'right', render: (r) => r.stagiaires },
                  {
                    key: 'emplois',
                    label: 'Emplois',
                    align: 'right',
                    render: (r) => (
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: ACCENTS.green.bg, color: ACCENTS.green.fg }}
                      >
                        {r.emplois}
                      </span>
                    ),
                  },
                ]}
              />
            )}

            {config.widgets.includes('alertes') && <AlertsWidget title="Alertes & tâches" items={ALERTES} />}
          </div>
        )}
    </div>
  );
}