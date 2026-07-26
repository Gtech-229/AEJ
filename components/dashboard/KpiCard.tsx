import type { LucideIcon } from 'lucide-react';
import { ACCENTS, type AccentName } from '@/lib/design/tokens';

interface KpiCardV2Props {
  icon: LucideIcon;
  label: string;
  value: string | number;
  variation?: number;
  accent?: AccentName;
  href?: string;
}

function formatValue(value: string | number): string {
  if (typeof value === 'number') return value.toLocaleString('fr-FR');
  return value;
}

export default function KpiCardV2({ icon: Icon, label, value, variation, accent = 'green', href }: KpiCardV2Props) {
  const { bg, fg } = ACCENTS[accent];

  const content = (
    <div className="bg-white rounded-2xl p-5 shadow-sm h-full">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: bg }}
      >
        <Icon size={18} style={{ color: fg }} />
      </div>
      <p className="text-2xl font-bold" style={{ color: '#1F2937' }}>
        {formatValue(value)}
      </p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      {variation !== undefined && (
        <p
          className="text-xs font-semibold mt-2 flex items-center gap-0.5"
          style={{ color: variation >= 0 ? '#167C3B' : '#DC2626' }}
        >
          {variation >= 0 ? '↑' : '↓'} {Math.abs(variation)}%
        </p>
      )}
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block hover:shadow-md transition-shadow rounded-2xl">
        {content}
      </a>
    );
  }
  return content;
}