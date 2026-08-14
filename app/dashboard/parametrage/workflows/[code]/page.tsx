import { WorkflowEtapesClient } from '@/features/workflows/workflow-etapes.client';

export const metadata = {
  title: 'Étapes du workflow',
};

export default async function WorkflowEtapesPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return <WorkflowEtapesClient modelCode={decodeURIComponent(code)} />;
}
