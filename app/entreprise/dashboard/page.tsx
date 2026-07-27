'use client';

import { FolderKanban, Wallet, GraduationCap, BriefcaseBusiness, Percent } from 'lucide-react';
import { PageHeader } from '@/components/legacy-ui/PageHeader';
import KpiCardV2 from '@/components/dashboard/KpiCard';
import SimpleBarChart from '@/components/dashboard/SimpleBarChart';
import LegendWidget from '@/components/dashboard/LegendWidget';
import TableWidget from '@/components/dashboard/TableWidget';
import AlertsWidget from '@/components/dashboard/AlertsWidget';
import { COLORS, type AccentName } from '@/lib/design/tokens';
import { useActeurGuard } from '@/hooks/useActeurGuard';
import { getUserDisplayName } from '@/features/auth/auth.dto';
import { getRoleSlug } from '@/lib/auth/acteur';
import {
    getEntrepriseDashboardConfig,
    type EntrepriseKpiId,
} from '@/features/entreprise-dashboard/entreprise-dashboard.config';
import type { EntrepriseRole } from '@/lib/auth/roles.entreprise';

const KPI_DATA: Array<{
    id: EntrepriseKpiId;
    icon: typeof FolderKanban;
    label: string;
    value: number | string;
    variation: number;
    accent: AccentName;
}> = [
        { id: 'projets_finances', icon: FolderKanban, label: 'Projets financés', value: 18, variation: 6.2, accent: 'green' },
        { id: 'financements_obtenus', icon: Wallet, label: 'Financements obtenus (FCFA)', value: 45000000, variation: 11.4, accent: 'blue' },
        { id: 'stages_proposes', icon: GraduationCap, label: 'Stages proposés', value: 32, variation: 4.1, accent: 'violet' },
        { id: 'emplois_crees', icon: BriefcaseBusiness, label: 'Emplois créés', value: 21, variation: 9.0, accent: 'orange' },
        { id: 'taux_recrutement', icon: Percent, label: 'Taux de recrutement', value: '68%', variation: 2.5, accent: 'teal' },
    ];

const EVOLUTION_RECRUTEMENTS = [
    { label: 'Jan', value: 6 }, { label: 'Fév', value: 8 }, { label: 'Mar', value: 7 },
    { label: 'Avr', value: 9 }, { label: 'Mai', value: 12 }, { label: 'Jun', value: 9 },
];

const REPARTITION_RECRUTEMENT = [
    { label: 'Stages', pourcentage: 60, color: COLORS.green },
    { label: 'Emplois', pourcentage: 40, color: COLORS.orange },
];

const ACTIVITE_RECENTE = [
    { id: 1, intitule: 'Développeur Frontend', type: 'Emploi', date: '15 Juil. 2026', statut: 'Pourvu' },
    { id: 2, intitule: 'Stagiaire Marketing Digital', type: 'Stage', date: '12 Juil. 2026', statut: 'Ouvert' },
    { id: 3, intitule: 'Comptable junior', type: 'Emploi', date: '8 Juil. 2026', statut: 'Ouvert' },
    { id: 4, intitule: 'Stagiaire RH', type: 'Stage', date: '2 Juil. 2026', statut: 'Fermé' },
];

const ALERTES = [
    { label: '9 candidatures en attente de traitement', severity: 'attention' as const },
    { label: '3 entretiens programmés cette semaine', severity: 'info' as const },
    { label: '1 offre expire demain', severity: 'critique' as const },
];

export default function EntrepriseDashboardPage() {
    const { user, loading, allowed } = useActeurGuard('entreprise');

    if (loading || !allowed) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.bg }}>
                <p className="text-sm text-muted-foreground">Chargement du tableau de bord…</p>
            </div>
        );
    }

    // TODO(backend): resolve the real entreprise role from role_id (see
    // lib/auth/acteur.ts). Fall back to the sole entreprise role so the
    // dashboard renders while the role_id → slug mapping is pending.
    const roleSlug = (getRoleSlug(user) as EntrepriseRole | undefined) ?? 'responsable_entreprise';
    const config = getEntrepriseDashboardConfig(roleSlug);
    const visibleKpis = KPI_DATA.filter((kpi) => config.kpis.includes(kpi.id));

    return (
        <div className="min-h-screen px-6 py-6" style={{ backgroundColor: COLORS.bg }}>
            <PageHeader
                title={`Bienvenue, ${getUserDisplayName(user)}`}
                subtitle="Vue d'ensemble de vos activités de recrutement"
            />

            <div className="mt-6 flex flex-col gap-6">
                {visibleKpis.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
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

                {(config.widgets.includes('evolution') || config.widgets.includes('repartition')) && (
                    <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
                        {config.widgets.includes('evolution') && (
                            <SimpleBarChart title="Évolution des recrutements" data={EVOLUTION_RECRUTEMENTS} color={COLORS.green} />
                        )}
                        {config.widgets.includes('repartition') && (
                            <LegendWidget title="Répartition stages / emplois" rows={REPARTITION_RECRUTEMENT} />
                        )}
                    </div>
                )}

                {config.widgets.includes('activite') && (
                    <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
                        <TableWidget
                            title="Activité récente"
                            rows={ACTIVITE_RECENTE}
                            rowKey={(r) => r.id}
                            columns={[
                                { key: 'intitule', label: 'Intitulé', render: (r) => <span className="font-medium">{r.intitule}</span> },
                                { key: 'type', label: 'Type', render: (r) => r.type },
                                { key: 'date', label: 'Date', render: (r) => r.date },
                                {
                                    key: 'statut',
                                    label: 'Statut',
                                    render: (r) => (
                                        <span
                                            className="px-2.5 py-1 rounded-full text-xs font-semibold"
                                            style={{
                                                backgroundColor: r.statut === 'Ouvert' ? '#FDF0E3' : r.statut === 'Pourvu' ? '#E7F5EC' : '#F3F4F6',
                                                color: r.statut === 'Ouvert' ? COLORS.orange : r.statut === 'Pourvu' ? COLORS.green : '#6B7280',
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