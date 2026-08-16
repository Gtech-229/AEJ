import { ProjectDetailClient } from '@/features/projects/project-detail.client';

export const metadata = {
  title: 'Projet',
};

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProjectDetailClient projectId={Number(id)} />;
}
