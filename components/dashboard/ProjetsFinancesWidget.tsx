'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
interface Financement {
  id:         number;
  code:       string;
  partenaire: string;
  date:       string;
  statut:     'en_cours' | 'acheve' | 'suspendu';
}
interface ProjetsFinancesWidgetProps {
  total:       number;
  financements: Financement[];
  pageSize?:   number;
}
function StatusBadge({ statut }: { statut: Financement['statut'] }) {
  if (statut === 'en_cours') {
    return (
      <span className="badge-en-cours">
        <span className="w-1.5 h-1.5 rounded-full bg-green-primary inline-block" />
        En cours
      </span>
    );
  }
  if (statut === 'acheve') {
    return (
      <span className="badge-acheve">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />
        Achevé
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
      Suspendu
    </span>
  );
}
export default function ProjetsFinancesWidget({
  total,
  financements,
  pageSize = 6,
}: ProjetsFinancesWidgetProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(financements.length / pageSize);
  const slice = financements.slice(page * pageSize, (page + 1) * pageSize);
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm text-gray-400 font-medium">Projets financés</p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="w-7 h-7 border border-gray-200 rounded-full flex items-center justify-center
                       hover:bg-gray-50 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={13} />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="w-7 h-7 border border-gray-200 rounded-full flex items-center justify-center
                       hover:bg-gray-50 disabled:opacity-30 transition-colors"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-4">
        {total.toLocaleString('fr-FR')}{' '}
        <span className="text-base font-normal text-gray-400">Projets</span>
      </p>
      {/* Tableau */}
      <div>
        <div className="grid grid-cols-[1fr_1.5fr_1fr_1.2fr] gap-x-3 text-xs text-gray-400 font-medium
                        pb-2 border-b border-gray-100 mb-2">
          <span>Code</span>
          <span>Partenaire</span>
          <span>Date</span>
          <span>Statut</span>
        </div>
        <div className="space-y-3">
          {slice.map((f) => (
            <div
              key={f.id}
              className="grid grid-cols-[1fr_1.5fr_1fr_1.2fr] gap-x-3 items-center
                         py-1 border-b border-gray-50 last:border-0"
            >
              <span className="text-xs font-bold text-gray-700 leading-tight">{f.code}</span>
              <span className="text-xs text-gray-600 leading-tight">{f.partenaire}</span>
              <span className="text-xs text-gray-500">{f.date}</span>
              <StatusBadge statut={f.statut} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}