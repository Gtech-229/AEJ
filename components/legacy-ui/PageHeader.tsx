import React from 'react';

interface Props {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
    variant?: 'light' | 'dark'; 
}

export function PageHeader({ title, subtitle, actions, variant = 'light' }: Props) {
    const titleColor = variant === 'dark' ? 'text-white' : 'text-gray-900';
    const subtitleColor = variant === 'dark' ? 'text-white/70' : 'text-gray-400';

    return (
        <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
                <h1 className={`text-2xl font-bold ${titleColor}`}>{title}</h1>
                {subtitle && <p className={`text-sm mt-0.5 ${subtitleColor}`}>{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
    );
}