interface TableWidgetColumn<T> {
    key: string;
    label: string;
    align?: 'left' | 'right' | 'center';
    render: (row: T) => React.ReactNode;
}

interface TableWidgetProps<T> {
    title: string;
    columns: TableWidgetColumn<T>[];
    rows: T[];
    rowKey: (row: T) => string | number;
}

const ALIGN_CLASS: Record<'left' | 'right' | 'center', string> = {
    left: 'text-left',
    right: 'text-right',
    center: 'text-center',
};

export default function TableWidget<T>({ title, columns, rows, rowKey }: TableWidgetProps<T>) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm overflow-x-auto">
            <h3 className="text-base font-semibold mb-4" style={{ color: '#1F2937' }}>
                {title}
            </h3>
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-gray-400 text-xs">
                        {columns.map((col) => (
                            <th key={col.key} className={`pb-2 font-medium ${ALIGN_CLASS[col.align ?? 'left']}`}>
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={rowKey(row)} className="border-t border-gray-50">
                            {columns.map((col) => (
                                <td key={col.key} className={`py-2.5 ${ALIGN_CLASS[col.align ?? 'left']}`}>
                                    {col.render(row)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}