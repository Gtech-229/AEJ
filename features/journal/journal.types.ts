export type JournalActionType = 'creation' | 'modification' | 'suppression' | 'connexion' | 'export';

export interface JournalEntry {
  id: string;
  horodatage: string; // ISO
  utilisateur: string;
  role: string;
  action: JournalActionType;
  ressource: string;
  details: string;
  adresseIp?: string;
}
