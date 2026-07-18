'use client';
import { useEffect, useState } from 'react';
import { Plus, Search, Eye, Pencil, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { Badge } from '@/components/UI/Badge';
import { Button } from '@/components/UI/Button';
import { Input, Select } from '@/components/UI/Input';
import { Modal } from '@/components/UI/Modal';
import { Table, Column } from '@/components/UI/Table';
import { ConfirmDialog } from '@/components/UI/ConfirmDialog';
import { PageHeader } from '@/components/UI/PageHeader';

type Statut = 'en_stage' | 'stage_acheve' | 'emploi_obtenu' | 'en_recherche';
interface Stagiaire { id: number; ref: string; nom: string; prenom: string; email: string; telephone: string; statut: Statut; entreprise?: string; domaine?: string; }
interface FormState { nom: string; prenom: string; email: string; telephone: string; statut: Statut; entreprise: string; domaine: string; }

const INIT: FormState = { nom: '', prenom: '', email: '', telephone: '', statut: 'en_recherche', entreprise: '', domaine: '' };

const MOCK: Stagiaire[] = [
    { id: 1, ref: 'AEJ-2024-0001', nom: 'Koné', prenom: 'Aminata', email: 'a.kone@ci.ci', telephone: '0701234567', statut: 'en_stage', entreprise: 'Orange CI', domaine: 'IT' },
    { id: 2, ref: 'AEJ-2024-0002', nom: 'Diallo', prenom: 'Moussa', email: 'm.diallo@ci.ci', telephone: '0702345678', statut: 'emploi_obtenu', entreprise: 'SGCI', domaine: 'Finance' },
    { id: 3, ref: 'AEJ-2024-0003', nom: 'Touré', prenom: 'Fatoumata', email: 'f.toure@ci.ci', telephone: '0703456789', statut: 'en_stage', entreprise: 'CADO Tech', domaine: 'IT' },
    { id: 4, ref: 'AEJ-2024-0004', nom: 'Bamba', prenom: 'Seydou', email: 's.bamba@ci.ci', telephone: '0704567890', statut: 'stage_acheve', domaine: 'Commerce' },
    { id: 5, ref: 'AEJ-2024-0005', nom: 'Coulibaly', prenom: 'Mariam', email: 'm.coul@ci.ci', telephone: '0705678901', statut: 'en_recherche', domaine: 'Marketing' },
];

const STATUT_MAP: Record<Statut, { label: string; variant: 'blue' | 'green' | 'purple' | 'gray' }> = {
    en_stage: { label: 'En stage', variant: 'blue' },
    stage_acheve: { label: 'Stage achevé', variant: 'green' },
    emploi_obtenu: { label: 'Emploi obtenu', variant: 'purple' },
    en_recherche: { label: 'En recherche', variant: 'gray' },
};

const STATUT_OPTIONS = [
    { value: 'en_stage', label: 'En stage' }, { value: 'stage_acheve', label: 'Stage achevé' },
    { value: 'emploi_obtenu', label: 'Emploi obtenu' }, { value: 'en_recherche', label: 'En recherche' },
];

const PAGE_SIZE = 8;

export default function StagiairesPage() {
    const [items, setItems] = useState<Stagiaire[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatut, setFilter] = useState<Statut | 'tous'>('tous');
    const [page, setPage] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Stagiaire | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Stagiaire | null>(null);
    const [viewTarget, setViewTarget] = useState<Stagiaire | null>(null);
    const [form, setForm] = useState<FormState>(INIT);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setItems(MOCK);
        setLoading(false);
    }, []);

    const filtered = items.filter(s => {
        const q = search.toLowerCase();
        return (!q || `${s.nom} ${s.prenom}`.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.ref.toLowerCase().includes(q))
            && (filterStatut === 'tous' || s.statut === filterStatut);
    });
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    function setField(k: keyof FormState, v: string) { setForm(f => ({ ...f, [k]: v })); }

    function openCreate() { setEditTarget(null); setForm(INIT); setError(''); setModalOpen(true); }
    function openEdit(s: Stagiaire) {
        setEditTarget(s);
        setForm({ nom: s.nom, prenom: s.prenom, email: s.email, telephone: s.telephone, statut: s.statut, entreprise: s.entreprise ?? '', domaine: s.domaine ?? '' });
        setError(''); setModalOpen(true);
    }

    async function handleSave() {
        setSaving(true); setError('');
        try {
            if (editTarget) {
                const r = await api.put<Stagiaire>(`/stagiaires/${editTarget.id}`, form);
                setItems(p => p.map(s => s.id === editTarget.id ? r.data : s));
            } else {
                const r = await api.post<Stagiaire>('/stagiaires', form);
                setItems(p => [r.data, ...p]);
            }
            setModalOpen(false);
        } catch (e: any) { setError(e?.response?.data?.message ?? 'Erreur'); }
        finally { setSaving(false); }
    }

    async function handleDelete() {
        if (!deleteTarget) return;
        await api.delete(`/stagiaires/${deleteTarget.id}`);
        setItems(p => p.filter(s => s.id !== deleteTarget.id));
        setDeleteTarget(null);
    }

    const columns: Column<Stagiaire>[] = [
        { key: 'ref', header: 'Référence', render: s => <span className="text-xs font-mono font-bold text-gray-500">{s.ref}</span> },
        {
            key: 'nom', header: 'Stagiaire', render: s => (
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: '#1a7a3c' }}>
                        {s.prenom[0]}{s.nom[0]}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-800">{s.prenom} {s.nom}</p>
                        <p className="text-xs text-gray-400">{s.email}</p>
                    </div>
                </div>
            )
        },
        { key: 'domaine', header: 'Domaine', render: s => <span className="text-sm text-gray-600">{s.domaine ?? '—'}</span> },
        { key: 'entreprise', header: 'Entreprise', render: s => <span className="text-sm text-gray-600">{s.entreprise ?? '—'}</span> },
        { key: 'statut', header: 'Statut', render: s => <Badge label={STATUT_MAP[s.statut].label} variant={STATUT_MAP[s.statut].variant} /> },
        {
            key: 'actions', header: '', width: '90px', render: s => (
                <div className="flex gap-1">
                    <button onClick={() => setViewTarget(s)} className="w-8 h-8 rounded-lg hover:bg-blue-50 flex items-center justify-center"><Eye size={13} className="text-blue-400" /></button>
                    <button onClick={() => openEdit(s)} className="w-8 h-8 rounded-lg hover:bg-green-50 flex items-center justify-center"><Pencil size={13} style={{ color: '#1a7a3c' }} /></button>
                    <button onClick={() => setDeleteTarget(s)} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center"><Trash2 size={13} className="text-red-400" /></button>
                </div>
            )
        },
    ];

    return (
        <div className="space-y-6 px-6 py-6 max-w-6xl mx-auto">
            <PageHeader title="Stagiaires" subtitle={`${filtered.length} bénéficiaire${filtered.length > 1 ? 's' : ''}`}
                actions={<Button variant="primary" icon={<Plus size={16} />} onClick={openCreate}>Nouveau stagiaire</Button>} />

            <div className="flex items-center gap-3 flex-wrap">
                <Input icon={<Search size={15} />} value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
                    placeholder="Nom, email, référence..." className="flex-1 min-w-[200px]" />
                <div className="flex gap-2 flex-wrap">
                    {(['tous', 'en_stage', 'stage_acheve', 'emploi_obtenu', 'en_recherche'] as const).map(s => (
                        <button key={s} onClick={() => { setFilter(s); setPage(0); }}
                            className="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                            style={{ backgroundColor: filterStatut === s ? '#1a7a3c' : '#f3f4f6', color: filterStatut === s ? 'white' : '#6b7280' }}>
                            {s === 'tous' ? 'Tous' : STATUT_MAP[s].label}
                        </button>
                    ))}
                </div>
            </div>

            <Table columns={columns} data={paginated} loading={loading} emptyText="Aucun stagiaire"
                page={page} totalPages={totalPages} onPageChange={setPage} />

            {/* Modal création/édition */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}
                title={editTarget ? 'Modifier le stagiaire' : 'Nouveau stagiaire'} size="lg"
                footer={<div className="flex gap-3">
                    <Button variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Annuler</Button>
                    <Button variant="primary" className="flex-1" loading={saving} onClick={handleSave}>
                        {editTarget ? 'Enregistrer' : 'Créer'}
                    </Button>
                </div>}>
                <div className="space-y-4">
                    {error && <div className="px-4 py-3 bg-red-50 rounded-xl text-sm text-red-600">{error}</div>}
                    <div className="grid grid-cols-2 gap-3">
                        <Input label="Prénom *" value={form.prenom} onChange={e => setField('prenom', e.target.value)} required />
                        <Input label="Nom *" value={form.nom} onChange={e => setField('nom', e.target.value)} required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Input label="Email *" type="email" value={form.email} onChange={e => setField('email', e.target.value)} required />
                        <Input label="Téléphone" value={form.telephone} onChange={e => setField('telephone', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Select label="Statut" value={form.statut} onChange={e => setField('statut', e.target.value as Statut)} options={STATUT_OPTIONS} />
                        <Input label="Domaine" value={form.domaine} onChange={e => setField('domaine', e.target.value)} placeholder="IT, Finance..." />
                    </div>
                    <Input label="Entreprise" value={form.entreprise} onChange={e => setField('entreprise', e.target.value)} />
                </div>
            </Modal>

            {/* Détail */}
            {viewTarget && (
                <Modal open={true} onClose={() => setViewTarget(null)} title="Détail stagiaire" size="sm"
                    footer={<div className="flex gap-3">
                        <Button variant="primary" className="flex-1" icon={<Pencil size={14} />} onClick={() => { setViewTarget(null); openEdit(viewTarget); }}>Modifier</Button>
                        <Button variant="secondary" onClick={() => setViewTarget(null)}>Fermer</Button>
                    </div>}>
                    <div className="space-y-2.5">
                        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-bold" style={{ backgroundColor: '#1a7a3c' }}>
                                {viewTarget.prenom[0]}{viewTarget.nom[0]}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{viewTarget.prenom} {viewTarget.nom}</p>
                                <p className="text-xs text-gray-400">{viewTarget.ref}</p>
                                <Badge label={STATUT_MAP[viewTarget.statut].label} variant={STATUT_MAP[viewTarget.statut].variant} className="mt-1" />
                            </div>
                        </div>
                        {[['Email', viewTarget.email], ['Téléphone', viewTarget.telephone || '—'], ['Domaine', viewTarget.domaine || '—'], ['Entreprise', viewTarget.entreprise || '—']].map(([k, v]) => (
                            <div key={k} className="flex justify-between text-sm"><span className="text-gray-400">{k}</span><span className="font-semibold text-gray-800">{v}</span></div>
                        ))}
                    </div>
                </Modal>
            )}

            <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
                title="Supprimer ce stagiaire ?"
                description={deleteTarget ? `${deleteTarget.prenom} ${deleteTarget.nom} — toutes les données associées seront perdues.` : ''} />
        </div>
    );
}