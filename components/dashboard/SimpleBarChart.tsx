'use client';

import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { COLORS } from '@/lib/design/tokens';

interface SimpleBarChartProps {
    title: string;
    data: { label: string; value: number }[];
    color?: string;
}

/** Une seule série en barres — sobre, comme "Évolution des stages" sur la maquette. */
export default function SimpleBarChart({ title, data, color = COLORS.green }: SimpleBarChartProps) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-base font-semibold mb-4" style={{ color: COLORS.text }}>
                {title}
            </h3>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data}>
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <Tooltip
                        cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                        contentStyle={{ borderRadius: 12, border: '1px solid #f0f0f0', fontSize: 12 }}
                    />
                    <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} maxBarSize={28} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}