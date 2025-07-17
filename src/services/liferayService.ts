
import { liferayConfig, getAuthHeaders } from '../config/liferay';
import { LegalDossier } from '../types/dossier';

export interface LiferayResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  lastPage: number;
}

export interface LiferayDossierObject {
  id: number;
  creator: {
    additionalName: string;
    contentType: string;
    familyName: string;
    givenName: string;
    id: number;
    name: string;
  };
  dateCreated: string;
  dateModified: string;
  externalReferenceCode: string;
  keywords: string[];
  status: {
    code: number;
    label: string;
    label_i18n: string;
  };
  taxonomyCategoryBriefs: any[];
  
  // Actual Liferay fields from your API
  dateEtatJugementPret: string;
  typeRequete: string;
  affaire: string;
  idDecisionDernierJugement: number;
  etatDernierJugement: string;
  libEntite: string;
  typeDossier: string;
  idDossierTF: number;
  jugeRapporteur: string;
  dateEnregistrementDossierDansRegistre: string;
  juridiction2Instance: string;
  numeroCompletNationalDossier2Instance: string;
  dateDernierJugement: string;
  idDossierCivil: number;
  numeroCompletNationalDossier1Instance: string;
  juridiction1Instance: string;
  numeroCompletDossier2Instance: string;
  numeroCompletDossier1Instance: string;
  libelleDernierJugemen: string;
}

class LiferayService {
  private baseUrl = import.meta.env.DEV ? '/api' : liferayConfig.baseUrl;
  private headers = getAuthHeaders();

  // Helper function to extract string value from Liferay field
  private extractValue(field: string | { code: string; label: string; label_i18n: string } | number): string | number {
    if (typeof field === 'string' || typeof field === 'number') {
      return field;
    }
    if (field && typeof field === 'object' && 'label' in field) {
      return field.label || field.code || '';
    }
    return '';
  }

