'use client';
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
interface ModalProps { open: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode; size?: 'sm' | 'md' | 'lg'; }
const SIZES = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' };
export function Modal({ open, onClose, title, children, footer, size = 'md' }: ModalProps) {
    useEffect(() => {
        const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        if (open) document.addEventListener('keydown', fn);
        return () => document.removeEventListener('keydown', fn);
    }, [open, onClose]);
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="absolute inset-0" onClick={onClose} />
            <div className={`relative bg-white rounded-3xl shadow-2xl w-full ${SIZES[size]} max-h-[90vh] flex flex-col`}>
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
                    <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                        <X size={16} className="text-gray-400" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
                {footer && <div className="px-6 pb-5 shrink-0">{footer}</div>}
            </div>
        </div>
    );
}