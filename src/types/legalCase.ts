
export interface LegalCase {
  id: string;
  title: string;
  client: string;
  caseNumber: string;
  status: 'En cours' | 'Terminé' | 'En attente' | 'Annulé';
  priority: 'High' | 'Medium' | 'Low';
  createdDate: string;
  lastUpdate: string;
  description: string;
  lawyer: string;
  court?: string;
  courtOfAppeal?: string;
  firstInstanceTribunal?: string;
  nextHearing?: string;
  caseType: 'Civil' | 'Criminal' | 'Corporate' | 'Family' | 'Immigration' | 'Real Estate';
  assignedAttorney: string;
  dateOpened: string;
  lastActivity: string;
  documentCount: number;
}

export type CaseStatus = 'En cours' | 'Terminé' | 'En attente' | 'Annulé';
export type CasePriority = 'High' | 'Medium' | 'Low';