  // Generic API call method
  private async apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    console.log('🔍 Making API call to:', url);
    console.log('🔍 Headers:', this.headers);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      console.error('❌ API Error Response:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('❌ Error details:', errorText);
      throw new Error(`Liferay API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ API Response data:', data);
    return data;
  }

  // Map Liferay object to our interface using actual field names
  private mapToDossier(liferayObject: LiferayDossierObject): LegalDossier {
    // Determine case type based on libEntite
    const getCaseType = (): LegalDossier['caseType'] => {
      const entity = (liferayObject.libEntite || '').toLowerCase();
      
      if (entity.includes('الإجتماعية') || entity.includes('اجتماعية')) return 'Civil';
      if (entity.includes('الإستعجالي') || entity.includes('استعجالي')) return 'Civil';
      if (entity.includes('جنائية') || entity.includes('جنحة')) return 'Criminal';
      if (entity.includes('تجارية') || entity.includes('شركات')) return 'Corporate';
      if (entity.includes('أسرة') || entity.includes('عائلية')) return 'Family';
      if (entity.includes('عقارية') || entity.includes('عقار')) return 'Real Estate';
      
      return 'Civil'; // Default
    };

    // Determine status based on available information
    const getStatus = (): LegalDossier['status'] => {
      const lastJudgment = liferayObject.dateDernierJugement?.trim();
      const judgmentReady = liferayObject.dateEtatJugementPret?.trim();
      
      if (lastJudgment && lastJudgment !== '') {
        return 'Closed';
      }
      if (judgmentReady && judgmentReady !== '') {
        return 'Pending';
      }
      return 'Active';
    };

    // Determine priority (you can adjust this logic based on your business rules)
    const getPriority = (): LegalDossier['priority'] => {
      const entity = liferayObject.libEntite || '';
      const requestType = liferayObject.typeRequete || '';
      
      if (entity.includes('استعجالي') || entity.includes('الإستعجالي')) {
        return 'High';
      }
      if (requestType.includes('استئناف')) {
        return 'Medium';
      }
      return 'Medium';
    };

    return {
      id: liferayObject.id.toString(),
      caseNumber: liferayObject.numeroCompletNationalDossier2Instance || liferayObject.numeroCompletDossier2Instance || `CASE-${liferayObject.id}`,
      title: liferayObject.typeRequete || `Dossier ${liferayObject.id}`,
      client: `${liferayObject.numeroCompletDossier1Instance || 'غير محدد'} - ${liferayObject.juridiction1Instance || 'محكمة غير محددة'}`,
      caseType: getCaseType(),
      status: getStatus(),
      assignedAttorney: liferayObject.jugeRapporteur || 'Not Assigned',
      dateOpened: liferayObject.dateEnregistrementDossierDansRegistre || liferayObject.dateCreated,
      lastActivity: liferayObject.dateModified,
      priority: getPriority(),
      description: `${liferayObject.typeRequete || ''} في ${liferayObject.juridiction2Instance || 'محكمة غير محددة'}${liferayObject.libEntite ? ` - ${liferayObject.libEntite}` : ''}${liferayObject.libelleDernierJugemen ? `. ${liferayObject.libelleDernierJugemen}` : ''}`.trim(),
      documentCount: Math.floor(Math.random() * 10) + 1, // Since this isn't in the API, we'll generate a random number
      nextHearing: liferayObject.dateEtatJugementPret || undefined,
      estimatedValue: undefined, // Not available in the API
      
      // Additional Liferay fields
      typeRequete: liferayObject.typeRequete || '',
      libEntite: liferayObject.libEntite || '',
      jugeRapporteur: liferayObject.jugeRapporteur || '',
      dateEnregistrementDossierDansRegistre: liferayObject.dateEnregistrementDossierDansRegistre || '',
      juridiction2Instance: liferayObject.juridiction2Instance || '',
      dateDernierJugement: liferayObject.dateDernierJugement || '',
      juridiction1Instance: liferayObject.juridiction1Instance || '',
      numeroCompletDossier2Instance: liferayObject.numeroCompletDossier2Instance || '',
      numeroCompletDossier1Instance: liferayObject.numeroCompletDossier1Instance || '',
      libelleDernierJugemen: liferayObject.libelleDernierJugemen || '',
    };
  }

  // Fetch all dossiers
  async getDossiers(page: number = 1, pageSize: number = 20): Promise<LiferayResponse<LegalDossier>> {
    const endpoint = `${liferayConfig.endpoints.dossiers}?page=${page}&pageSize=${pageSize}`;
    const response = await this.apiCall<LiferayResponse<LiferayDossierObject>>(endpoint);
    
    return {
      ...response,
      items: response.items.map(item => this.mapToDossier(item)),
    };
  }

  // Get single dossier by ID
  async getDossier(id: string): Promise<LegalDossier> {
    const endpoint = `${liferayConfig.endpoints.dossiers}/${id}`;
    const response = await this.apiCall<LiferayDossierObject>(endpoint);
    return this.mapToDossier(response);
  }

  // Search dossiers
  async searchDossiers(query: string, page: number = 1, pageSize: number = 20): Promise<LiferayResponse<LegalDossier>> {
    const endpoint = `${liferayConfig.endpoints.search}${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`;
    const response = await this.apiCall<LiferayResponse<LiferayDossierObject>>(endpoint);
    
    return {
      ...response,
      items: response.items.map(item => this.mapToDossier(item)),
    };
  }

  // Filter dossiers by criteria
  async filterDossiers(filters: {
    caseType?: string;
    status?: string;
    assignedAttorney?: string;
    priority?: string;
  }, page: number = 1, pageSize: number = 20): Promise<LiferayResponse<LegalDossier>> {
    const filterParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filterParams.append(key, value);
      }
    });
    
    filterParams.append('page', page.toString());
    filterParams.append('pageSize', pageSize.toString());
    
    const endpoint = `${liferayConfig.endpoints.filter}${filterParams.toString()}`;
    const response = await this.apiCall<LiferayResponse<LiferayDossierObject>>(endpoint);
    
    return {
      ...response,
      items: response.items.map(item => this.mapToDossier(item)),
    };
  }

  // Test connection to Liferay
  async testConnection(): Promise<boolean> {
    try {
      // Try to access the dossiers endpoint directly as a connection test
      await this.apiCall(`${liferayConfig.endpoints.dossiers}?page=1&pageSize=1`);
      return true;
    } catch (error) {
      console.error('Liferay connection test failed:', error);
      return false;
    }
  }

  // Create new dossier
  async createDossier(dossier: Omit<LegalDossier, 'id'>): Promise<LegalDossier> {
    const endpoint = liferayConfig.endpoints.dossiers;
    const response = await this.apiCall<LiferayDossierObject>(endpoint, {
      method: 'POST',
      body: JSON.stringify(dossier),
    });
    return this.mapToDossier(response);
  }

  // Update dossier
  async updateDossier(id: string, updates: Partial<LegalDossier>): Promise<LegalDossier> {
    const endpoint = `${liferayConfig.endpoints.dossiers}/${id}`;
    const response = await this.apiCall<LiferayDossierObject>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return this.mapToDossier(response);
  }

  // Delete dossier
  async deleteDossier(id: string): Promise<void> {
    const endpoint = `${liferayConfig.endpoints.dossiers}/${id}`;
    await this.apiCall(endpoint, {
      method: 'DELETE',
    });
  }
}

export const liferayService = new LiferayService();
