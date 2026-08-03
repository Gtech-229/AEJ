'use client';
import React from 'react';
type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant; size?: Size; loading?: boolean; icon?: React.ReactNode; children: React.ReactNode;
}
// Theme-token based (was hardcoded #1a7a3c green) — primary follows the accent.
const VS: Record<Variant, string> = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'border border-border text-foreground/80 hover:bg-muted',
    danger: 'bg-destructive text-white hover:bg-destructive/90',
    ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground',
};
const SS: Record<Size, string> = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3 text-base' };
export function Button({ variant = 'primary', size = 'md', loading = false, icon, children, className = '', disabled, ...props }: ButtonProps) {
    return (
        <button disabled={disabled || loading}
            className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed ${VS[variant]} ${SS[size]} ${className}`}
            {...props}>
            {loading ? <span className="w-4 h-4 border-2 border-current/40 border-t-current rounded-full animate-spin" /> : icon}
            {children}
        </button>
    );
}
