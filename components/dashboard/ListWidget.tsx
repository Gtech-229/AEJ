interface ListWidgetRow {
    label: string;
    value: string | number;
}

interface ListWidgetProps {
    title: string;
    rows: ListWidgetRow[];
}

/** Liste titre/valeur alignée à droite — ex. "Répartition par région" de la maquette. */
export default function ListWidget({ title, rows }: ListWidgetProps) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-base font-semibold mb-4" style={{ color: '#1F2937' }}>
                {title}
            </h3>
            <div className="space-y-3">
                {rows.map((row) => (
                    <div key={row.label} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{row.label}</span>
                        <span className="font-semibold" style={{ color: '#1F2937' }}>
                            {typeof row.value === 'number' ? row.value.toLocaleString('fr-FR') : row.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}