import { redirect } from 'next/navigation';

// Fonctions now live under "Autres paramètres" (tabbed). Keep the old URL
// working by redirecting to the Fonctions tab.
export default function FonctionsPage() {
  redirect('/dashboard/parametrage/autres?tab=fonctions');
}
