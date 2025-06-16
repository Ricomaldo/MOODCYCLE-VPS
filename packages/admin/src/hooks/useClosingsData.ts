import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api';

// Interface pour les données de closings
interface ClosingsData {
  [key: string]: Record<string, string>;
}

export function useClosingsData() {
  const [closings, setClosings] = useState<ClosingsData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClosings();
  }, []);

  const loadClosings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getClosings();
      setClosings(data);
    } catch (err) {
      setError('Failed to load closings');
      console.error('Error loading closings:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveClosings = async (closingsData: Record<string, Record<string, string>>) => {
    try {
      console.log('Saving closings to API...');
      await apiClient.saveClosings(closingsData);
      console.log('Closings saved successfully');
      
      // Update local state
      setClosings(closingsData);
      
      return { success: true };
    } catch (error) {
      console.error('Failed to save closings:', error);
      throw error;
    }
  };

  return {
    closings,
    loading,
    error,
    refetch: loadClosings,
    saveClosings
  };
}
