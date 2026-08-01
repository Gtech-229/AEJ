interface ActionItem {
    label: string;
    href: string;
    accentBg: string;
    accentDot: string;
}

interface ActionsWidgetProps {
    title: string;
    items: ActionItem[];
}

/** Liens raccourcis — ex. "Actions rapides" de la maquette. */
export default function ActionsWidget({ title, items }: ActionsWidgetProps) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-base font-semibold mb-4" style={{ color: '#1F2937' }}>
                {title}
            </h3>
            <div className="space-y-2">
                {items.map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                    >
                        <span
                            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                            style={{ backgroundColor: item.accentBg }}
                        >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.accentDot }} />
                        </span>
                        <span className="text-sm text-gray-700">{item.label}</span>
                    </a>
                ))}
            </div>
        </div>
    );
}