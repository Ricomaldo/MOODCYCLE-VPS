// tests/context-examples.js - Exemples de contextes pour tests

const testContexts = {
    // Test Emma - Novice curieuse
    emma: {
      persona: 'emma',
      userProfile: {
        prenom: 'Marie',
        ageRange: '18-25'
      },
      currentPhase: 'follicular',
      preferences: {
        symptoms: 2,
        moods: 4, // Fort
        phyto: 1,
        phases: 3,
        lithotherapy: 1,
        rituals: 2
      },
      communicationTone: 'friendly'
    },
  
    // Test Laure - Professionnelle
    laure: {
      persona: 'laure',
      userProfile: {
        prenom: 'Laure',
        ageRange: '26-35'
      },
      currentPhase: 'luteal',
      preferences: {
        symptoms: 3,
        moods: 4,
        phyto: 2,
        phases: 5, // Très fort
        lithotherapy: 1,
        rituals: 4  // Fort
      },
      communicationTone: 'professional'
    },
  
    // Test minimal (fallback)
    minimal: {
      persona: 'emma',
      currentPhase: 'menstrual'
    },
  
    // Test invalide
    invalid: {
      persona: 'invalid_persona',
      preferences: {
        invalid_key: 5
      }
    }
  };
  
  // Messages de test
  const testMessages = [
    "Bonjour Melune, comment gérer ma fatigue ?",
    "J'ai des crampes, que faire ?",
    "Explique-moi mon cycle",
    "Je me sens émotionnelle"
  ];
  
  module.exports = { testContexts, testMessages };