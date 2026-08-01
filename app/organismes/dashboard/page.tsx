'use client';

import { Wallet, Landmark, CreditCard, TrendingUp, RefreshCcw, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/legacy-ui/PageHeader';
import KpiCardV2 from '@/components/dashboard/KpiCard';
import SimpleBarChart from '@/components/dashboard/SimpleBarChart';
import ListWidget from '@/components/dashboard/ListWidget';
import LegendWidget from '@/components/dashboard/LegendWidget';
import TableWidget from '@/components/dashboard/TableWidget';
import AlertsWidget from '@/components/dashboard/AlertsWidget';
import { COLORS, type AccentName } from '@/lib/design/tokens';
import { useActeurGuard } from '@/hooks/useActeurGuard';
import { getUserDisplayName } from '@/features/auth/auth.dto';
import { getRoleSlug } from '@/lib/auth/acteur';
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
        { id: 'portefeuille_global', icon: Wallet, label: 'Portefeuille global (GNF)', value: 1250000000, variation: 12.4, accent: 'green' },
        { id: 'montant_total_finance', icon: Landmark, label: 'Montant total financé', value: 980000000, variation: 8.1, accent: 'blue' },
        { id: 'nombre_credits', icon: CreditCard, label: 'Crédits actifs', value: 3421, variation: 5.6, accent: 'violet' },
        { id: 'encours_credit', icon: TrendingUp, label: 'Encours de crédit', value: 412000000, variation: -2.3, accent: 'orange' },
        { id: 'taux_remboursement', icon: RefreshCcw, label: 'Taux de remboursement', value: '91%', variation: 1.8, accent: 'teal' },
        { id: 'taux_retard', icon: AlertTriangle, label: 'Taux de retard', value: '6%', variation: -0.9, accent: 'orange' },
    ];

const EVOLUTION_DECAISSEMENTS = [
    { label: 'Jan', value: 40 }, { label: 'Fév', value: 55 }, { label: 'Mar', value: 48 },
    { label: 'Avr', value: 62 }, { label: 'Mai', value: 58 }, { label: 'Jun', value: 70 },
];

const REPARTITION_CREDITS = [
    { label: 'Actifs', pourcentage: 68, color: COLORS.green },
    { label: 'Soldés', pourcentage: 26, color: '#94a3b8' },
    { label: 'En retard', pourcentage: 6, color: '#DC2626' },
];

const AGENCES_ROWS = [
    { label: 'Agence Kaloum', value: 1240 },
    { label: 'Agence Kindia', value: 860 },
    { label: 'Agence Labé', value: 640 },
    { label: 'Agence Kankan', value: 681 },
];

const CREDITS_RECENTS = [
    { id: 1, code: 'CRD-2026-041', beneficiaire: 'Aïssatou Bah', montant: 2500000, statut: 'Actif' },
    { id: 2, code: 'CRD-2026-040', beneficiaire: 'Ibrahima Sow', montant: 1800000, statut: 'En retard' },
    { id: 3, code: 'CRD-2026-039', beneficiaire: 'Mariam Condé', montant: 3200000, statut: 'Soldé' },
];

const ALERTES = [
    { label: '18 crédits en retard de plus de 30 jours', severity: 'critique' as const },
    { label: '7 dossiers de remboursement à valider', severity: 'attention' as const },
    { label: '2 rapports mensuels à générer', severity: 'info' as const },
];

export default function OrganismesDashboardPage() {
    const { user, loading, allowed } = useActeurGuard('organismes');

    if (loading || !allowed) {
        return (
            <div className="flex min-h-full items-center justify-center">
                <p className="text-sm text-muted-foreground">Chargement du tableau de bord…</p>
            </div>
        );
    }

    // TODO(backend): resolve the real organisme role from role_id (see
    // lib/auth/acteur.ts). Fall back to the broadest role so the dashboard
    // renders while the role_id → slug mapping is pending.
    const roleSlug = (getRoleSlug(user) as OrganismeRole | undefined) ?? 'gestionnaire_microfinance';
    const config = getOrganismesDashboardConfig(roleSlug);
    const visibleKpis = KPI_DATA.filter((kpi) => config.kpis.includes(kpi.id));

    return (
        <div className="min-h-full px-6 py-6">
            <PageHeader
                title={`Bienvenue, ${getUserDisplayName(user)}`}
                subtitle="Vue d'ensemble de votre portefeuille de crédits"
            />

            <div className="mt-6 flex flex-col gap-6">
                {visibleKpis.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                        {visibleKpis.map((item) => (
                            <KpiCardV2
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

                {(config.widgets.includes('evolution') ||
                    config.widgets.includes('agences') ||
                    config.widgets.includes('repartition')) && (
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                            {config.widgets.includes('evolution') && (
                                <SimpleBarChart title="Évolution des décaissements" data={EVOLUTION_DECAISSEMENTS} color={COLORS.green} />
                            )}
                            {config.widgets.includes('agences') && (
                                <ListWidget title="Crédits par agence" rows={AGENCES_ROWS} />
                            )}
                            {config.widgets.includes('repartition') && (
                                <LegendWidget title="Répartition des crédits" rows={REPARTITION_CREDITS} />
                            )}
                        </div>
                    )}

                {config.widgets.includes('credits') && (
                    <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
                        <TableWidget
                            title="Crédits récents"
                            rows={CREDITS_RECENTS}
                            rowKey={(r) => r.id}
                            columns={[
                                { key: 'code', label: 'Code', render: (r) => <span className="font-medium">{r.code}</span> },
                                { key: 'beneficiaire', label: 'Bénéficiaire', render: (r) => r.beneficiaire },
                                { key: 'montant', label: 'Montant', render: (r) => `${r.montant.toLocaleString('fr-FR')} GNF` },
                                {
                                    key: 'statut',
                                    label: 'Statut',
                                    render: (r) => (
                                        <span
                                            className="px-2.5 py-1 rounded-full text-xs font-semibold"
                                            style={{
                                                backgroundColor: r.statut === 'En retard' ? '#FEF2F2' : '#E7F5EC',
                                                color: r.statut === 'En retard' ? '#DC2626' : COLORS.green,
                                            }}
                                        >
                                            {r.statut}
                                        </span>
                                    ),
                                },
                            ]}
                        />
                        <AlertsWidget title="Alertes & tâches" items={ALERTES} />
                    </div>
                )}
            </div>
        </div>
    );
}