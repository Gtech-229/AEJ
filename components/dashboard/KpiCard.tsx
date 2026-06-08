'use client';

import { ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';

interface KpiCardProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  variation?: number;    
  href?: string;
  loading?: boolean;
}


function formatValue(val: number | string): string {
  if (typeof val === 'string') return val;
  return val.toLocaleString('fr-FR');
}

export default function KpiCard({
  icon: Icon,
  label,
  value,
  variation,
  href,
  loading,
}: KpiCardProps) {
  const isPositive = (variation ?? 0) >= 0;

  return (
    <div className="kpi-card relative group">
      {/* Icône + lien détail */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-green-light rounded-2xl flex items-center justify-center">
          <Icon size={22} className="text-green-primary" />
        </div>
        {href && (
          <Link
            href={href}
            className="w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center
                       hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100"
          >
            <ArrowUpRight size={14} className="text-gray-400" />
          </Link>
        )}
      </div>

      {/* Valeur + badge variation */}
      <div className="flex items-end gap-3">
        {loading ? (
          <div className="h-9 w-28 bg-gray-100 rounded-xl animate-pulse" />
        ) : (
          <span className="text-3xl font-bold text-gray-900 tracking-tight">
            {formatValue(value)}
          </span>
        )}

        {variation !== undefined && !loading && (
          <span className={`mb-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold
            ${isPositive
              ? 'bg-green-primary text-white'
              : 'bg-orange-primary text-white'
            }`}
          >
            {isPositive
              ? <TrendingUp size={11} />
              : <TrendingDown size={11} />
            }
            {isPositive ? '+' : ''}{variation}%
          </span>
        )}
      </div>

      {/* Label */}
      <p className="mt-1.5 text-sm font-medium text-gray-500">{label}</p>
    </div>
  );
}