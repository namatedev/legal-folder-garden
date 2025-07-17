
import { useState, useEffect } from 'react';
import { liferayService, LiferayResponse } from '../services/liferayService';
import { LegalDossier } from '../types/dossier';

export interface UseDossiersOptions {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filters?: {
    caseType?: string;
    status?: string;
    assignedAttorney?: string;
    priority?: string;
  };
}

export interface UseDossiersReturn {
  dossiers: LegalDossier[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  hasMore: boolean;
  refetch: () => void;
  searchDossiers: (query: string) => void;
  filterDossiers: (filters: UseDossiersOptions['filters']) => void;
}

export const useDossiers = (options: UseDossiersOptions = {}): UseDossiersReturn => {
  const [dossiers, setDossiers] = useState<LegalDossier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(options.page || 1);
  const [searchQuery, setSearchQuery] = useState(options.searchQuery || '');
  const [filters, setFilters] = useState(options.filters || {});

  const fetchDossiers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response: LiferayResponse<LegalDossier>;
      
      if (searchQuery) {
        response = await liferayService.searchDossiers(searchQuery, currentPage, options.pageSize);
      } else if (Object.keys(filters).length > 0) {
        response = await liferayService.filterDossiers(filters, currentPage, options.pageSize);
      } else {
        response = await liferayService.getDossiers(currentPage, options.pageSize);
      }
      
      setDossiers(response.items);
      setTotalCount(response.totalCount);
      
      console.log('📊 Fetched dossiers:', response.items?.length || 0);
      console.log('📊 Total count:', response.totalCount);
      console.log('📊 Raw response:', response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dossiers');
      console.error('Error fetching dossiers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDossiers();
  }, [currentPage, searchQuery, filters]);

  const refetch = () => {
    fetchDossiers();
  };

  const searchDossiers = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setFilters({});
  };

  const filterDossiers = (newFilters: UseDossiersOptions['filters']) => {
    setFilters(newFilters || {});
    setCurrentPage(1);
    setSearchQuery('');
  };

  const hasMore = currentPage * (options.pageSize || 20) < totalCount;

  return {
    dossiers,
    loading,
    error,
    totalCount,
    currentPage,
    hasMore,
    refetch,
    searchDossiers,
    filterDossiers,
  };
};
