import { Suspense } from 'react';
import { ProjetsDispositifsClient } from './projets-dispositifs.client';

export default function ProjetsDispositifsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Chargement…</div>}>
      <ProjetsDispositifsClient />
    </Suspense>
  );
}
