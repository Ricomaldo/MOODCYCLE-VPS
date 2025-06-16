import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api';

interface InsightData {
  id: string;
  baseContent: string;
  content?: string;
  personaVariants?: {
    [key: string]: string;
  };
  targetPersonas?: string[];
  targetPreferences: string[];
  tone: string;
  phase: string;
  jezaApproval: number;
  status: string;
  lastModified: string;
  targetJourney: string[];
  enrichedBy?: string; // New field
}

interface ApiResponse {
  success: boolean;
  data: {
    total: number;
    insights: {
      exportDate: string;
      totalInsights: number;
      validatedCount: number;
      insights: {
        menstrual: InsightData[];
        follicular: InsightData[];
        ovulatory: InsightData[];
        luteal: InsightData[];
      };
    };
  };
}

export function useInsightsData() {
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading insights from API...');
      const apiResponse = await apiClient.getInsights();
      console.log('Raw API response:', apiResponse);
      
      // Parse the nested API structure: response.data.insights.insights
      const flatInsights: InsightData[] = [];
      if (apiResponse?.data?.insights?.insights) {
        console.log('Found nested insights structure:', apiResponse.data.insights.insights);
        Object.values(apiResponse.data.insights.insights).forEach((phaseArray: InsightData[]) => {
          if (Array.isArray(phaseArray)) {
            console.log(`Adding ${phaseArray.length} insights from phase array`);
            // Map API fields to interface, handling both content and baseContent
            const mappedInsights = phaseArray.map((insight: InsightData) => ({
              ...insight,
              baseContent: insight.baseContent || insight.content || '', // Fallback mapping
            }));
            flatInsights.push(...mappedInsights);
          }
        });
      }
      
      console.log('Flattened insights:', flatInsights);
      console.log('Total flattened insights count:', flatInsights.length);
      setInsights(flatInsights);
    } catch (err) {
      setError('Failed to load insights');
      console.error('Error loading insights:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateInsight = async (id: string, updates: Partial<InsightData>) => {
    try {
      console.log('Updating insight:', id, updates);
      setInsights(current => 
        current.map(insight => 
          insight.id === id ? { ...insight, ...updates } : insight
        )
      );
    } catch (err) {
      setError('Failed to update insight');
      console.error('Error updating insight:', err);
    }
  };

  const saveInsights = async () => {
    try {
      setSaving(true);
      setError(null);
      console.log('Saving insights:', insights);
      await apiClient.saveInsights(insights);
      console.log('Insights saved successfully');
    } catch (err) {
      setError('Failed to save insights');
      console.error('Error saving insights:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const saveInsightVariants = async (insightId: string, variants: Record<string, string>) => {
    try {
      setSaving(true);
      setError(null);
      console.log('Saving variants for insight:', insightId, variants);
      await apiClient.saveInsightVariants(insightId, variants);
      // Update local state
      updateInsight(insightId, { personaVariants: variants });
      console.log('Variants saved successfully');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save variants';
      setError(errorMessage);
      console.error('Error saving variants:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const getPersonaProgress = (persona: string) => {
    // Ensure insights is an array
    if (!Array.isArray(insights)) {
      console.log('getPersonaProgress: insights is not an array:', typeof insights);
      return 0;
    }
    
    const totalInsights = insights.length;
    const completedInsights = insights.filter(insight => 
      insight.personaVariants && insight.personaVariants[persona] && insight.personaVariants[persona].trim().length > 0
    ).length;
    
    const progress = totalInsights > 0 ? Math.round((completedInsights / totalInsights) * 100) : 0;
    console.log(`Progress for ${persona}: ${completedInsights}/${totalInsights} = ${progress}%`);
    
    return progress;
  };

  return {
    insights,
    loading,
    error,
    saving,
    updateInsight,
    saveInsights,
    saveInsightVariants,
    getPersonaProgress,
    refetch: loadInsights
  };
}
