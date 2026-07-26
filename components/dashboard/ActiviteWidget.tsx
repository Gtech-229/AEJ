'use client';

export interface ActiviteItem {
    id: number;
    intitule: string;
    type: 'stage' | 'emploi';
    date: string;
    statut: 'ouvert' | 'pourvu' | 'ferme';
}

interface ActiviteWidgetProps {
    items: ActiviteItem[];
}

function TypeBadge({ type }: { type: ActiviteItem['type'] }) {
    return (
        <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${type === 'stage' ? 'bg-blue-100 text-blue-700' : 'bg-green-light text-green-primary'
                }`}
        >
            {type === 'stage' ? 'Stage' : 'Emploi'}
        </span>
    );
}

function StatutBadge({ statut }: { statut: ActiviteItem['statut'] }) {
    const map = {
        ouvert: 'bg-orange-100 text-orange-600',
        pourvu: 'bg-green-light text-green-primary',
        ferme: 'bg-gray-100 text-gray-500',
    } as const;
    const label = { ouvert: 'Ouvert', pourvu: 'Pourvu', ferme: 'Fermé' }[statut];
    return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[statut]}`}>{label}</span>;
}

/** Liste des offres de stage/emploi récentes de l'entreprise. */
export default function ActiviteWidget({ items }: ActiviteWidgetProps) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-gray-400 font-medium mb-4">Activité récente</p>
            <div className="space-y-3">
                {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{item.intitule}</p>
                            <p className="text-xs text-gray-400">{item.date}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <TypeBadge type={item.type} />
                            <StatutBadge statut={item.statut} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}