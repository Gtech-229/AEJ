'use client';
import React from 'react';
type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant; size?: Size; loading?: boolean; icon?: React.ReactNode; children: React.ReactNode;
}
const VS: Record<Variant, string> = {
    primary: 'text-white', secondary: 'border border-gray-200 text-gray-600 hover:bg-gray-50',
    danger: 'bg-red-500 hover:bg-red-600 text-white', ghost: 'text-gray-500 hover:bg-gray-100',
};
const SS: Record<Size, string> = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3 text-base' };
export function Button({ variant = 'primary', size = 'md', loading = false, icon, children, className = '', disabled, ...props }: ButtonProps) {
    return (
        <button disabled={disabled || loading}
            className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed ${VS[variant]} ${SS[size]} ${className}`}
            style={variant === 'primary' ? { backgroundColor: '#1a7a3c' } : undefined} {...props}>
            {loading ? <span className="w-4 h-4 border-2 border-current/40 border-t-current rounded-full animate-spin" /> : icon}
            {children}
        </button>
    );
}

