'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Entreprise {
  id:       number;
  nom:      string;
  secteur:  string;
  initiales: string;
}

interface EntreprisesWidgetProps {
  total:      number;
  entreprises: Entreprise[];
  pageSize?:  number;
}

const SECTEUR_COLOR: Record<string, string> = {
  Technologies:      'bg-blue-100 text-blue-700',
  Télécommunications:'bg-purple-100 text-purple-700',
  Financier:         'bg-yellow-100 text-yellow-700',
  Agriculture:       'bg-green-100 text-green-700',
  Santé:             'bg-red-100 text-red-700',
  default:           'bg-gray-100 text-gray-600',
};

function getSecteurClass(secteur: string) {
  return SECTEUR_COLOR[secteur] ?? SECTEUR_COLOR.default;
}

export default function EntreprisesWidget({
  total,
  entreprises,
  pageSize = 6,
}: EntreprisesWidgetProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(entreprises.length / pageSize);
  const slice = entreprises.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm text-gray-400 font-medium">Entreprises Partenaires</p>
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
        <span className="text-base font-normal text-gray-400">Entreprises</span>
      </p>

      {/* Liste */}
      <div className="space-y-3">
        {slice.map((e) => (
          <div key={e.id} className="flex items-center gap-3">
            {/* Avatar initiales */}
            <div className="w-9 h-9 bg-green-light rounded-full flex items-center justify-center
                            text-green-primary text-xs font-bold shrink-0">
              {e.initiales}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{e.nom}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getSecteurClass(e.secteur)}`}>
                {e.secteur}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}