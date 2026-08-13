'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  BadgeCheck,
  Briefcase,
  Building2,
  Dna,
  KeyRound,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
  UserCog,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { cn } from '@/lib/utils';
import { useAuth } from '@/features/auth/auth.context';
import { getUserDisplayName } from '@/features/auth/auth.dto';
import { useConfigurations } from '@/features/configurations/configurations.hooks';
import { useRoles } from '@/features/roles/roles.hooks';
import { useFonctions } from '@/features/fonctions/fonctions.hooks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LoadingState } from '@/components/generic/loader';

/** Fields the backend doesn't return yet — hardcoded placeholders for now. */
const PLACEHOLDER = 'Non renseigné';

type EditableField = 'telephone' | 'adresse';

function DetailCard({
  icon: Icon,
  label,
  value,
  onEdit,
  children,
}: {
  icon: LucideIcon;
  label: string;
  value?: React.ReactNode;
  onEdit?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="group relative rounded-xl border border-border bg-card p-4">
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Modifier ${label}`}
          className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
        >
          <Pencil className="size-3.5" />
        </button>
      )}
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4.5" />
        </span>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          {children ?? (
            <p className={cn('truncate text-sm font-medium', value ? 'text-foreground' : 'text-muted-foreground')}>
              {value || PLACEHOLDER}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function AccountDetails() {
  const { user, refreshMe } = useAuth();
  const { data: config } = useConfigurations();
  const { data: roles } = useRoles();
  const { data: fonctions } = useFonctions();

  const [editing, setEditing] = useState<{ field: EditableField; label: string } | null>(null);
  const [draft, setDraft] = useState('');

  const update = useMutation({
    // TODO(backend): confirm the profile-update route + which fields it accepts
    // (the legacy page used PUT /auth/profil with { nom, email }).
    mutationFn: (payload: Record<string, unknown>) => apiClient.put('/auth/profil', payload),
    onSuccess: async () => {
      await refreshMe();
      toast.success('Profil mis à jour');
      setEditing(null);
    },
    onError: () => toast.error('Échec de la mise à jour'),
  });

  if (!user) return <LoadingState label="Chargement du profil…" />;

  const displayName = getUserDisplayName(user);
  const roleLabel = user.role?.libelle ?? roles?.find((r) => r.id === user.role_id)?.libelle;
  const fonctionLabel = fonctions?.find((f) => f.id === user.fonction_id)?.nom;
  const actif = (user.is_active ?? 1) !== 0;

  function openEdit(field: EditableField, label: string, current: string) {
    setDraft(current);
    setEditing({ field, label });
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profil</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Gérez les informations de {user.prenom || displayName}.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <DetailCard icon={UserCog} label="Nom complet" value={displayName} />
        <DetailCard icon={Mail} label="Email" value={user.email} />
        <DetailCard
          icon={Phone}
          label="Téléphone"
          value={user.telephone}
          onEdit={() => openEdit('telephone', 'Téléphone', user.telephone ?? '')}
        />
        <DetailCard
          icon={MapPin}
          label="Adresse"
          value={user.adresse}
          onEdit={() => openEdit('adresse', 'Adresse', user.adresse ?? '')}
        />
        <DetailCard icon={Briefcase} label="Fonction" value={fonctionLabel} />
        <DetailCard icon={ShieldCheck} label="Rôle" value={roleLabel} />
        <DetailCard icon={BadgeCheck} label="Structure" value={config?.intitule_structure} />
        {/* Not in /personnel/me yet — hardcoded until the backend ships them. */}
        <DetailCard icon={Dna} label="Titre" value={PLACEHOLDER} />
        <DetailCard icon={Building2} label="Service" value={PLACEHOLDER} />
        <DetailCard
          icon={ShieldCheck}
          label="Statut"
          children={
            <span
              className={cn(
                'mt-0.5 inline-flex items-center gap-1.5 text-sm font-medium',
                actif ? 'text-success' : 'text-destructive',
              )}
            >
              <span className={cn('size-1.5 rounded-full', actif ? 'bg-success' : 'bg-destructive')} />
              {actif ? 'Actif' : 'Inactif'}
            </span>
          }
        />
        <DetailCard icon={KeyRound} label="Mot de passe">
          <Link
            href="/dashboard/parametrage/password"
            className="text-sm font-medium text-primary hover:underline"
          >
            Changer le mot de passe
          </Link>
        </DetailCard>
      </div>

      {/* Edit dialog for the inline-editable fields */}
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier — {editing?.label}</DialogTitle>
            <DialogDescription>Mettez à jour cette information de votre profil.</DialogDescription>
          </DialogHeader>
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            type={editing?.field === 'telephone' ? 'tel' : 'text'}
            placeholder={editing?.label}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)} disabled={update.isPending}>
              Annuler
            </Button>
            <Button
              onClick={() => editing && update.mutate({ [editing.field]: draft })}
              disabled={update.isPending}
            >
              {update.isPending ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
