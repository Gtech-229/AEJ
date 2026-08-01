'use client';

import { Users, FolderKanban, Wallet, RefreshCcw, BriefcaseBusiness, ChartColumnIncreasing } from 'lucide-react';
import KpiCardV2 from '@/components/dashboard/KpiCard';
import SimpleBarChart from '@/components/dashboard/SimpleBarChart';
import ListWidget from '@/components/dashboard/ListWidget';
import LegendWidget from '@/components/dashboard/LegendWidget';
import ActionsWidget from '@/components/dashboard/ActionsWidget';
import TableWidget from '@/components/dashboard/TableWidget';
import AlertsWidget from '@/components/dashboard/AlertsWidget';
import { COLORS, ACCENTS, type AccentName } from '@/lib/design/tokens';
import { useActeurGuard } from '@/hooks/useActeurGuard';
import { getUserDisplayName } from '@/features/auth/auth.dto';
import { getRoleSlug } from '@/lib/auth/acteur';
import { getDashboardConfig, type KpiId } from '@/features/dashboard/dashboard.config';
import type { UserRole } from '@/lib/auth/roles';

// ─── Placeholder data (en attendant l'API) ───────────────────────────────────

const KPI_DATA: Array<{
  id: KpiId;
  icon: typeof Users;
  label: string;
  value: string | number;
  variation: number;
  accent: AccentName;
}> = [
    { id: 'jeunes', icon: Users, label: 'Jeunes bénéficiaires', value: 12723, variation: 8.4, accent: 'green' },
    { id: 'micro_projets', icon: FolderKanban, label: 'Micro-projets financés', value: 3820, variation: 12.1, accent: 'blue' },
    { id: 'montant_finance', icon: Wallet, label: 'Montant financé (FCFA)', value: '4,15 Mrd', variation: 15.0, accent: 'violet' },
    { id: 'taux_remboursement', icon: RefreshCcw, label: 'Taux de remboursement', value: '87%', variation: 2.3, accent: 'teal' },
    { id: 'emplois_crees', icon: BriefcaseBusiness, label: 'Emplois créés', value: 5933, variation: 9.6, accent: 'orange' },
    { id: 'taux_insertion', icon: ChartColumnIncreasing, label: "Taux d'insertion", value: '84%', variation: 3.8, accent: 'green' },
  ];

const EVOLUTION_FINANCEMENTS = [
  { label: 'Jan', value: 320 }, { label: 'Fév', value: 410 }, { label: 'Mar', value: 480 },
  { label: 'Avr', value: 560 }, { label: 'Mai', value: 640 }, { label: 'Jun', value: 720 },
  { label: 'Jul', value: 810 },
];

const REGIONS = [
  { label: 'Abidjan', value: 1245 },
  { label: 'Bouaké', value: 820 },
  { label: 'Korhogo', value: 610 },
  { label: 'Daloa', value: 540 },
  { label: 'Autres', value: 605 },
];

const SECTEURS = [
  { label: 'Agriculture', pourcentage: 28, color: COLORS.green },
  { label: 'BTP', pourcentage: 24, color: COLORS.blue },
  { label: 'Commerce', pourcentage: 20, color: COLORS.orange },
  { label: 'Services', pourcentage: 18, color: COLORS.violet },
  { label: 'Industrie', pourcentage: 10, color: COLORS.teal },
];

const ACTIONS = [
  { label: 'Ajouter un jeune', href: '/dashboard/jeunes', accentBg: ACCENTS.green.bg, accentDot: ACCENTS.green.fg },
  { label: 'Nouveau financement', href: '/dashboard/financements/projets', accentBg: ACCENTS.blue.bg, accentDot: ACCENTS.blue.fg },
  { label: 'Gérer le personnel', href: '/dashboard/parametrage/personnels', accentBg: ACCENTS.violet.bg, accentDot: ACCENTS.violet.fg },
];

const TOP_ORGANISMES = [
  { id: 1, nom: 'Banque Mondiale', projets: 3, montant: '1,20 Mrd' },
  { id: 2, nom: 'BAD', projets: 2, montant: '0,85 Mrd' },
  { id: 3, nom: 'Union Européenne', projets: 1, montant: '0,60 Mrd' },
];

const ALERTES = [
  { label: '18 échéances de remboursement en retard', severity: 'critique' as const },
  { label: '7 dossiers de financement à valider', severity: 'attention' as const },
  { label: '3 rapports mensuels à générer', severity: 'info' as const },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user, loading, allowed } = useActeurGuard('agence');

  if (loading || !allowed) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">Chargement du tableau de bord…</p>
      </div>
    );
  }

  // TODO(backend): resolve the real agence role from role_id (see
  // lib/auth/acteur.ts). Fall back to the super-admin role so the full
  // dashboard renders while the role_id → slug mapping is pending.
  const roleSlug = (getRoleSlug(user) as UserRole | undefined) ?? 'admin_general';
  const config = getDashboardConfig(roleSlug);
  const visibleKpis = KPI_DATA.filter((kpi) => config.kpis.includes(kpi.id));

  return (
    <div className="max-w-[1400px] space-y-5 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bienvenue, {getUserDisplayName(user)}</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Vue d&apos;ensemble de l&apos;activité de l&apos;agence
        </p>
      </div>

      {visibleKpis.length > 0 && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
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
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {config.widgets.includes('evolution') && (
              <SimpleBarChart title="Évolution des financements" data={EVOLUTION_FINANCEMENTS} color={COLORS.green} />
            )}
            {config.widgets.includes('regions') && (
              <ListWidget title="Financements par région" rows={REGIONS} />
            )}
            {config.widgets.includes('secteurs') && (
              <LegendWidget title="Répartition par secteur" rows={SECTEURS} showBar />
            )}
          </div>
        )}

      {(config.widgets.includes('actions_rapides') ||
        config.widgets.includes('top_organismes') ||
        config.widgets.includes('alertes')) && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {config.widgets.includes('actions_rapides') && (
              <ActionsWidget title="Actions rapides" items={ACTIONS} />
            )}

            {config.widgets.includes('top_organismes') && (
              <TableWidget
                title="Top organismes financeurs"
                rows={TOP_ORGANISMES}
                rowKey={(r) => r.id}
                columns={[
                  { key: 'nom', label: 'Organisme', render: (r) => <span className="font-medium">{r.nom}</span> },
                  { key: 'projets', label: 'Projets', align: 'right', render: (r) => r.projets },
                  {
                    key: 'montant',
                    label: 'Montant',
                    align: 'right',
                    render: (r) => (
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-semibold"
                        style={{ backgroundColor: ACCENTS.green.bg, color: ACCENTS.green.fg }}
                      >
                        {r.montant}
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
