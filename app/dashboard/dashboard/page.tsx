'use client';

import { useEffect, useState } from 'react';
import {
  GraduationCap,
  Briefcase,
  Award,
  UserCheck,
  TrendingUp,
} from 'lucide-react';

import KpiCard               from '@/components/dashboard/KpiCard';
import FinancementChart      from '@/components/dashboard/FinancementChart';
import EvolutionChart        from '@/components/dashboard/EvolutionChart';
import RepartitionChart      from '@/components/dashboard/RepartitionChart';
import EntreprisesWidget     from '@/components/dashboard/EntreprisesWidget';
import ProjetsFinancesWidget from '@/components/dashboard/ProjetsFinancesWidget';
import api                   from '@/lib/api';

interface DashboardData {
  kpis: {
    total_stagiaires: number; stages_en_cours: number;
    stages_acheves: number; emplois_obtenus: number; taux_insertion: number;
    variation_stagiaires: number; variation_stages_cours: number;
    variation_stages_acheves: number; variation_emplois: number; variation_taux: number;
  };
  financement: {
    total_budget: number; total_decaisse: number;
    mensuel: { mois: string; financement: number; stage: number }[];
  };
  evolution: {
    mensuel: { label: string; financement: number; stage: number }[];
    hebdomadaire: { label: string; financement: number; stage: number }[];
    journalier: { label: string; financement: number; stage: number }[];
  };
  repartition: { label: string; pourcentage: number; valeur: number; color: string }[];
  entreprises: {
    total: number;
    data: { id: number; nom: string; secteur: string; initiales: string }[];
  };
  financements: {
    total: number;
    data: { id: number; code: string; partenaire: string; date: string; statut: 'en_cours' | 'acheve' | 'suspendu' }[];
  };
}

const MOCK: DashboardData = {
  kpis: {
    total_stagiaires: 12723, stages_en_cours: 9506, stages_acheves: 2494,
    emplois_obtenus: 5933, taux_insertion: 62.4,
    variation_stagiaires: 69.2, variation_stages_cours: 37.2,
    variation_stages_acheves: 9.5, variation_emplois: -20.3, variation_taux: -20.3,
  },
  financement: {
    total_budget: 41512000, total_decaisse: 25612000,
    mensuel: [
      { mois: 'Juin', financement: 420, stage: 650 },
      { mois: 'Juil', financement: 320, stage: 530 },
      { mois: 'Août', financement: 380, stage: 300 },
      { mois: 'Sept', financement: 290, stage: 280 },
      { mois: 'Oct',  financement: 510, stage: 320 },
    ],
  },
  evolution: {
    mensuel: [
      { label: 'Fév',  financement: 500, stage: 300 },
      { label: 'Mars', financement: 200, stage: 420 },
      { label: 'Avr',  financement: 650, stage: 800 },
      { label: 'Mai',  financement: 720, stage: 850 },
      { label: 'Juin', financement: 600, stage: 750 },
      { label: 'Juil', financement: 480, stage: 750 },
      { label: 'Août', financement: 390, stage: 440 },
      { label: 'Sept', financement: 510, stage: 390 },
      { label: 'Oct',  financement: 510, stage: 320 },
      { label: 'Nov',  financement: 430, stage: 280 },
      { label: 'Déc',  financement: 900, stage: 200 },
    ],
    hebdomadaire: [
      { label: 'S1', financement: 120, stage: 80  },
      { label: 'S2', financement: 200, stage: 150 },
      { label: 'S3', financement: 180, stage: 210 },
      { label: 'S4', financement: 240, stage: 170 },
    ],
    journalier: [
      { label: 'Lun', financement: 40, stage: 30 },
      { label: 'Mar', financement: 55, stage: 45 },
      { label: 'Mer', financement: 35, stage: 60 },
      { label: 'Jeu', financement: 70, stage: 50 },
      { label: 'Ven', financement: 60, stage: 40 },
    ],
  },
  repartition: [
    { label: 'Stage perfectionnement', pourcentage: 24, valeur: 24, color: '#1a7a3c' },
    { label: 'Emplois salariés',        pourcentage: 41, valeur: 41, color: '#f97316' },
    { label: 'Auto-emplois',            pourcentage: 15, valeur: 15, color: '#2d9a52' },
    { label: 'En recherche',            pourcentage: 20, valeur: 20, color: '#d1d5db' },
  ],
  entreprises: {
    total: 249,
    data: [
      { id: 1, nom: 'CADO Technologies', secteur: 'Technologies',       initiales: 'CT' },
      { id: 2, nom: 'DL Consulting',     secteur: 'Technologies',       initiales: 'DC' },
      { id: 3, nom: 'COSIT',             secteur: 'Technologies',       initiales: 'C'  },
      { id: 4, nom: 'Orange CI',         secteur: 'Télécommunications', initiales: 'OC' },
      { id: 5, nom: 'SGCI',              secteur: 'Financier',          initiales: 'S'  },
      { id: 6, nom: 'NSIA Banque',       secteur: 'Financier',          initiales: 'NB' },
    ],
  },
  financements: {
    total: 1578,
    data: [
      { id: 1, code: 'FIN-2026-001', partenaire: 'Banque Mondiale',  date: '15/01/2026', statut: 'en_cours' },
      { id: 2, code: 'FIN-2026-002', partenaire: 'BAD',              date: '01/02/2026', statut: 'en_cours' },
      { id: 3, code: 'FIN-2025-014', partenaire: 'Union Européenne', date: '01/09/2025', statut: 'acheve'   },
      { id: 4, code: 'FIN-2026-003', partenaire: 'ONU Femmes',       date: '10/03/2026', statut: 'en_cours' },
      { id: 5, code: 'FIN-2026-004', partenaire: 'ONG ALLÔ MORY',   date: '20/03/2026', statut: 'en_cours' },
      { id: 6, code: 'FIN-2026-005', partenaire: 'FIDA',             date: '01/04/2026', statut: 'en_cours' },
    ],
  },
};

