'use client';
import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
interface Props { open: boolean; onClose: () => void; onConfirm: () => Promise<void>; title?: string; description?: string; confirmLabel?: string; }
export function ConfirmDialog({ open, onClose, onConfirm, title = 'Confirmer la suppression', description = 'Cette action est irréversible.', confirmLabel = 'Supprimer' }: Props) {
    const [loading, setLoading] = useState(false);
    async function handle() { setLoading(true); try { await onConfirm(); onClose(); } finally { setLoading(false); } }
    return (
        <Modal open={open} onClose={onClose} title="" size="sm"
            footer={<div className="flex gap-3"><Button variant="secondary" className="flex-1" onClick={onClose}>Annuler</Button><Button variant="danger" className="flex-1" loading={loading} onClick={handle}>{confirmLabel}</Button></div>}>
            <div className="text-center py-2">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={24} className="text-red-500" /></div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </Modal>
    );
}
