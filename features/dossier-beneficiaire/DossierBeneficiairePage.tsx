'use client';

import Link from 'next/link';
import { GenericTable } from '@/components/generic/generic-table';
import { useDossierBeneficiaire } from './dossier-beneficiaire.hooks';
import { dossierBeneficiaireColumns } from './dossier-beneficiaire.columns';

export function DossierBeneficiairePage({ beneficiaireId }: { beneficiaireId: number }) {
  const { data, isLoading, error } = useDossierBeneficiaire(beneficiaireId);

  if (isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Chargement du dossier…</div>;
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-sm text-red-700">
          Impossible de charger ce dossier bénéficiaire.
        </div>
      </div>
    );
  }

  const { beneficiaire, credits } = data;

  return (
    <div className="p-6 space-y-5 max-w-[1400px] mx-auto">
      <div className="text-xs text-gray-400 flex items-center gap-1.5">
        <Link href="/organismes/dashboard" className="hover:underline">Accueil</Link> <span>›</span>
        <Link href="/organismes/beneficiaires" className="hover:underline">Bénéficiaires</Link> <span>›</span>
        <span className="font-medium text-gray-700">Dossier bénéficiaire</span>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center">
            {beneficiaire.prenom.charAt(0)}
            {beneficiaire.nom.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-gray-800">
              {beneficiaire.prenom} {beneficiaire.nom}
            </p>
            <p className="text-xs text-gray-400">{beneficiaire.telephone}</p>
          </div>
        </div>
        <div className="text-sm">
          <p className="text-xs text-gray-400">Région</p>
          <p className="font-medium">{beneficiaire.region}</p>
        </div>
        <div className="text-sm">
          <p className="text-xs text-gray-400">Secteur d'activité</p>
          <p className="font-medium">{beneficiaire.secteurActivite}</p>
        </div>
        <div className="text-sm">
          <p className="text-xs text-gray-400">Montant total financé</p>
          <p className="font-medium">{beneficiaire.montantTotalFinance.toLocaleString('fr-FR')} GNF</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-800 mb-1">
          Crédits ({beneficiaire.nombreCredits})
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          Cliquez sur un crédit pour accéder à son plan de remboursement, son workflow et ses indicateurs d'impact.
        </p>

        {credits.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">Aucun crédit associé à ce bénéficiaire.</p>
        ) : (
          <>
            <GenericTable
              data={credits}
              columns={dossierBeneficiaireColumns}
              emptyMessage="Aucun crédit."
            />
            <div className="flex flex-wrap gap-2 mt-4">
              {credits.map((c) => (
                <div key={c.id} className="flex items-center gap-2 border border-gray-100 rounded-lg px-3 py-1.5">
                  <span className="text-xs font-medium text-gray-600">{c.code}</span>
                  <Link href={`/organismes/credits/${c.id}/remboursement`} className="text-xs text-green-700 hover:underline">
                    Remboursement
                  </Link>
                  <Link href={`/organismes/credits/${c.id}/impact`} className="text-xs text-green-700 hover:underline">
                    Impact
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
