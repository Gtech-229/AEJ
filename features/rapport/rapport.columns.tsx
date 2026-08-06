import type { ColumnDef } from '@tanstack/react-table';
import type { RapportResultat } from './rapport.types';

/**
 * `Rapport` ne correspond à aucune liste de lignes : c'est un formulaire de
 * filtres qui produit un objet agrégé (`RapportResultat`), affiché comme des
 * cartes KPI, pas comme un tableau. Ce fichier existe pour respecter la
 * convention (un `.columns.ts` par entité) mais reste vide intentionnellement.
 */
export const rapportColumns: ColumnDef<RapportResultat>[] = [];
