
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { liferayConfig, getAuthHeaders } from '../config/liferay';

interface LiferayDossier {
  [key: string]: any;
}

const LiferayDossiers = () => {
  const navigate = useNavigate();
  const [dossiers, setDossiers] = useState<LiferayDossier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDossiers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const credentials = btoa('webjuris-api-service:1234');
      
      const page: number = 1, pageSize: number = 20
      const endpoint = `${liferayConfig.endpoints.dossiers}?page=${page}&pageSize=${pageSize}`;
      console.log('Fetching dossiers from:', endpoint);
      console.log('Using credentials:', credentials);
      const baseUrl = import.meta.env.DEV ? '/api' : liferayConfig.baseUrl;
      const url = `${baseUrl}${endpoint}`;
      console.log('Full URL:', url);
      // const response = await fetch('/o/headless-delivery/v1.0/sites/20121/structured-contents', {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Liferay Response:', data);
      
      // Assuming the response has an items array
      setDossiers(data.items || []);
      toast.success(`${data.items?.length || 0} dossiers récupérés`);
      
    } catch (err) {
      console.error('Error fetching dossiers:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      toast.error('Erreur lors de la récupération des dossiers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDossiers();
  }, []);

  const renderValue = (value: any): string => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const getTableHeaders = () => {
    if (dossiers.length === 0) return [];
    
    // Get all unique keys from all dossiers
    const allKeys = new Set<string>();
    dossiers.forEach(dossier => {
      Object.keys(dossier).forEach(key => allKeys.add(key));
    });
    
    return Array.from(allKeys);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dossiers Liferay</h1>
                <p className="text-sm text-gray-600">
                  Récupération depuis {new URL('https://keycloak-security.apps.ocp4.namategroup.com').hostname}
                </p>
              </div>
            </div>
            <Button
              onClick={fetchDossiers}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
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
              onClick={fetchDossiers}
              className="mt-3"
            >
              Réessayer
            </Button>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Chargement des dossiers...</p>
          </div>
        ) : dossiers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun dossier trouvé
            </h3>
            <p className="text-gray-600 mb-4">
              Aucun dossier n'a été récupéré depuis Liferay
            </p>
            <Button onClick={fetchDossiers} variant="outline">
              Réessayer
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Dossiers récupérés ({dossiers.length})
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {getTableHeaders().map((header) => (
                      <TableHead key={header} className="text-xs font-medium">
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dossiers.map((dossier, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      {getTableHeaders().map((header) => (
                        <TableCell key={header} className="text-sm">
                          {renderValue(dossier[header])}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiferayDossiers;
