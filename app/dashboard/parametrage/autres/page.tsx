import { Suspense } from 'react';
import { LoadingState } from '@/components/generic/loader';
import { AutresParametresClient } from './autres.client';

export default function AutresParametragePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AutresParametresClient />
    </Suspense>
  );
}
