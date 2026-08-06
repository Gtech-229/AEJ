import AppHeader from '@/components/shared/AppHeader';

export default function EntrepriseHeader() {
  return (
    <AppHeader
      logoBadge="AEJ"
      title="AGENCE EMPLOI JEUNES"
      subtitle="Espace Entreprise partenaire"
      badgeLabel="PSGouv 2022–2024"
      ribbonText="Programme Social du Gouvernement 2022–2024 — espace Entreprise partenaire"
      fallbackRoleLabel="Entreprise partenaire"
    />
  );
}
