import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api';
import { Phase, PhasesData } from '@/types/phases';

export function usePhasesData() {
  const [phases, setPhases] = useState<PhasesData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPhases();
  }, []);

  const loadPhases = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading phases data from API...');
      const response = await apiClient.getPhases();
      
      console.log('Phases API response:', response);
      
      // API returns phase data directly from phases.json français
      if (response && (response.data || response)) {
        const phasesData = response.data || response;
        setPhases(phasesData as PhasesData);
      } else {
        setError('Aucune donnée de phase reçue de l\'API');
      }
    } catch (err) {
      setError('Échec du chargement des phases');
      console.error('Error loading phases:', err);
    } finally {
      setLoading(false);
    }
  };

  const savePhases = async (phasesData: PhasesData) => {
    try {
      console.log('Saving phases to API...');
      await apiClient.savePhases(phasesData);
      console.log('Phases saved successfully');
      
      // Update local state
      setPhases(phasesData);
      
      return { success: true };
    } catch (error) {
      console.error('Failed to save phases:', error);
      throw error;
    }
  };

  return {
    phases,
    loading,
    error,
    refetch: loadPhases,
    savePhases
  };
}
