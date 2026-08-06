'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { GenericTable } from '@/components/generic/generic-table';
import { useBeneficiairesList } from './use-beneficiaires';
import { beneficiairesColumns } from './beneficiaires.columns';
import { REGIONS } from './beneficiaires.constants';

/**
 * Lecture seule : un bénéficiaire se crée via l'octroi d'un crédit, pas
 * depuis ce back-office (cf. `beneficiaires.hooks.ts`). Pas de bouton
 * "Ajouter", pas de dialogs création/édition/suppression.
 */
export function BeneficiairesPage() {
  const [q, setQ] = useState('');
  const [region, setRegion] = useState('');

  const { data: response, isLoading } = useBeneficiairesList({
    q: q || undefined,
    region: region || undefined,
    size: 50,
  });

  return (
    <div className="p-6 space-y-5 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Bénéficiaires</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {response?.total ?? 0} bénéficiaire{(response?.total ?? 0) > 1 ? 's' : ''} enregistré
          {(response?.total ?? 0) > 1 ? 's' : ''}
        </p>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[220px] relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher (nom, prénom, téléphone...)"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-600"
            />
          </div>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600"
          >
            <option value="">Toutes les régions</option>
            {REGIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <GenericTable
          data={response?.data ?? []}
          columns={beneficiairesColumns}
          searchKey="nomComplet"
          searchPlaceholder="Filtrer les résultats affichés..."
          isLoading={isLoading}
          emptyMessage="Aucun bénéficiaire trouvé."
        />
      </div>
    </div>
  );
}

/** Lien vers le dossier détaillé — utilisé par une éventuelle colonne "Action" si tu l'ajoutes à beneficiaires.columns.tsx. */
export function BeneficiaireDossierLink({ id }: { id: number }) {
  return (
    <Link href={`/organismes/beneficiaires/${id}`} className="text-xs font-medium text-green-700 hover:underline">
      Voir le dossier
    </Link>
  );
}
