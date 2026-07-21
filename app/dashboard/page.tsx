'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users,
  Settings,
  Search,
  BriefcaseBusiness,
  Clock3,
  CircleCheckBig,
  ChartColumnIncreasing,
} from 'lucide-react';
import { PageHeader } from '@/components/legacy-ui/PageHeader';
import KpiCard from '@/components/dashboard/KpiCard';
import EvolutionChart from '@/components/dashboard/EvolutionChart';
import FinancementChart from '@/components/dashboard/FinancementChart';
import RepartitionChart from '@/components/dashboard/RepartitionChart';
import EntreprisesWidget from '@/components/dashboard/EntreprisesWidget';
import ProjetsFinancesWidget from '@/components/dashboard/ProjetsFinancesWidget';


const KPI_DATA = [
  {
    icon: Users,
    label: "Total Stagiaires",
    value: 12723,
    variation: 69.7,
    href: "/dashboard/stagiaires",
  },
  {
    icon: Clock3,
    label: "Stages en cours",
    value: 9506,
    variation: 37.2,
    href: "/dashboard/offres/stages?filter=en_cours",
  },
  {
    icon: CircleCheckBig,
    label: "Stages achevés",
    value: 2494,
    variation: 9.5,
    href: "/dashboard/offres/stages?filter=acheve",
  },
  {
    icon: BriefcaseBusiness,
    label: "Emplois obtenus",
    value: 5933,
    variation: 20.3,
    href: "/dashboard/offres/emplois?filter=emplois",
  },
  {
    icon: ChartColumnIncreasing,
    label: "Taux d'insertion",
    value: "84%",
    variation: 3.8,
    href: "/dashboard/stagiaires?filter=insertion",
  },
];

// EvolutionChart : { label, financement, stage }
const EVOLUTION_MENSUEL = [
  { label: 'Jan', financement: 300, stage: 400 },
  { label: 'Fév', financement: 450, stage: 500 },
  { label: 'Mar', financement: 350, stage: 600 },
  { label: 'Avr', financement: 600, stage: 700 },
  { label: 'Mai', financement: 754, stage: 550 },
  { label: 'Jun', financement: 500, stage: 480 },
  { label: 'Jul', financement: 680, stage: 520 },
  { label: 'Aoû', financement: 720, stage: 600 },
  { label: 'Sep', financement: 580, stage: 700 },
  { label: 'Oct', financement: 800, stage: 650 },
  { label: 'Nov', financement: 750, stage: 800 },
  { label: 'Déc', financement: 950, stage: 200 },
];

const EVOLUTION_HEBDO = [
  { label: 'S1', financement: 180, stage: 210 },
  { label: 'S2', financement: 220, stage: 190 },
  { label: 'S3', financement: 310, stage: 280 },
  { label: 'S4', financement: 270, stage: 330 },
  { label: 'S5', financement: 390, stage: 300 },
  { label: 'S6', financement: 420, stage: 370 },
  { label: 'S7', financement: 350, stage: 410 },
  { label: 'S8', financement: 480, stage: 440 },
];

const EVOLUTION_JOURNALIER = [
  { label: 'Lun', financement: 80, stage: 110 },
  { label: 'Mar', financement: 120, stage: 95 },
  { label: 'Mer', financement: 95, stage: 130 },
  { label: 'Jeu', financement: 140, stage: 100 },
  { label: 'Ven', financement: 110, stage: 150 },
];

// FinancementChart : { mois, financement, stage }
const FINANCEMENT_SERIES = [
  { mois: '06', financement: 400, stage: 300 },
  { mois: '07', financement: 600, stage: 200 },
  { mois: '08', financement: 800, stage: 500 },
  { mois: '09', financement: 350, stage: 400 },
  { mois: '10', financement: 700, stage: 250 },
];

