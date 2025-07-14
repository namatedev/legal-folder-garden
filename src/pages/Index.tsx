import { useState } from 'react';
import { toast } from 'sonner';
import { LegalCase } from '@/types/legalCase';
import LegalCaseList from '@/components/LegalCaseList';

// Données d'exemple avec le nouveau format de numérotation
const sampleCases: LegalCase[] = [
  {
    id: '1',
    title: 'Affaire de divorce Martin vs Dupont',
    client: 'Marie Martin',
    caseNumber: '2024/1504/001',
    status: 'En cours',
    priority: 'Haute',
    createdDate: '2024-01-15T10:00:00Z',
    lastUpdate: '2024-01-20T14:30:00Z',
    description: 'Procédure de divorce contentieux avec garde d\'enfants et partage des biens. Médiation familiale prévue le mois prochain.',
    lawyer: 'Me. Sophie Dubois',
    court: 'Tribunal de Grande Instance de Paris',
    nextHearing: '2024-02-15T09:00:00Z'
  },
  {
    id: '2',
    title: 'Litige commercial TechCorp vs StartupXYZ',
    client: 'TechCorp SARL',
    caseNumber: '2024/1503/001',
    status: 'En cours',
    priority: 'Moyenne',
    createdDate: '2024-01-10T11:00:00Z',
    lastUpdate: '2024-01-25T16:45:00Z',
    description: 'Conflit contractuel concernant la livraison de logiciels. Négociations en cours pour un arrangement amiable.',
    lawyer: 'Me. Jean Moreau',
    court: 'Tribunal de Commerce de Lyon'
  },
  {
    id: '3',
    title: 'Succession de Mme Leclerc',
    client: 'Famille Leclerc',
    caseNumber: '2023/1508/001',
    status: 'Terminé',
    priority: 'Basse',
    createdDate: '2023-12-01T09:00:00Z',
    lastUpdate: '2024-01-30T17:00:00Z',
    description: 'Règlement de succession avec partage des biens immobiliers entre les héritiers. Dossier clos avec accord unanime.',
    lawyer: 'Me. Claire Rousseau'
  },
  {
    id: '4',
    title: 'Défense pénale - Affaire Roussel',
    client: 'Pierre Roussel',
    caseNumber: '2024/1505/001',
    status: 'En attente',
    priority: 'Haute',
    createdDate: '2024-01-22T08:00:00Z',
    lastUpdate: '2024-01-28T12:00:00Z',
    description: 'Défense dans une affaire de délit routier. Attente de l\'expertise technique du véhicule.',
    lawyer: 'Me. Antoine Blanc',
    court: 'Tribunal Correctionnel de Marseille',
    nextHearing: '2024-03-10T14:00:00Z'
  }
];

const Index = () => {
  const [cases, setCases] = useState<LegalCase[]>(sampleCases);

  const handleAddCase = (caseData: Omit<LegalCase, 'id'>) => {
    const newCase: LegalCase = {
      ...caseData,
      id: Date.now().toString()
    };
    
    setCases(prev => [newCase, ...prev]);
    toast.success('Dossier créé avec succès');
  };

  const handleEditCase = (caseId: string) => {
    const selectedCase = cases.find(c => c.id === caseId);
    if (selectedCase) {
      console.log('Édition du dossier:', selectedCase);
      toast.info('Fonctionnalité d\'édition à venir');
    }
  };

  const handleDeleteCase = (caseId: string) => {
    const selectedCase = cases.find(c => c.id === caseId);
    if (selectedCase) {
      setCases(prev => prev.filter(c => c.id !== caseId));
      toast.success(`Dossier "${selectedCase.title}" supprimé avec succès`);
    }
  };

  return (
    <LegalCaseList
      cases={cases}
      onAddCase={handleAddCase}
      onEditCase={handleEditCase}
      onDeleteCase={handleDeleteCase}
    />
  );
};

export default Index;
