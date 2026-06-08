'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { MoreHorizontal } from 'lucide-react';

interface FinancementChartProps {
  totalBudget: number;
  totalDecaisse: number;
  data: { mois: string; financement: number; stage: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.fill }} className="font-medium">
          {p.name} : {p.value.toLocaleString('fr-FR')}
        </p>
      ))}
    </div>
  );
};

export default function FinancementChart({
  totalBudget,
  totalDecaisse,
  data,
}: FinancementChartProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      {/* En-tête */}
      <div className="flex items-start justify-between mb-1">
        <p className="text-sm text-gray-400 font-medium">Financement (FCFA)</p>
        <button className="text-gray-300 hover:text-gray-500 transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="flex items-baseline gap-2 mb-5">
        <span className="text-2xl font-bold text-green-primary">
          {totalBudget.toLocaleString('fr-FR')}
        </span>
        <span className="text-gray-300 font-light">/</span>
        <span className="text-xl font-bold text-orange-primary">
          {totalDecaisse.toLocaleString('fr-FR')}
        </span>
      </div>

      {/* Graphique */}
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} barSize={14} barGap={3}>
          <XAxis
            dataKey="mois"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          />
          <Bar dataKey="financement" name="Financement" fill="#1a7a3c" radius={[4, 4, 0, 0]} />
          <Bar dataKey="stage"       name="Stages"      fill="#f97316" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}