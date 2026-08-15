'use client';

import { useState } from 'react';
import { formatNumber } from '@/lib/number';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

type Period = 'mensuel' | 'hebdomadaire' | 'journalier';

interface SeriesConfig {
    key: string;
    name: string;
    color: string;
}

interface DualAreaChartProps {
    title?: string;
    data: Record<Period, Record<string, number | string>[]>;
    series: [SeriesConfig, SeriesConfig];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-lg px-4 py-3 text-sm">
            <p className="font-semibold text-gray-700 mb-1">{label}</p>
            {payload.map((p: any) => (
                <p key={p.dataKey} style={{ color: p.stroke }} className="font-medium">
                    {p.name} : {formatNumber(p.value)}
                </p>
            ))}
        </div>
    );
};

const PERIOD_LABELS: { key: Period; label: string }[] = [
    { key: 'mensuel', label: 'Mensuel' },
    { key: 'hebdomadaire', label: 'Hebdomadaire' },
    { key: 'journalier', label: 'Journalier' },
];

/**
 * Version générique d'`EvolutionChart` : deux séries configurables au lieu
 * de `financement`/`stage` figés. Utilisé pour les dashboards Organismes
 * financière et Entreprise.
 */
export default function DualAreaChart({ title = 'Évolution dans le temps', data, series }: DualAreaChartProps) {
    const [period, setPeriod] = useState<Period>('mensuel');
    const chartData = data[period];
    const [s1, s2] = series;

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <h3 className="text-base font-bold text-gray-800">{title}</h3>
                <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                    {PERIOD_LABELS.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setPeriod(key)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                ${period === key ? 'bg-green-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id={`grad-${s1.key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={s1.color} stopOpacity={0.15} />
                            <stop offset="95%" stopColor={s1.color} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id={`grad-${s2.key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={s2.color} stopOpacity={0.15} />
                            <stop offset="95%" stopColor={s2.color} stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={35} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />

                    <Area
                        type="monotone"
                        dataKey={s1.key}
                        name={s1.name}
                        stroke={s1.color}
                        strokeWidth={2.5}
                        fill={`url(#grad-${s1.key})`}
                        dot={{ r: 4, fill: s1.color, strokeWidth: 0 }}
                        activeDot={{ r: 6 }}
                    />
                    <Area
                        type="monotone"
                        dataKey={s2.key}
                        name={s2.name}
                        stroke={s2.color}
                        strokeWidth={2.5}
                        fill={`url(#grad-${s2.key})`}
                        dot={{ r: 4, fill: s2.color, strokeWidth: 0 }}
                        activeDot={{ r: 6 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}