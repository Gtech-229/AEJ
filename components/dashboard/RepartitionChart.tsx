'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { MoreHorizontal } from 'lucide-react';

interface RepartitionItem {
  label:       string;
  pourcentage: number;
  valeur:      number;
  color:       string;
}

interface RepartitionChartProps {
  data: RepartitionItem[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-700">{item.label}</p>
      <p className="text-gray-500">{item.pourcentage}% — {item.valeur}</p>
    </div>
  );
};

export default function RepartitionChart({ data }: RepartitionChartProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-800">Répartition</h3>
        <button className="text-gray-300 hover:text-gray-500 transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Donut */}
      <div className="flex justify-center mb-5">
        <ResponsiveContainer width={180} height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              dataKey="valeur"
              paddingAngle={3}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Légende avec barres de progression */}
      <div className="space-y-3">
        {data.map((item, i) => (
          <div key={i}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600 font-medium">
                {item.label} ({item.pourcentage}%)
              </span>
              <span className="font-bold text-gray-800">{item.valeur}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${item.pourcentage}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}