'use client';

export interface ListKpiItem {
  label: string;
  value: string | number;
  tone?: 'default' | 'success' | 'warning' | 'danger';
}

/**
 * Bandeau de petites statistiques au-dessus d'une liste (GenericTable).
 * Les valeurs sont calculées côté client à partir des données déjà chargées
 * — l'API ne renvoie pas de bloc `meta`/stats à ce jour (confirmé via
 * /api/localites, /api/fonctions), et comme les listes ne sont pas paginées
 * côté serveur pour l'instant, ce calcul reste exact sur l'ensemble réel.
 * TODO: si l'API expose un jour un objet de stats natif, le brancher ici en
 * remplacement du calcul local (voir chaque `*.kpis.ts` pour le point
 * d'entrée à changer).
 */
export function ListKpis({ items }: { items: ListKpiItem[] }) {
  const toneClass: Record<NonNullable<ListKpiItem['tone']>, string> = {
    default: 'text-foreground',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-destructive',
  };

  return (
    <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-border bg-card px-4 py-3 shadow-sm"
        >
          <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
          <p className={`mt-1 text-xl font-bold ${toneClass[item.tone ?? 'default']}`}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
