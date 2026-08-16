import { ProjectDetailClient } from '@/features/projects/project-detail.client';

export const metadata = {
  title: 'Projet — Guichet',
};

/**
 * Micro-projet 360 opened from a guichet — reuses `ProjectDetailClient` but keeps
 * the guichet as the back context (so the header link returns to the guichet
 * board rather than the flat micro-projets list).
 */
export default async function GuichetProjectPage({
  params,
}: {
  params: Promise<{ id: string; projectId: string }>;
}) {
  const { id, projectId } = await params;
  return (
    <ProjectDetailClient
      projectId={Number(projectId)}
      backHref={`/dashboard/guichets/${id}`}
      backLabel="Retour au guichet"
    />
  );
}
