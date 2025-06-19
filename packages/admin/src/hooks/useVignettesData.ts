import { useState, useEffect } from 'react';
import { apiClient, type VignettesData } from '@/services/api';

export function useVignettesData() {
  const [vignettes, setVignettes] = useState<VignettesData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVignettes();
  }, []);

  const loadVignettes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Pour l'instant, nous devrons charger toutes les vignettes
      // ou créer une méthode API pour récupérer toutes les vignettes
      // En attendant, initialisons avec un objet vide
      setVignettes({});
    } catch (err) {
      setError('Failed to load vignettes');
      console.error('Error loading vignettes:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadVignettesForPhaseAndPersona = async (phase: string, persona: string) => {
    try {
      const data = await apiClient.getVignettes(phase, persona);
      
      // Mettre à jour l'état avec les nouvelles vignettes
      setVignettes(prev => ({
        ...prev,
        [phase]: {
          ...prev[phase],
          [persona]: data.vignettes
        }
      }));
      
      return data.vignettes;
    } catch (err) {
      console.error('Error loading vignettes for phase/persona:', err);
      throw err;
    }
  };

  const saveVignettes = async (vignettesData: VignettesData) => {
    try {
      console.log('Saving vignettes to API...');
      await apiClient.saveVignettes(vignettesData);
      console.log('Vignettes saved successfully');
      
      // Update local state
      setVignettes(vignettesData);
      
      return { success: true };
    } catch (error) {
      console.error('Failed to save vignettes:', error);
      throw error;
    }
  };

  return {
    vignettes,
    loading,
    error,
    refetch: loadVignettes,
    loadVignettesForPhaseAndPersona,
    saveVignettes
  };
} 