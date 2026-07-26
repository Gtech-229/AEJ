'use client';

export interface Agence {
    id: number;
    nom: string;
    ville: string;
    nbEmployes: number;
}

interface AgencesWidgetProps {
    agences: Agence[];
}

/** Analogue léger d'`EntreprisesWidget`, pour les agences propres à l'institution. */
export default function AgencesWidget({ agences }: AgencesWidgetProps) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-gray-400 font-medium mb-1">Mes agences</p>
            <p className="text-2xl font-bold text-gray-900 mb-4">
                {agences.length} <span className="text-base font-normal text-gray-400">Agences</span>
            </p>

            <div className="space-y-3">
                {agences.map((a) => (
                    <div key={a.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 bg-green-light rounded-full flex items-center justify-center text-green-primary text-xs font-bold shrink-0">
                                {a.ville.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">{a.nom}</p>
                                <span className="text-xs text-gray-400">{a.ville}</span>
                            </div>
                        </div>
                        <span className="text-xs font-medium text-gray-500 shrink-0">{a.nbEmployes} employés</span>
                    </div>
                ))}
            </div>
        </div>
    );
}