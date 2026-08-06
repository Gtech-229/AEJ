'use client';

import Link from 'next/link';
import { GenericTable } from '@/components/generic/generic-table';
import { KpiCard, DonutChart } from '@/components/shared/OrganismesCharts';
import { useImpact } from './impact.hooks';
import { impactColumns } from './impact.columns';

export function ImpactPage({ creditId }: { creditId: string }) {
  const { data, isLoading, error } = useImpact(creditId);

  if (isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Chargement des indicateurs…</div>;
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-sm text-red-700">
          Impossible de charger les indicateurs d'impact.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5 max-w-[1400px] mx-auto">
      <div className="text-xs text-gray-400 flex items-center gap-1.5">
        <Link href="/organismes/dashboard" className="hover:underline">Accueil</Link> <span>›</span>
        <Link href="/organismes/beneficiaires" className="hover:underline">Bénéficiaires</Link> <span>›</span>
        <span className="font-medium text-gray-700">Indicateurs d'impact</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard
          label="Emplois créés"
          value={`${data.emploisCrees.toLocaleString('fr-FR')} emplois`}
          sublabel={`${data.emploisVariation >= 0 ? '↗' : '↘'} ${data.emploisVariation}% vs N-1`}
        />
        <KpiCard
          label="Taux d'inclusion féminine"
          value={`${data.tauxInclusionFeminine}% femmes`}
          sublabel={`${data.femmesSurTotal} sur ${data.femmesTotal}`}
        />
        <KpiCard
          label="Taux de pérennité (6 mois)"
          value={`${data.tauxPerennite6Mois}% actifs`}
          sublabel={`${data.projetsActifs} projets`}
        />
        <KpiCard
          label="Taux d'inclusion des jeunes"
          value={`${data.tauxInclusionJeunes}% jeunes (<35 ans)`}
          sublabel={`${data.jeunesTotal} jeunes`}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-6">
          <div>
            <p className="text-xs font-medium text-gray-600 mb-3">Répartition des emplois par secteur</p>
            <DonutChart data={data.repartitionParSecteur} size={120} />
          </div>

          <div>
            <p className="text-xs font-medium text-gray-600 mb-3">Évolution mensuelle</p>
            <GenericTable
              data={data.evolution}
              columns={impactColumns}
              emptyMessage="Aucune donnée mensuelle."
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Score de santé</h3>
          <div className="flex items-center gap-4">
            <div
              className="relative w-16 h-16 rounded-full shrink-0"
              style={{ background: `conic-gradient(#1a7a3c 0% ${data.scoreSante}%, #e5e7eb ${data.scoreSante}% 100%)` }}
            >
              <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center text-sm font-bold text-gray-800">
                {data.scoreSante}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400">Score global</p>
              <p className="text-sm font-semibold text-gray-800">{data.scoreSante}/100</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
