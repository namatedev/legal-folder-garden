import { useState } from 'react';
import { Search, Plus, Filter, Scale, Hash, Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { LegalCase, CaseStatus } from '@/types/legalCase';
import { LegalDossier } from '@/types/dossier';
import LegalCaseCard from './LegalCaseCard';
import LegalCaseListView from './LegalCaseListView';
import AddCaseForm from './AddCaseForm';
import { useNavigate } from 'react-router-dom';

interface LegalCaseListProps {
  cases: LegalCase[];
  onAddCase: (caseData: Omit<LegalCase, 'id'>) => void;
  onEditCase: (caseId: string) => void;
  onDeleteCase?: (caseId: string) => void;
}

const LegalCaseList = ({ cases, onAddCase, onEditCase, onDeleteCase }: LegalCaseListProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

  const filteredCases = cases.filter(legalCase => {
    const matchesSearch = legalCase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         legalCase.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         legalCase.caseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || legalCase.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddCase = (caseData: Omit<LegalCase, 'id'>) => {
    onAddCase(caseData);
    setShowAddForm(false);
  };

  const getStatusCounts = () => {
    return cases.reduce((acc, legalCase) => {
      acc[legalCase.status] = (acc[legalCase.status] || 0) + 1;
      return acc;
    }, {} as Record<CaseStatus, number>);
  };

  const statusCounts = getStatusCounts();

  if (showAddForm) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <AddCaseForm
          onAddCase={handleAddCase}
          onCancel={() => setShowAddForm(false)}
          existingCases={cases}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dossiers Juridiques / Web Juris</h1>
                <p className="text-sm text-gray-600">Gestion des affaires en cours</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => navigate('/liferay-dossiers')}
                className="bg-gray-50 hover:bg-gray-100"
              >
                <Hash className="h-4 w-4 mr-2" />
                Dossiers Liferay
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/case-numbers')}
                className="bg-gray-50 hover:bg-gray-100"
              >
                <Hash className="h-4 w-4 mr-2" />
                Numéros de dossier
              </Button>
              <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau dossier
              </Button>
            </div>
            <ConnectionStatus />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{cases.length}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <Scale className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En cours</p>
                <p className="text-2xl font-bold text-blue-600">{statusCounts['En cours'] || 0}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Terminés</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts['Terminé'] || 0}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">{statusCounts['En attente'] || 0}</p>
              </div>
              <div className="bg-yellow-100 p-2 rounded-lg">
                <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par titre, client ou numéro de dossier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="Terminé">Terminé</SelectItem>
                  <SelectItem value="Annulé">Annulé</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex border rounded-lg bg-white">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none border-r"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Cases Display */}
        {filteredCases.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
            <Scale className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'Aucun dossier trouvé' : 'Aucun dossier'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Essayez de modifier vos critères de recherche'
                : 'Commencez par créer votre premier dossier juridique'
              }
            </p>
            {(!searchTerm && statusFilter === 'all') && (
              <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Créer un dossier
              </Button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCases.map((legalCase) => {
              // Convert LegalCase to LegalDossier for compatibility
              const dossier: LegalDossier = {
                ...legalCase,
                caseType: legalCase.caseType as LegalDossier['caseType'],
                status: legalCase.status as LegalDossier['status'],
                assignedAttorney: legalCase.assignedAttorney,
                dateOpened: legalCase.dateOpened,
                lastActivity: legalCase.lastActivity,
                documentCount: legalCase.documentCount || 0,
                typeRequete: '',
                libEntite: '',
                jugeRapporteur: '',
                dateEnregistrementDossierDansRegistre: legalCase.dateOpened,
                juridiction2Instance: '',
                dateDernierJugement: '',
                juridiction1Instance: '',
                numeroCompletDossier2Instance: legalCase.caseNumber,
                numeroCompletDossier1Instance: '',
                libelleDernierJugemen: ''
              };
              
              return (
                <LegalCaseCard
                  key={legalCase.id}
                  legalCase={dossier}
                  onEdit={onEditCase}
                  onDelete={onDeleteCase}
                />
              );
            })}
          </div>
        ) : (
          <LegalCaseListView 
            cases={filteredCases} 
            onEdit={onEditCase}
            onDelete={onDeleteCase}
          />
        )}
      </div>
    </div>
  );
};

export default LegalCaseList;
