'use client';

import { useState } from 'react';
import { COLORS } from '@/lib/design/tokens';

interface RegionDensite {
  region: string;
  x: number;
  y: number;
  valeur: number;
}

const DENSITE_PAR_REGION: RegionDensite[] = [
  { region: 'Abidjan', x: 62, y: 68, valeur: 72000 },
  { region: 'Bouaké', x: 48, y: 42, valeur: 41000 },
  { region: 'Yamoussoukro', x: 50, y: 52, valeur: 28000 },
  { region: 'San Pédro', x: 32, y: 78, valeur: 19000 },
  { region: 'Korhogo', x: 42, y: 20, valeur: 15000 },
  { region: 'Daloa', x: 32, y: 52, valeur: 12500 },
  { region: 'Man', x: 22, y: 48, valeur: 9000 },
];

const MAX = Math.max(...DENSITE_PAR_REGION.map((d) => d.valeur));

function densityColor(valeur: number): string {
  const ratio = valeur / MAX;
  if (ratio > 0.8) return '#0f5228';
  if (ratio > 0.55) return COLORS.green;
  if (ratio > 0.35) return '#2d9a52';
  if (ratio > 0.18) return COLORS.orange;
  return '#fdba74';
}

/** Carte interactive de densité (bénéficiaires/crédits) par région — silhouette CI illustrative. */
export default function CIMapCI() {
  const [hovered, setHovered] = useState<RegionDensite | null>(null);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="text-base font-semibold mb-4" style={{ color: COLORS.text }}>
        Répartition géographique des bénéficiaires
      </h3>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 min-w-0">
          <svg viewBox="0 0 100 100" className="w-full h-auto max-h-64" role="img" aria-label="Carte de densité par région">
            <path
              d="M18,20 L45,10 L70,14 L82,28 L86,48 L78,62 L72,80 L60,92 L44,94 L30,86 L20,72 L14,54 L10,36 Z"
              fill="#eef5f0"
              stroke="#d7e5db"
              strokeWidth="0.6"
            />
            {DENSITE_PAR_REGION.map((d) => (
              <g
                key={d.region}
                onMouseEnter={() => setHovered(d)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer"
              >
                <circle cx={d.x} cy={d.y} r={4 + (d.valeur / MAX) * 5} fill={densityColor(d.valeur)} opacity="0.85" />
                <circle cx={d.x} cy={d.y} r="1.2" fill="#fff" />
              </g>
            ))}
          </svg>

          {hovered && (
            <div className="absolute top-2 left-2 bg-white rounded-lg shadow-md px-3 py-2 text-xs border border-gray-100">
              <p className="font-semibold" style={{ color: COLORS.text }}>{hovered.region}</p>
              <p className="text-gray-500">{hovered.valeur.toLocaleString('fr-FR')} bénéficiaires</p>
            </div>
          )}
        </div>

        <div className="shrink-0 md:w-36">
          <p className="text-xs text-gray-400 mb-2">Densité</p>
          <div className="space-y-1.5">
            {[70000, 50000, 30000, 15000].map((v) => (
              <div key={v} className="flex items-center gap-2 text-xs text-gray-600">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: densityColor(v) }} />
                {v.toLocaleString('fr-FR')}+
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
