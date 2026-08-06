'use client';

import type { ReactNode } from 'react';

// ─── KPI Card ─────────────────────────────────────────────────────────────

export function KpiCard({
  icon,
  label,
  value,
  sublabel,
  variant = 'default',
}: {
  icon?: ReactNode;
  label: string;
  value: string;
  sublabel?: string;
  variant?: 'default' | 'danger';
}) {
  return (
    <div
      className={`rounded-2xl p-4 shadow-sm ${
        variant === 'danger' ? 'bg-red-50 border border-red-100' : 'bg-white'
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <p className="text-xs text-gray-500">{label}</p>
      </div>
      <p className={`text-xl font-bold ${variant === 'danger' ? 'text-red-600' : 'text-gray-800'}`}>{value}</p>
      {sublabel && <p className="text-[11px] text-gray-400 mt-0.5">{sublabel}</p>}
    </div>
  );
}

// ─── Donut chart (pure CSS conic-gradient) ─────────────────────────────────

export function DonutChart({
  data,
  centerValue,
  centerLabel,
  size = 140,
}: {
  data: { label: string; pourcentage: number; color: string }[];
  centerValue?: string;
  centerLabel?: string;
  size?: number;
}) {
  let acc = 0;
  const stops = data
    .map((d) => {
      const start = acc;
      acc += d.pourcentage;
      return `${d.color} ${start}% ${acc}%`;
    })
    .join(', ');

  return (
    <div className="flex items-center gap-5">
      <div
        className="relative rounded-full shrink-0"
        style={{
          width: size,
          height: size,
          background: `conic-gradient(${stops})`,
        }}
      >
        <div
          className="absolute rounded-full bg-white flex flex-col items-center justify-center"
          style={{ inset: size * 0.18 }}
        >
          {centerValue && <p className="text-sm font-bold text-gray-800">{centerValue}</p>}
          {centerLabel && <p className="text-[10px] text-gray-400">{centerLabel}</p>}
        </div>
      </div>
      <ul className="space-y-1.5">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2 text-xs text-gray-600">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            {d.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Simple grouped bar chart ───────────────────────────────────────────────

export function BarChart({
  data,
  series,
  height = 140,
}: {
  data: Record<string, number | string>[];
  series: { key: string; color: string; label: string }[];
  height?: number;
}) {
  const max = Math.max(1, ...data.flatMap((d) => series.map((s) => Number(d[s.key]) || 0)));

  return (
    <div>
      <div className="flex items-end gap-3" style={{ height }}>
        {data.map((row, i) => (
          <div key={i} className="flex-1 flex items-end justify-center gap-1">
            {series.map((s) => {
              const val = Number(row[s.key]) || 0;
              return (
                <div
                  key={s.key}
                  className="w-2.5 rounded-t"
                  style={{ height: `${(val / max) * 100}%`, backgroundColor: s.color, minHeight: 2 }}
                  title={`${s.label}: ${val}`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-2">
        {data.map((row, i) => (
          <div key={i} className="flex-1 text-center text-[10px] text-gray-400">
            {row.label as string}
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-2">
        {series.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Line chart (prévu vs réalisé) — simple SVG polyline ───────────────────

export function LineChart({
  series,
  height = 180,
}: {
  series: { label: string; color: string; points: number[] }[];
  height?: number;
}) {
  const allValues = series.flatMap((s) => s.points);
  const max = Math.max(...allValues, 1);
  const width = 100; // viewBox units, scales responsively

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
        {series.map((s) => {
          const step = width / (s.points.length - 1 || 1);
          const pts = s.points
            .map((v, i) => `${i * step},${height - (v / max) * (height - 10) - 5}`)
            .join(' ');
          return (
            <polyline
              key={s.label}
              points={pts}
              fill="none"
              stroke={s.color}
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>
      <div className="flex gap-4 mt-2">
        {series.map((s) => (
          <span key={s.label} className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Status badges ──────────────────────────────────────────────────────────

const ECHEANCE_STYLES: Record<string, { label: string; className: string }> = {
  payee: { label: 'Payée', className: 'bg-green-100 text-green-700' },
  en_retard: { label: 'En retard', className: 'bg-red-100 text-red-700' },
  a_venir: { label: 'À venir', className: 'bg-blue-100 text-blue-700' },
  non_definie: { label: 'Non définie', className: 'bg-gray-100 text-gray-500' },
};

export function EcheanceBadge({ statut }: { statut: keyof typeof ECHEANCE_STYLES }) {
  const s = ECHEANCE_STYLES[statut];
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.className}`}>{s.label}</span>;
}

const EXPLOITATION_STYLES: Record<string, { label: string; className: string }> = {
  en_activite: { label: 'En activité', className: 'bg-green-100 text-green-700' },
  suspendu: { label: 'Suspendu', className: 'bg-amber-100 text-amber-700' },
  clos: { label: 'Clos', className: 'bg-gray-100 text-gray-500' },
};

export function ExploitationBadge({ statut }: { statut: keyof typeof EXPLOITATION_STYLES }) {
  const s = EXPLOITATION_STYLES[statut];
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.className}`}>{s.label}</span>;
}
