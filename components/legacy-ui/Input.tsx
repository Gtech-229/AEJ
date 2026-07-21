'use client';
import React from 'react';
const base = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-primary/20 focus:border-green-primary transition-all disabled:opacity-50";
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; icon?: React.ReactNode; }
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { label?: string; error?: string; options: { value: string; label: string }[]; }
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { label?: string; error?: string; }
export function Input({ label, error, icon, className = '', ...props }: InputProps) {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
            <div className="relative">
                {icon && <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
                <input className={`${base} ${icon ? 'pl-10' : ''} ${error ? 'border-red-300' : ''} ${className}`} {...props} />
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}
export function Select({ label, error, options, className = '', ...props }: SelectProps) {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
            <select className={`${base} ${error ? 'border-red-300' : ''} ${className}`} {...props}>
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}
export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
            <textarea className={`${base} resize-none ${error ? 'border-red-300' : ''} ${className}`} {...props} />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}