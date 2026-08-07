'use client';

import { useCountUp } from '../use-count-up';

export function StatCard({
  value,
  suffix = '',
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const animated = useCountUp(value);

  return (
    <div className="rounded-xl bg-white/10 px-2 py-2">
      <p className="text-base font-bold text-white tabular-nums leading-none">
        {animated.toLocaleString('fr-FR')}
        {suffix}
      </p>
      <p className="text-[10px] text-white/60 mt-1 leading-tight">{label}</p>
    </div>
  );
}
