import { useState, useEffect } from 'react';
import { fetchResearchByCategory, type CulturalResearchItem, extractMeaning, extractTechnicalRecipe } from '../services/researchService';

type Era = 'ancient' | 'modern' | 'future';

interface EraData {
  era: Era;
  items: CulturalResearchItem[];
  loading: boolean;
  error: string | null;
}

interface UseResearchDataReturn {
  ancient: EraData;
  modern: EraData;
  future: EraData;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch cultural research data for each era.
 * Provides loading states, error handling, and extracted content.
 */
export function useResearchData(): UseResearchDataReturn {
  const [ancient, setAncient] = useState<EraData>({ era: 'ancient', items: [], loading: true, error: null });
  const [modern, setModern] = useState<EraData>({ era: 'modern', items: [], loading: true, error: null });
  const [future, setFuture] = useState<EraData>({ era: 'future', items: [], loading: true, error: null });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [ancientData, modernData, futureData] = await Promise.all([
        fetchResearchByCategory('ancient'),
        fetchResearchByCategory('modern'),
        fetchResearchByCategory('future'),
      ]);

      setAncient({ era: 'ancient', items: ancientData, loading: false, error: null });
      setModern({ era: 'modern', items: modernData, loading: false, error: null });
      setFuture({ era: 'future', items: futureData, loading: false, error: null });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch research data';
      setError(errorMessage);
      setAncient(prev => ({ ...prev, loading: false, error: errorMessage }));
      setModern(prev => ({ ...prev, loading: false, error: errorMessage }));
      setFuture(prev => ({ ...prev, loading: false, error: errorMessage }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    fetchData();
  };

  return {
    ancient,
    modern,
    future,
    loading,
    error,
    refetch,
  };
}

/**
 * Helper to get the first item of an era with extracted meaning and technical recipe.
 */
export function useEraItem(era: Era) {
  const { ancient, modern, future } = useResearchData();
  const eraData = era === 'ancient' ? ancient : era === 'modern' ? modern : future;

  if (eraData.items.length === 0) {
    return {
      item: null,
      meaning: '',
      technicalRecipe: '',
      loading: eraData.loading,
      error: eraData.error,
    };
  }

  const item = eraData.items[0];
  return {
    item,
    meaning: extractMeaning(item),
    technicalRecipe: extractTechnicalRecipe(item),
    loading: eraData.loading,
    error: eraData.error,
  };
}