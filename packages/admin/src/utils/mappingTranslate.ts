// Mapping des phases du cycle menstruel
export const phaseMapping: Record<string, string> = {
  menstrual: "Phase menstruelle",
  follicular: "Phase folliculaire", 
  ovulatory: "Phase ovulatoire",
  luteal: "Phase lutéale"
};

// Mapping des tons de communication
export const toneMapping: Record<string, string> = {
  friendly: "Amical",
  professional: "Professionnel",
  inspiring: "Inspirant"
};

// Mapping des parcours thérapeutiques
export const journeyMapping: Record<string, string> = {
  body_disconnect: "Incarnation",
  hiding_nature: "Déploiement", 
  emotional_control: "Apaisement"
};

// Fonction utilitaire pour obtenir la traduction d'une phase
export const getPhaseLabel = (phase: string): string => {
  return phaseMapping[phase.toLowerCase()] || phase;
};

// Fonction utilitaire pour obtenir la traduction d'un ton
export const getToneLabel = (tone: string): string => {
  return toneMapping[tone.toLowerCase()] || tone;
};

// Fonction utilitaire pour obtenir la traduction d'un parcours
export const getJourneyLabel = (journey: string): string => {
  return journeyMapping[journey] || journey;
}; 