// EntreprisesWidget : { id, nom, secteur, initiales }
const ENTREPRISES = [
  { id: 1, nom: 'Banque Mondiale', secteur: 'Financier', initiales: 'BM' },
  { id: 2, nom: 'Banque Africaine de Développement', secteur: 'Financier', initiales: 'BAD' },
  { id: 3, nom: 'Orange Côte d\'Ivoire', secteur: 'Télécommunications', initiales: 'OCI' },
  { id: 4, nom: 'Nestlé Abidjan', secteur: 'Agriculture', initiales: 'NA' },
  { id: 5, nom: 'Clinique Biasa', secteur: 'Santé', initiales: 'CB' },
  { id: 6, nom: 'MTN Côte d\'Ivoire', secteur: 'Technologies', initiales: 'MTN' },
];

// ProjetsFinancesWidget : { id, code, partenaire, date, statut }
const PROJETS = [
  { id: 1, code: 'INV-001-123', partenaire: 'Rob B.', date: '10 Mars 2021', statut: 'en_cours' as const },
  { id: 2, code: 'INV-002-123', partenaire: 'Samantha W.', date: '9 Mars 2021', statut: 'acheve' as const },
  { id: 3, code: 'INV-003-123', partenaire: 'Karen H.', date: '8 Mars 2021', statut: 'acheve' as const },
  { id: 4, code: 'INV-004-123', partenaire: 'Johnny A.', date: '7 Mars 2021', statut: 'en_cours' as const },
  { id: 5, code: 'INV-005-123', partenaire: 'Rob B.', date: '6 Mars 2021', statut: 'en_cours' as const },
  { id: 6, code: 'INV-006-123', partenaire: 'Marie T.', date: '5 Mars 2021', statut: 'suspendu' as const },
];

// RepartitionChart : { label, pourcentage, valeur, color }
const REPARTITION = [
  { label: 'Stage perfectionnement', pourcentage: 24, valeur: 25, color: '#1A7A3C' },
  { label: 'Emplois salariés', pourcentage: 41, valeur: 60, color: '#F7941D' },
  { label: 'Auto-emplois', pourcentage: 15, valeur: 7, color: '#27AE60' },
  { label: 'Autres', pourcentage: 20, valeur: 8, color: '#E0E6EA' },
];

const PARAMETRES_HREF = '/dashboard/parametrage';

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  // Les hooks doivent être appelés ici, à l'intérieur du composant.
  const pathname = usePathname();
  const [search, setSearch] = useState('');

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/');
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: brancher la recherche sur une vraie logique (filtrage, navigation, appel API...)
    console.log('Recherche :', search, isActive(PARAMETRES_HREF));
  }

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col px-6 py-6 max-w-6xl mx-auto">

      {/* Partie verte */}

      <section className="bg-[#1a7a3c] h-40 px-6 pt-6">
        <PageHeader
          title="Tableau de bord"
          subtitle="Bienvenue — Agence Emploi Jeunes"
          variant="dark"
          actions={
            <div className="flex items-center gap-3">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-48 md:w-64 pl-9 pr-3 py-2 rounded-full bg-white"
                />
              </form>

              <Link
                href={PARAMETRES_HREF}
                className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center"
              >
                <Settings className="text-white" size={18} />
              </Link>
            </div>
          }
        />
      </section>

      {/* Partie blanche qui remonte */}
      <section className="-mt-16 px-6 pb-6 relative z-10">

        {/* Cartes KPI */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
          {KPI_DATA.map((item, i) => (
            <KpiCard key={i} {...item} />
          ))}
        </div>

        {/* Contenu */}
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_2fr_1.2fr] gap-4">
            <EntreprisesWidget
              total={249}
              entreprises={ENTREPRISES}
            />

            <ProjetsFinancesWidget
              total={1578}
              financements={PROJETS}
            />

            <FinancementChart
              totalBudget={41512000}
              totalDecaisse={25612000}
              data={FINANCEMENT_SERIES}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
            <EvolutionChart
              mensuel={EVOLUTION_MENSUEL}
              hebdomadaire={EVOLUTION_HEBDO}
              journalier={EVOLUTION_JOURNALIER}
            />

            <RepartitionChart data={REPARTITION} />
          </div>
        </div>

      </section>
    </div>
  );
}
