import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { LegalDossier } from '@/types/dossier';
import { useDossiers } from '@/hooks/useDossiers';
import { liferayService } from '@/services/liferayService';
import LegalCaseCard from '@/components/LegalCaseCard';
import LegalCaseListView from '@/components/LegalCaseListView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Plus, AlertCircle, Search, Filter, Scale, Hash, Grid3X3, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { dossiers, loading, error, refetch } = useDossiers({ pageSize: 50 });
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'failed'>('checking');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

  useEffect(() => {
    const testConnection = async () => {
      console.log('🔗 Testing Liferay connection...');
      try {
        const isConnected = await liferayService.testConnection();
        setConnectionStatus(isConnected ? 'connected' : 'failed');
        if (isConnected) {
          console.log('✅ Liferay connection successful');
        } else {
          console.log('❌ Liferay connection failed');
        }
      } catch (error) {
        console.error('❌ Connection test error:', error);
        setConnectionStatus('failed');
      }
    };

    testConnection();
  }, []);

  const filteredDossiers = dossiers.filter(dossier => {
    const matchesSearch = dossier.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dossier.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dossier.numeroCompletDossier2Instance?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || dossier.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleEditCase = (caseId: string) => {
    const selectedCase = dossiers.find(c => c.id === caseId);
    if (selectedCase) {
      console.log('Édition du dossier:', selectedCase);
      toast.info('Fonctionnalité d\'édition à venir');
    }
  };

  const handleDeleteCase = async (caseId: string) => {
    const selectedCase = dossiers.find(c => c.id === caseId);
    if (selectedCase) {
      try {
        await liferayService.deleteDossier(caseId);
        refetch();
        toast.success(`Dossier "${selectedCase.title}" supprimé avec succès`);
      } catch (error) {
        toast.error('Erreur lors de la suppression du dossier');
        console.error('Error deleting dossier:', error);
      }
    }
  };

  const getStatusCounts = () => {
    return dossiers.reduce((acc, dossier) => {
      acc[dossier.status] = (acc[dossier.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const statusCounts = getStatusCounts();

  // Convert LegalDossier to LegalCase format for LegalCaseListView
  const convertedCases = filteredDossiers.map(dossier => ({
    id: dossier.id,
    title: dossier.title || 'Affaire de Divorce Martin',
    caseNumber: dossier.numeroCompletDossier2Instance || dossier.caseNumber,
    client: dossier.client || 'Marie Martin',
    lawyer: dossier.assignedAttorney || 'Me. Sophie Dubois',
    status: dossier.status as any,
    priority: dossier.priority === 'High' ? 'Haute' : dossier.priority === 'Medium' ? 'Moyenne' : 'Basse',
    caseType: dossier.caseType || 'Divorce',
    assignedAttorney: dossier.assignedAttorney || 'Me. Sophie Dubois',
    dateOpened: dossier.dateOpened || dossier.dateEnregistrementDossierDansRegistre || new Date().toISOString(),
    lastActivity: dossier.lastActivity || new Date().toISOString(),
    documentCount: dossier.documentCount || 0,
    createdDate: dossier.dateEnregistrementDossierDansRegistre || dossier.dateOpened || new Date().toISOString(),
    lastUpdate: dossier.lastActivity || new Date().toISOString(),
    description: dossier.description || 'Description non disponible',
    courtOfAppeal: dossier.juridiction2Instance,
    firstInstanceTribunal: dossier.juridiction1Instance,
    nextHearing: dossier.nextHearing
  }));

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
                <h1 className="text-3xl font-bold text-gray-900">Gestion des Dossiers Juridiques</h1>
                <p className="text-gray-600 mt-1">
                  Gérez vos dossiers juridiques avec efficacité
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className={`h-2 w-2 rounded-full ${
                    connectionStatus === 'connected' ? 'bg-green-500' : 
                    connectionStatus === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                  }`} />
                  <span className="text-sm text-gray-500">
                    {connectionStatus === 'connected' ? 'Connecté à Liferay' :
                     connectionStatus === 'failed' ? 'Déconnecté de Liferay' : 'Vérification...'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={refetch}
                disabled={loading}
                variant="outline"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
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
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Dossier
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{dossiers.length}</p>
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

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 font-medium">Erreur</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              className="mt-3"
            >
              Réessayer
            </Button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredDossiers.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'Aucun dossier trouvé' : 'Aucun dossier trouvé'}
            </h3>
            <p className="text-gray-600 mb-4">
              {connectionStatus === 'failed' 
                ? 'Impossible de se connecter à Liferay. Vérifiez votre configuration.'
                : searchTerm || statusFilter !== 'all'
                ? 'Essayez de modifier vos critères de recherche'
                : 'Aucun dossier n\'a été trouvé dans le système.'
              }
            </p>
            <Button onClick={refetch} variant="outline">
              Réessayer
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Dossiers ({filteredDossiers.length})
              </h2>
              <p className="text-gray-600">
                Données récupérées depuis Liferay
              </p>
            </div>
            
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDossiers.map((dossier) => (
                  <LegalCaseCard
                    key={dossier.id}
                    legalCase={dossier}
                    onEdit={handleEditCase}
                    onDelete={handleDeleteCase}
                  />
                ))}
              </div>
            ) : (
              <LegalCaseListView 
                cases={convertedCases} 
                onEdit={handleEditCase}
                onDelete={handleDeleteCase}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
