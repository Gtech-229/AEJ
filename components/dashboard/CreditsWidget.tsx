'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Credit {
    id: number;
    code: string;
    beneficiaire: string;
    montant: number;
    statut: 'actif' | 'solde' | 'retard';
}

interface CreditsWidgetProps {
    total: number;
    credits: Credit[];
    pageSize?: number;
}

function StatusBadge({ statut }: { statut: Credit['statut'] }) {
    const map: Record<Credit['statut'], { label: string; dot: string; className: string }> = {
        actif: { label: 'Actif', dot: 'bg-green-primary', className: 'bg-green-light text-green-primary' },
        solde: { label: 'Soldé', dot: 'bg-gray-400', className: 'bg-gray-100 text-gray-600' },
        retard: { label: 'En retard', dot: 'bg-red-500', className: 'bg-red-50 text-red-600' },
    };
    const { label, dot, className } = map[statut];
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${className}`}>
            <span className={`w-1.5 h-1.5 rounded-full inline-block ${dot}`} />
            {label}
        </span>
    );
}

/** Analogue de `ProjetsFinancesWidget`, mais pour le portefeuille de crédits d'un organisme financeur. */
export default function CreditsWidget({ total, credits, pageSize = 6 }: CreditsWidgetProps) {
    const [page, setPage] = useState(0);
    const totalPages = Math.ceil(credits.length / pageSize);
    const slice = credits.slice(page * pageSize, (page + 1) * pageSize);

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-gray-400 font-medium">Crédits accordés</p>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="w-7 h-7 border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 transition-colors"
                    >
                        <ChevronLeft size={13} />
                    </button>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={page >= totalPages - 1}
                        className="w-7 h-7 border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 transition-colors"
                    >
                        <ChevronRight size={13} />
                    </button>
                </div>
            </div>

            <p className="text-2xl font-bold text-gray-900 mb-4">
                {total.toLocaleString('fr-FR')} <span className="text-base font-normal text-gray-400">Crédits</span>
            </p>

            <div className="grid grid-cols-[1fr_1.3fr_1fr_1.1fr] gap-x-3 text-xs text-gray-400 font-medium pb-2 border-b border-gray-100 mb-2">
                <span>Code</span>
                <span>Bénéficiaire</span>
                <span>Montant</span>
                <span>Statut</span>
            </div>
            <div className="space-y-3">
                {slice.map((c) => (
                    <div key={c.id} className="grid grid-cols-[1fr_1.3fr_1fr_1.1fr] gap-x-3 items-center py-1 border-b border-gray-50 last:border-0">
                        <span className="text-xs font-bold text-gray-700 leading-tight">{c.code}</span>
                        <span className="text-xs text-gray-600 leading-tight truncate">{c.beneficiaire}</span>
                        <span className="text-xs text-gray-500">{c.montant.toLocaleString('fr-FR')}</span>
                        <StatusBadge statut={c.statut} />
                    </div>
                ))}
            </div>
        </div>
    );
}