'use client';
type Variant = 'green' | 'orange' | 'red' | 'blue' | 'purple' | 'gray' | 'yellow';
interface BadgeProps { label: string; variant: Variant; dot?: boolean; className?: string; }
const V: Record<Variant, string> = {
    green: 'bg-green-50 text-green-700', orange: 'bg-orange-50 text-orange-500',
    red: 'bg-red-50 text-red-500', blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600', gray: 'bg-gray-100 text-gray-500',
    yellow: 'bg-yellow-50 text-yellow-600',
};
const D: Record<Variant, string> = {
    green: 'bg-green-500', orange: 'bg-orange-400', red: 'bg-red-400',
    blue: 'bg-blue-500', purple: 'bg-purple-500', gray: 'bg-gray-400', yellow: 'bg-yellow-400',
};
export function Badge({ label, variant, dot = true, className = '' }: BadgeProps) {
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${V[variant]} ${className}`}>
            {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${D[variant]}`} />}
            {label}
        </span>
    );
}
