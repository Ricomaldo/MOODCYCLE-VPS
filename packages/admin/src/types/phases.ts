export interface EditableContent {
  description: string;
  advice: {
    nutrition: string[];
    activities: string[];
    selfcare: string[];
    avoid: string[];
  };
  rituals: string[];
  affirmation: string;
}

export interface Phase {
  id: string;
  name: string;
  slug: string;
  color: string;
  duration: string;
  energy: string;
  mood: string;
  editableContent: EditableContent;
  characteristics: {
    physical: string[];
    emotional: string[];
    energy: string;
  };
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

export interface PhasesData {
  [phaseId: string]: Phase;
} 