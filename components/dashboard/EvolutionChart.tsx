'use client';

import { useState } from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

type Period = 'mensuel' | 'hebdomadaire' | 'journalier';

interface DataPoint {
  label: string;
  financement: number;
  stage: number;
}

interface EvolutionChartProps {
  mensuel:      DataPoint[];
  hebdomadaire: DataPoint[];
  journalier:   DataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.stroke }} className="font-medium">
          {p.name} : {p.value}
        </p>
      ))}
    </div>
  );
};

const PERIOD_LABELS: { key: Period; label: string }[] = [
  { key: 'mensuel',      label: 'Mensuel' },
  { key: 'hebdomadaire', label: 'Hebdomadaire' },
  { key: 'journalier',   label: 'Journalier' },
];

export default function EvolutionChart({
  mensuel,
  hebdomadaire,
  journalier,
}: EvolutionChartProps) {
  const [period, setPeriod] = useState<Period>('mensuel');

  const dataMap: Record<Period, DataPoint[]> = { mensuel, hebdomadaire, journalier };
  const data = dataMap[period];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h3 className="text-base font-bold text-gray-800">Évolution dans le temps</h3>
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          {PERIOD_LABELS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                ${period === key
                  ? 'bg-green-primary text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="gradFinancement" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#1a7a3c" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#1a7a3c" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradStage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#f97316" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            width={35}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          />

          <Area
            type="monotone"
            dataKey="financement"
            name="financement"
            stroke="#1a7a3c"
            strokeWidth={2.5}
            fill="url(#gradFinancement)"
            dot={{ r: 4, fill: '#1a7a3c', strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
          <Area
            type="monotone"
            dataKey="stage"
            name="stage"
            stroke="#f97316"
            strokeWidth={2.5}
            fill="url(#gradStage)"
            dot={{ r: 4, fill: '#f97316', strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}