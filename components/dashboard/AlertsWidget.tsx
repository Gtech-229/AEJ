export type AlertSeverity = 'critique' | 'attention' | 'info';

interface AlertItem {
    label: string;
    severity: AlertSeverity;
}

interface AlertsWidgetProps {
    title: string;
    items: AlertItem[];
}

const SEVERITY_STYLES: Record<AlertSeverity, string> = {
    critique: 'bg-red-50 text-red-700',
    attention: 'bg-orange-50 text-orange-700',
    info: 'bg-blue-50 text-blue-700',
};

/** Bandeaux colorés — ex. "Alertes & tâches" de la maquette. */
export default function AlertsWidget({ title, items }: AlertsWidgetProps) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-base font-semibold mb-4" style={{ color: '#1F2937' }}>
                {title}
            </h3>
            <div className="space-y-2">
                {items.map((item, i) => (
                    <div key={i} className={`rounded-lg px-3 py-2.5 text-sm font-medium ${SEVERITY_STYLES[item.severity]}`}>
                        {item.label}
                    </div>
                ))}
            </div>
        </div>
    );
}