export default function DashboardPage() {
  const [data, setData]       = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<DashboardData>('/dashboard');
        setData(res.data);
      } catch {
        setData(MOCK);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const d = data ?? MOCK;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-sm text-gray-400 mt-0.5">Vue d'ensemble — Programme Social du Gouvernement</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard icon={GraduationCap} label="Total Stagiaires"
          value={d.kpis.total_stagiaires} variation={d.kpis.variation_stagiaires}
          href="/offres/stagiaires" loading={loading} />
        <KpiCard icon={Briefcase} label="Stages en cours"
          value={d.kpis.stages_en_cours} variation={d.kpis.variation_stages_cours}
          href="/offres/stages" loading={loading} />
        <KpiCard icon={Award} label="Stages achevés"
          value={d.kpis.stages_acheves} variation={d.kpis.variation_stages_acheves}
          loading={loading} />
        <KpiCard icon={UserCheck} label="Emplois obtenus"
          value={d.kpis.emplois_obtenus} variation={d.kpis.variation_emplois}
          href="/offres/emplois" loading={loading} />
      </div>

      {/* Taux insertion + Financement chart */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <KpiCard icon={TrendingUp} label="Taux d'insertion"
          value={`${d.kpis.taux_insertion}%`} variation={d.kpis.variation_taux}
          loading={loading} />
        <div className="xl:col-span-3">
          <FinancementChart
            totalBudget={d.financement.total_budget}
            totalDecaisse={d.financement.total_decaisse}
            data={d.financement.mensuel}
          />
        </div>
      </div>

      {/* Entreprises + Projets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <EntreprisesWidget total={d.entreprises.total} entreprises={d.entreprises.data} />
        <ProjetsFinancesWidget total={d.financements.total} financements={d.financements.data} />
      </div>

      {/* Évolution + Répartition */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <EvolutionChart
            mensuel={d.evolution.mensuel}
            hebdomadaire={d.evolution.hebdomadaire}
            journalier={d.evolution.journalier}
          />
        </div>
        <RepartitionChart data={d.repartition} />
      </div>

      <p className="text-center text-gray-300 text-xs pb-4">
        © 2026 Agence Emploi Jeunes | Financement BAD - Projet PS Gouv | Version 1.0
      </p>
    </div>
  );
}