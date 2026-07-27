interface LegendRow {
    label: string;
    pourcentage: number;
    color: string;
}

interface LegendWidgetProps {
    title: string;
    rows: LegendRow[];
    showBar?: boolean;
}

/** Légende pastille + libellé + pourcentage — ex. "Répartition par secteur" de la maquette. */
export default function LegendWidget({ title, rows, showBar = false }: LegendWidgetProps) {
    const maxPourcentage = Math.max(...rows.map((r) => r.pourcentage), 1);

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-base font-semibold mb-4" style={{ color: '#1F2937' }}>
                {title}
            </h3>
            <div className="space-y-3">
                {rows.map((row) => (
                    <div key={row.label} className="flex items-center gap-2.5 text-sm">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: row.color }} />
                        <span className="text-gray-600 flex-1">
                            {row.label} {!showBar && <span className="font-semibold" style={{ color: '#1F2937' }}>{row.pourcentage}%</span>}
                        </span>
                        {showBar ? (
                            <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden shrink-0">
                                <div
                                    className="h-full rounded-full"
                                    style={{ width: `${(row.pourcentage / maxPourcentage) * 100}%`, backgroundColor: row.color }}
                                />
                            </div>
                        ) : (
                            <span className="font-semibold" style={{ color: '#1F2937' }}>{row.pourcentage}%</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}