
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { LegalDossier } from '@/types/dossier';
import { useDossiers } from '@/hooks/useDossiers';
import { liferayService } from '@/services/liferayService';
import LegalCaseCard from '@/components/LegalCaseCard';
import { Button } from '@/components/ui/button';
import { RefreshCw, Plus, AlertCircle } from 'lucide-react';

const Index = () => {
  const { dossiers, loading, error, refetch } = useDossiers({ pageSize: 50 });
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'failed'>('checking');

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
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
            <div className="flex gap-3">
              <Button
                onClick={refetch}
                disabled={loading}
                variant="outline"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
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
        ) : dossiers.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun dossier trouvé
            </h3>
            <p className="text-gray-600 mb-4">
              {connectionStatus === 'failed' 
                ? 'Impossible de se connecter à Liferay. Vérifiez votre configuration.'
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
                Dossiers ({dossiers.length})
              </h2>
              <p className="text-gray-600">
                Données récupérées depuis Liferay
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dossiers.map((dossier) => (
                <LegalCaseCard
                  key={dossier.id}
                  legalCase={dossier}
                  onEdit={handleEditCase}
                  onDelete={handleDeleteCase}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
