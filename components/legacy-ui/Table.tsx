'use client';
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
export interface Column<T> { key: string; header: string; render: (row: T) => React.ReactNode; width?: string; }
interface TableProps<T> { columns: Column<T>[]; data: T[]; loading?: boolean; emptyText?: string; page?: number; totalPages?: number; onPageChange?: (p: number) => void; onRowClick?: (row: T) => void; }
export function Table<T extends { id: number | string }>({ columns, data, loading = false, emptyText = 'Aucune donnée', page = 0, totalPages = 1, onPageChange, onRowClick }: TableProps<T>) {
    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {loading ? (
                <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                    <span className="w-5 h-5 border-2 border-gray-200 border-t-green-primary rounded-full animate-spin mr-2" />Chargement...
                </div>
            ) : data.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-gray-400 text-sm">{emptyText}</div>
            ) : (
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            {columns.map(c => <th key={c.key} className="text-left text-xs font-semibold text-gray-400 px-4 py-3.5 whitespace-nowrap" style={{ width: c.width }}>{c.header}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(row => (
                            <tr key={row.id} onClick={() => onRowClick?.(row)}
                                className={`border-b border-gray-50 transition-colors ${onRowClick ? 'cursor-pointer hover:bg-gray-50/70' : 'hover:bg-gray-50/50'}`}>
                                {columns.map(c => <td key={c.key} className="px-4 py-3.5">{c.render(row)}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {totalPages > 1 && onPageChange && (
                <div className="flex items-center justify-between px-4 py-3.5 border-t border-gray-100">
                    <span className="text-xs text-gray-400">Page {page + 1} sur {totalPages}</span>
                    <div className="flex items-center gap-1">
                        <button onClick={() => onPageChange(Math.max(0, page - 1))} disabled={page === 0} className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-30"><ChevronLeft size={14} /></button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                            <button key={i} onClick={() => onPageChange(i)} className="w-8 h-8 rounded-lg text-xs font-semibold"
                                style={{ backgroundColor: page === i ? '#1a7a3c' : 'transparent', color: page === i ? 'white' : '#6b7280' }}>{i + 1}</button>
                        ))}
                        <button onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-30"><ChevronRight size={14} /></button>
                    </div>
                </div>
            )}
        </div>
    );
}