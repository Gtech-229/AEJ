'use client';

interface StrengthResult {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
}

function evaluate(password: string): StrengthResult {
  if (!password) return { score: 0, label: '', color: 'bg-gray-200' };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const clamped = Math.min(score, 4) as 0 | 1 | 2 | 3 | 4;
  const levels: Record<number, { label: string; color: string }> = {
    0: { label: 'Très faible', color: 'bg-red-500' },
    1: { label: 'Faible', color: 'bg-orange-500' },
    2: { label: 'Moyen', color: 'bg-yellow-500' },
    3: { label: 'Fort', color: 'bg-green-500' },
    4: { label: 'Très fort', color: 'bg-emerald-600' },
  };

  return { score: clamped, ...levels[clamped] };
}

export function PasswordStrengthMeter({ password }: { password: string }) {
  if (!password) return null;
  const { score, label, color } = evaluate(password);

  return (
    <div className="mt-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i < score ? color : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
