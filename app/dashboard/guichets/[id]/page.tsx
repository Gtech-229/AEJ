import { GuichetDetailClient } from '@/features/guichets/guichet-detail.client';

export const metadata = {
  title: 'Guichet',
};

export default async function GuichetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <GuichetDetailClient guichetId={Number(id)} />;
}
