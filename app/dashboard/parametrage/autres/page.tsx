import { Suspense } from 'react';
import { AutresParametresClient } from './autres.client';

export default function AutresParametragePage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Chargement…</div>}>
      <AutresParametresClient />
    </Suspense>
  );
}
