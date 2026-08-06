'use client';

import { useState } from 'react';
import { COLORS } from '@/lib/design/tokens';

interface RegionBankFiltersProps {
  banques: string[];
  regions: string[];
  regionPills?: string[];
}

/** Filtres banque/région + badge de programme + pills régions rapides — ex. Dashboard Finance. */
export default function RegionBankFilters({ banques, regions, regionPills = [] }: RegionBankFiltersProps) {
  const [banque, setBanque] = useState(banques[0]);
  const [region, setRegion] = useState(regions[0]);
  const [activePill, setActivePill] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
        style={{ backgroundColor: '#E7F5EC', color: COLORS.green }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.green }} />
        Programme Social AEJ 2022–2024
      </div>

      <select
        value={banque}
        onChange={(e) => setBanque(e.target.value)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white"
      >
        {banques.map((b) => (
          <option key={b}>{b}</option>
        ))}
      </select>

      <select
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white"
      >
        {regions.map((r) => (
          <option key={r}>{r}</option>
        ))}
      </select>

      {regionPills.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {regionPills.map((r) => (
            <button
              key={r}
              onClick={() => setActivePill(r)}
              className="text-xs font-medium px-3 py-1.5 rounded-full border transition-colors"
              style={
                activePill === r
                  ? { backgroundColor: COLORS.green, color: '#fff', borderColor: COLORS.green }
                  : { backgroundColor: '#fff', color: '#6B7280', borderColor: '#E5E7EB' }
              }
            >
              {r}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
