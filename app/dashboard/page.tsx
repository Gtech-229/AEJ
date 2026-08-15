'use client';

import { Users, FolderKanban, Wallet, RefreshCcw, BriefcaseBusiness } from 'lucide-react';
import KpiCardV2 from '@/components/dashboard/KpiCard';
import ActionsWidget from '@/components/dashboard/ActionsWidget';
import AlertsWidget from '@/components/dashboard/AlertsWidget';
// Mock-only widgets, commented out below until GET /dashboard/stats exists:
// import SimpleBarChart from '@/components/dashboard/SimpleBarChart';
// import ListWidget from '@/components/dashboard/ListWidget';
// import LegendWidget from '@/components/dashboard/LegendWidget';
// import TableWidget from '@/components/dashboard/TableWidget';
import { ACCENTS, type AccentName } from '@/lib/design/tokens';
import { useActeurGuard } from '@/hooks/useActeurGuard';
import { getUserDisplayName } from '@/features/auth/auth.dto';
import { getRoleSlug } from '@/lib/auth/acteur';
import { getDashboardConfig, type KpiId } from '@/features/dashboard/dashboard.config';
import { useDashboardStats } from '@/features/dashboard/dashboard.hooks';
import type { UserRole } from '@/lib/auth/roles';

/** Compact FCFA for KPI cards: 4 150 000 000 → "4,15 Mrd". */
function compactFcfa(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} Mrd`;
  if (n >= 1e6) return `${(n / 1e6).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} M`;
  return n.toLocaleString('fr-FR');
}

// ─── KPI config (id / icon / label / accent). Values are computed from the API
//     in the component (see dashboard.service). Anything without a real source is
//     commented out until `GET /dashboard/stats` exists. ────────────────────────

const KPI_DATA: Array<{
  id: KpiId;
  icon: typeof Users;
  label: string;
  accent: AccentName;
}> = [
    { id: 'jeunes', icon: Users, label: 'Jeunes bénéficiaires', accent: 'green' },
    { id: 'micro_projets', icon: FolderKanban, label: 'Micro-projets financés', accent: 'blue' },
    { id: 'montant_finance', icon: Wallet, label: 'Montant financé (FCFA)', accent: 'violet' },
    { id: 'taux_remboursement', icon: RefreshCcw, label: 'Taux de remboursement', accent: 'teal' },
    { id: 'emplois_crees', icon: BriefcaseBusiness, label: 'Emplois créés', accent: 'orange' },
    // Pas de source réelle → masqué :
    // { id: 'taux_insertion', icon: ChartColumnIncreasing, label: "Taux d'insertion", accent: 'green' },
  ];

// ─── Données maquette SANS source réelle — à réactiver avec l'endpoint stats
// (séries temporelles / regroupements non calculables efficacement côté client) :
// const EVOLUTION_FINANCEMENTS = [ { label: 'Jan', value: 320 }, … ];
// const REGIONS = [ { label: 'Abidjan', value: 1245 }, … ];
// const SECTEURS = [ { label: 'Agriculture', pourcentage: 28, color: COLORS.green }, … ];

const ACTIONS = [
  { label: 'Gérer les promoteurs', href: '/dashboard/promoteurs', accentBg: ACCENTS.green.bg, accentDot: ACCENTS.green.fg },
  { label: 'Nouveau financement', href: '/dashboard/financements', accentBg: ACCENTS.blue.bg, accentDot: ACCENTS.blue.fg },
  { label: 'Gérer le personnel', href: '/dashboard/parametrage/personnels', accentBg: ACCENTS.violet.bg, accentDot: ACCENTS.violet.fg },
];

// const TOP_ORGANISMES = [ { id: 1, nom: 'Banque Mondiale', projets: 3, montant: '1,20 Mrd' }, … ];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user, loading, allowed } = useActeurGuard('agence');
  // Called unconditionally, before the early return below — moving this after
  // it (as it was) meant the hook only ran once `loading`/`allowed` settled,
  // changing the hook count between renders and tripping React's Rules of
  // Hooks ("Rendered more hooks than during the previous render").
  const { data: stats } = useDashboardStats();

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

  // Real KPI values computed from list endpoints (see dashboard.service). The
  // trend/variation still has no interim source, so it stays as-is. `taux_insertion`
  // has no source either → keeps its placeholder until the stats endpoint lands.
  const realKpiValue = (id: KpiId): string | number | undefined => {
    if (!stats) return undefined;
    switch (id) {
      case 'jeunes': return stats.jeunes;
      case 'micro_projets': return stats.microProjets;
      case 'montant_finance': return compactFcfa(stats.montantFinance);
      case 'taux_remboursement': return `${stats.tauxRemboursement}%`;
      case 'emplois_crees': return stats.emploisCrees;
      default: return undefined;
    }
  };
  const alertes = [
    {
      label: `${stats?.remboursementsEnRetard ?? '…'} échéance(s) de remboursement en retard`,
      severity: 'critique' as const,
    },
    {
      label: `${stats?.budgetsAValider ?? '…'} dossier(s) de financement à valider`,
      severity: 'attention' as const,
    },
    // Pas de source réelle → masqué :
    // { label: '3 rapports mensuels à générer', severity: 'info' as const },
  ];

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
              value={realKpiValue(kpi.id) ?? '…'}
              // variation: pas de source (comparaison période/période) → masqué
              accent={kpi.accent}
            />
          ))}
        </div>
      )}

      {/* Évolution / Régions / Secteurs — pas de source réelle (séries temporelles /
          regroupements sur ~10k projets). À réactiver avec GET /dashboard/stats :
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
        )} */}

      {(config.widgets.includes('actions_rapides') ||
        config.widgets.includes('top_organismes') ||
        config.widgets.includes('alertes')) && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {config.widgets.includes('actions_rapides') && (
              <ActionsWidget title="Actions rapides" items={ACTIONS} />
            )}

            {/* Top organismes financeurs — pas de source réelle (agrégat par organisme).
                À réactiver avec GET /dashboard/stats :
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
            )} */}

            {config.widgets.includes('alertes') && <AlertsWidget title="Alertes & tâches" items={alertes} />}
          </div>
        )}
    </div>
  );
}