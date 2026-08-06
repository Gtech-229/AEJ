export interface ImpactPeriode {
  mois: string;
  emploisCrees: number;
  femmes: number;
}

export interface ImpactIndicateurs {
  creditId: string;
  emploisCrees: number;
  emploisVariation: number;
  tauxInclusionFeminine: number;
  femmesTotal: number;
  femmesSurTotal: number;
  tauxPerennite6Mois: number;
  projetsActifs: number;
  tauxInclusionJeunes: number;
  jeunesTotal: number;
  scoreSante: number;
  repartitionParSecteur: { label: string; pourcentage: number; color: string }[];
  evolution: ImpactPeriode[];
}
