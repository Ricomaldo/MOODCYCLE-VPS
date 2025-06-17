import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api';

interface PhaseData {
  id: string;
  name: string;
  slug: string;
  color: string;
  duration: string;
  energy: string;
  mood: string;
  description: string;
  characteristics: {
    physical: string[];
    emotional: string[];
    energy: string;
  };
  advice: {
    nutrition: string[];
    activities: string[];
    selfcare: string[];
    avoid: string[];
  };
  rituals: string[];
  affirmation: string;
  symbol: string;
  element: string;
  archetype: string;
  melune: {
    tone: string;
    tempo: string;
    vocabulary: string[];
    communicationStyle: string;
    focus: string;
    avoid: string[];
    encouragementStyle: string;
  };
  contextualEnrichments: {
    id: string;
    targetPersona: string;
    targetPreferences: string[];
    targetJourney: string;
    tone: string;
    contextualText: string;
  }[];
}

export function usePhasesData() {
  const [phases, setPhases] = useState<Record<string, PhaseData>>({});
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
        setPhases(phasesData as Record<string, PhaseData>);
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

  const savePhases = async (phasesData: Record<string, PhaseData>) => {
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
