
export interface LegalCase {
  id: string;
  title: string;
  client: string;
  caseNumber: string;
  status: 'En cours' | 'Terminé' | 'En attente' | 'Annulé';
  priority: 'Haute' | 'Moyenne' | 'Basse';
  createdDate: string;
  lastUpdate: string;
  description: string;
  lawyer: string;
  court?: string;
  nextHearing?: string;
}

export type CaseStatus = 'En cours' | 'Terminé' | 'En attente' | 'Annulé';
export type CasePriority = 'Haute' | 'Moyenne' | 'Basse';
