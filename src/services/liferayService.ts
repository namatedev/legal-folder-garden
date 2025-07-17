
import { LIFERAY_CONFIG, getAuthHeader } from '@/config/liferay';
import { LegalDossier } from '@/types/dossier';

export interface LiferayResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

class LiferayService {
  private baseUrl: string;
  private authHeader: string;

  constructor() {
    this.baseUrl = LIFERAY_CONFIG.baseUrl;
    this.authHeader = getAuthHeader();
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}${LIFERAY_CONFIG.endpoints.dossiers}?page=1&pageSize=1`, {
        method: 'GET',
        headers: {
          'Authorization': this.authHeader,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  async getDossiers(page: number = 1, pageSize: number = 20): Promise<LiferayResponse<LegalDossier>> {
    try {
      const response = await fetch(
        `${this.baseUrl}${LIFERAY_CONFIG.endpoints.dossiers}?page=${page}&pageSize=${pageSize}`,
        {
          method: 'GET',
          headers: {
            'Authorization': this.authHeader,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform the data to match our interface
      const transformedItems = (data.items || []).map((item: any) => ({
        id: item.id?.toString() || Math.random().toString(),
        caseNumber: item.numeroCompletDossier2Instance || 'N/A',
        title: 'Affaire de Divorce Martin', // Hardcoded as requested
        client: 'Marie Martin', // Hardcoded as requested
        caseType: 'Family' as const,
        status: 'Active' as const,
        assignedAttorney: 'Me. Sophie Dubois', // Hardcoded as requested
        dateOpened: item.dateEnregistrementDossierDansRegistre || new Date().toISOString(),
        lastActivity: '2024-09-05', // Hardcoded as requested
        priority: 'High' as const,
        description: item.description || 'Description non disponible',
        documentCount: 0,
        nextHearing: '2024-02-15', // Hardcoded as requested
        estimatedValue: item.estimatedValue,
        
        // Liferay specific fields
        typeRequete: item.typeRequete || '',
        libEntite: item.libEntite || '',
        jugeRapporteur: item.jugeRapporteur || '',
        dateEnregistrementDossierDansRegistre: item.dateEnregistrementDossierDansRegistre || '',
        juridiction2Instance: item.juridiction2Instance || '',
        dateDernierJugement: item.dateDernierJugement || '',
        juridiction1Instance: item.juridiction1Instance || '',
        numeroCompletDossier2Instance: item.numeroCompletDossier2Instance || '',
        numeroCompletDossier1Instance: item.numeroCompletDossier1Instance || '',
        libelleDernierJugemen: item.libelleDernierJugemen || ''
      }));

      return {
        items: transformedItems,
        totalCount: data.totalCount || transformedItems.length,
        page,
        pageSize
      };
    } catch (error) {
      console.error('Error fetching dossiers:', error);
      throw new Error('Failed to fetch dossiers from Liferay');
    }
  }

  async searchDossiers(query: string, page: number = 1, pageSize: number = 20): Promise<LiferayResponse<LegalDossier>> {
    return this.getDossiers(page, pageSize);
  }

  async filterDossiers(filters: any, page: number = 1, pageSize: number = 20): Promise<LiferayResponse<LegalDossier>> {
    return this.getDossiers(page, pageSize);
  }

  async deleteDossier(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}${LIFERAY_CONFIG.endpoints.dossiers}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': this.authHeader,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting dossier:', error);
      throw new Error('Failed to delete dossier');
    }
  }
}

export const liferayService = new LiferayService();
