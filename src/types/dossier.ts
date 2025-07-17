
export interface LegalDossier {
  id: string;
  caseNumber: string;
  title: string;
  client: string;
  caseType: 'Civil' | 'Criminal' | 'Corporate' | 'Family' | 'Immigration' | 'Real Estate';
  status: 'Active' | 'Closed' | 'Pending' | 'On Hold';
  assignedAttorney: string;
  dateOpened: string;
  lastActivity: string;
  priority: 'High' | 'Medium' | 'Low';
  description: string;
  documentCount: number;
  nextHearing?: string;
  estimatedValue?: string;
  
  // Additional Liferay fields
  typeRequete: string;
  libEntite: string;
  jugeRapporteur: string;
  dateEnregistrementDossierDansRegistre: string;
  juridiction2Instance: string;
  dateDernierJugement: string;
  juridiction1Instance: string;
  numeroCompletDossier2Instance: string;
  numeroCompletDossier1Instance: string;
  libelleDernierJugemen: string;
}
