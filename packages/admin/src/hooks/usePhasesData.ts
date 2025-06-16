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
      
      // Assuming the API returns phase data in a structure we can use
      if (response && response.data) {
        setPhases(response.data);
      } else {
        // Set default phase structure if API doesn't return data
        const defaultPhases = {
          menstrual: {
            id: 'menstrual',
            name: 'Menstrual',
            color: '#F44336',
            duration: '3-7 days',
            energy: 'Low, Restoring',
            mood: 'Reflective, Introspective',
            description: 'A time of release and renewal, honoring the wisdom of rest.',
            characteristics: {
              physical: ['Menstrual flow', 'Lower energy', 'Possible cramping', 'Need for warmth'],
              emotional: ['Introspective', 'Sensitive', 'Intuitive', 'Need for solitude']
            },
            advice: {
              nutrition: ['Iron-rich foods', 'Warm drinks', 'Comfort foods', 'Anti-inflammatory foods'],
              activities: ['Gentle yoga', 'Walking', 'Journaling', 'Meditation'],
              selfcare: ['Warm baths', 'Rest', 'Gentle stretching', 'Early bedtime'],
              avoid: ['Intense exercise', 'Social pressure', 'Major decisions', 'Overcaffeination']
            },
            rituals: ['Moon bathing', 'Intention setting', 'Gratitude practice', 'Energy cleansing'],
            affirmation: 'I honor my body\'s wisdom and embrace this time of renewal.',
            symbol: '🌙',
            element: 'Water',
            archetype: 'The Wise Woman'
          },
          follicular: {
            id: 'follicular',
            name: 'Follicular',
            color: '#FFC107',
            duration: '7-10 days',
            energy: 'Rising, Creative',
            mood: 'Optimistic, Fresh',
            description: 'A time of new beginnings and fresh energy, like spring awakening.',
            characteristics: {
              physical: ['Increasing energy', 'Skin clearing', 'Better sleep', 'Improved mood'],
              emotional: ['Optimistic', 'Creative', 'Social', 'Motivated']
            },
            advice: {
              nutrition: ['Fresh vegetables', 'Lean proteins', 'Whole grains', 'Plenty of water'],
              activities: ['New projects', 'Cardio exercise', 'Social activities', 'Learning'],
              selfcare: ['Skincare routine', 'Planning goals', 'Decluttering', 'Vision boarding'],
              avoid: ['Overcommitting', 'Neglecting rest', 'Processed foods', 'Negative media']
            },
            rituals: ['Morning affirmations', 'Goal setting', 'Nature walks', 'Creative expression'],
            affirmation: 'I embrace new possibilities and trust in my creative power.',
            symbol: '🌱',
            element: 'Air',
            archetype: 'The Maiden'
          },
          ovulatory: {
            id: 'ovulatory',
            name: 'Ovulatory',
            color: '#00BCD4',
            duration: '3-5 days',
            energy: 'Peak, Radiant',
            mood: 'Confident, Magnetic',
            description: 'Your time to shine - peak energy, confidence, and magnetic presence.',
            characteristics: {
              physical: ['Peak energy', 'Glowing skin', 'Strong libido', 'Enhanced strength'],
              emotional: ['Confident', 'Outgoing', 'Charismatic', 'Expressive']
            },
            advice: {
              nutrition: ['Raw foods', 'Anti-inflammatory foods', 'Plenty of fiber', 'Light meals'],
              activities: ['High-intensity workouts', 'Public speaking', 'Networking', 'Dating'],
              selfcare: ['Express yourself', 'Take photos', 'Wear bright colors', 'Celebrate achievements'],
              avoid: ['Hiding your light', 'Overindulgence', 'Isolation', 'Self-doubt']
            },
            rituals: ['Sun salutations', 'Manifestation work', 'Celebration rituals', 'Confidence affirmations'],
            affirmation: 'I radiate confidence and attract all that serves my highest good.',
            symbol: '☀️',
            element: 'Fire',
            archetype: 'The Mother'
          },
          luteal: {
            id: 'luteal',
            name: 'Luteal',
            color: '#673AB7',
            duration: '12-14 days',
            energy: 'Focused, Organizing',
            mood: 'Practical, Discerning',
            description: 'Time for completion, organization, and preparing for the next cycle.',
            characteristics: {
              physical: ['Gradual energy decline', 'Possible bloating', 'Breast tenderness', 'Food cravings'],
              emotional: ['Detail-oriented', 'Practical', 'Less social', 'Critical thinking']
            },
            advice: {
              nutrition: ['Complex carbs', 'Magnesium-rich foods', 'B vitamins', 'Healthy fats'],
              activities: ['Organizing', 'Completing projects', 'Administrative tasks', 'Moderate exercise'],
              selfcare: ['Boundaries setting', 'Saying no', 'Cozy evenings', 'Comfort routines'],
              avoid: ['Starting new projects', 'Overcommitting socially', 'Harsh self-criticism', 'Sugar crashes']
            },
            rituals: ['Completion ceremonies', 'Organizing spaces', 'Reflection practices', 'Boundary setting'],
            affirmation: 'I honor my need for completion and trust my inner wisdom.',
            symbol: '🍂',
            element: 'Earth',
            archetype: 'The Wild Woman'
          }
        };
        setPhases(defaultPhases);
      }
    } catch (err) {
      setError('Failed to load phases');
      console.error('Error loading phases:', err);
      
      // Still set default data on error so the interface works
      const defaultPhases = {
        menstrual: {
          id: 'menstrual',
          name: 'Menstrual',
          color: '#F44336',
          duration: '',
          energy: '',
          mood: '',
          description: '',
          characteristics: { physical: [], emotional: [] },
          advice: { nutrition: [], activities: [], selfcare: [], avoid: [] },
          rituals: [],
          affirmation: '',
          symbol: '',
          element: '',
          archetype: ''
        },
        follicular: {
          id: 'follicular',
          name: 'Follicular',
          color: '#FFC107',
          duration: '',
          energy: '',
          mood: '',
          description: '',
          characteristics: { physical: [], emotional: [] },
          advice: { nutrition: [], activities: [], selfcare: [], avoid: [] },
          rituals: [],
          affirmation: '',
          symbol: '',
          element: '',
          archetype: ''
        },
        ovulatory: {
          id: 'ovulatory',
          name: 'Ovulatory',
          color: '#00BCD4',
          duration: '',
          energy: '',
          mood: '',
          description: '',
          characteristics: { physical: [], emotional: [] },
          advice: { nutrition: [], activities: [], selfcare: [], avoid: [] },
          rituals: [],
          affirmation: '',
          symbol: '',
          element: '',
          archetype: ''
        },
        luteal: {
          id: 'luteal',
          name: 'Luteal',
          color: '#673AB7',
          duration: '',
          energy: '',
          mood: '',
          description: '',
          characteristics: { physical: [], emotional: [] },
          advice: { nutrition: [], activities: [], selfcare: [], avoid: [] },
          rituals: [],
          affirmation: '',
          symbol: '',
          element: '',
          archetype: ''
        }
      };
      setPhases(defaultPhases);
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
