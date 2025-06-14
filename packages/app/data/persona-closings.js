// 🎯 CLOSINGS PERSONNALISÉS par Persona × Journey
// Structure: persona → journey → closing personnalisé

export const PERSONA_CLOSINGS = {
  emma: {
    body: "Je t'accompagne dans cette reconnexion avec ton corps",
    nature: "Je t'aide à célébrer ta nature cyclique authentique", 
    emotions: "Je te guide vers une relation apaisée avec tes émotions"
  },
  
  laure: {
    body: "Optimise cette connexion corps-esprit pour ta performance",
    nature: "Transforme tes cycles en avantage stratégique personnel",
    emotions: "Développe ton intelligence émotionnelle comme un atout"
  },
  
  sylvie: {
    body: "Accueille avec douceur cette sagesse corporelle",
    nature: "Embrasse la beauté de tes rythmes naturels féminins", 
    emotions: "Transforme tes émotions en force créatrice"
  },
  
  christine: {
    body: "Laisse ton corps te guider vers ta vérité intérieure",
    nature: "Honore cette sagesse ancestrale qui vit en toi",
    emotions: "Cultive cette maturité émotionnelle qui t'habite"
  },
  
  clara: {
    body: "Analyse ces signaux pour mieux comprendre ton fonctionnement",
    nature: "Observe la logique fascinante de tes cycles biologiques",
    emotions: "Décrypte ces patterns pour maîtriser tes réactions"
  }
};

// 🎯 MAPPING Journey Options vers Journey Keys
export const JOURNEY_KEYS = {
  'body': 'body',
  'nature': 'nature', 
  'emotions': 'emotions'
};

// 🎯 FONCTION : Obtenir closing personnalisé
export const getPersonalizedClosing = (persona, journeyChoice) => {
  // Vérifier que le persona existe
  if (!PERSONA_CLOSINGS[persona]) {
    return "Continue ton chemin avec confiance"; // Fallback générique
  }
  
  // Mapper le journey choice vers la clé
  const journeyKey = JOURNEY_KEYS[journeyChoice] || 'body'; // Fallback vers 'body'
  
  // Retourner le closing personnalisé
  return PERSONA_CLOSINGS[persona][journeyKey] || PERSONA_CLOSINGS[persona].body;
};

// 🎯 FONCTION DEBUG : Lister tous les closings
export const getAllClosings = () => {
  const result = [];
  
  Object.entries(PERSONA_CLOSINGS).forEach(([persona, journeys]) => {
    Object.entries(journeys).forEach(([journey, closing]) => {
      result.push({
        persona,
        journey, 
        closing,
        example: `Emma rayonne aujourd'hui${closing}`
      });
    });
  });
  
  return result;
}; 