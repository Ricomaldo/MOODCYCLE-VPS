// Test du système adaptatif de Melune
const PromptBuilder = require('../services/PromptBuilder');

console.log('🚀 Test du système adaptatif PromptBuilder\n');

const promptBuilder = new PromptBuilder();

// Scénarios de test
const scenarios = [
  {
    name: "Premier contact - Emma - Message court",
    contextData: {
      persona: 'emma',
      userProfile: { prenom: 'Sarah', ageRange: '25-35' },
      currentPhase: 'folliculaire',
      preferences: { symptoms: 4, moods: 3 },
      conversationHistory: [],
      message: "Salut !"
    }
  },
  
  {
    name: "Urgence haute - Sylvie - Douleur",
    contextData: {
      persona: 'sylvie',
      userProfile: { prenom: 'Marie', ageRange: '35-45' },
      currentPhase: 'menstruelle',
      preferences: { symptoms: 5, phyto: 4 },
      conversationHistory: [
        { user: "Comment ça va ?", melune: "Coucou ! Je vais bien et toi ?" }
      ],
      message: "J'ai une douleur insupportable !!! Aide-moi 😭"
    }
  },
  
  {
    name: "Conversation établie - Clara - Message long",
    contextData: {
      persona: 'clara',
      userProfile: { prenom: 'Julie', ageRange: '25-35' },
      currentPhase: 'ovulatoire',
      preferences: { lithotherapy: 4, rituals: 5 },
      conversationHistory: [
        { user: "Salut Clara", melune: "Coucou Julie ! Comment vas-tu ?" },
        { user: "J'aimerais comprendre mon cycle", melune: "Excellente question ! Parlons de tes ressentis." },
        { user: "J'ai remarqué des changements", melune: "C'est tout à fait normal. Peux-tu me dire lesquels ?" }
      ],
      message: "Alors en fait j'ai remarqué que pendant ma phase ovulatoire, j'ai beaucoup plus d'énergie créative et j'arrive mieux à me concentrer sur mes projets. Est-ce que c'est lié aux hormones ? Et comment je peux optimiser cette période ?"
    }
  },
  
  {
    name: "Style concis établi - Laure",
    contextData: {
      persona: 'laure',
      userProfile: { prenom: 'Anne', ageRange: '30-40' },
      currentPhase: 'lutéale',
      preferences: { moods: 5, phases: 4 },
      conversationHistory: [
        { user: "Bonjour", melune: "Bonjour Anne ! Comment allez-vous ?" },
        { user: "Fatiguée", melune: "La phase lutéale peut être épuisante." },
        { user: "Solutions ?", melune: "Repos, magnésium, respiration." },
        { user: "Merci", melune: "De rien ! Autres questions ?" }
      ],
      message: "Compléments ?"
    }
  }
];

// Tests
scenarios.forEach((scenario, index) => {
  console.log(`\n--- TEST ${index + 1}: ${scenario.name} ---`);
  
  try {
    // Debug système adaptatif
    const debugInfo = promptBuilder.debugAdaptiveSystem(scenario.contextData);
    
    console.log(`📊 Analyse:`);
    console.log(`  • Style message: ${debugInfo.analysis.messageStyle}`);
    console.log(`  • Étape conversation: ${debugInfo.analysis.conversationStage}`);
    console.log(`  • Urgence: ${debugInfo.analysis.urgencyLevel}`);
    console.log(`  • Règles adaptées: ${debugInfo.adaptiveRules.wordCount}`);
    console.log(`  • Focus: ${debugInfo.adaptiveRules.focus}`);
    
    if (debugInfo.analysis.urgencyLevel !== 'low') {
      console.log(`  🚨 URGENCE: ${debugInfo.adaptiveRules.priority}`);
    }
    
    // Générer prompt
    const prompt = promptBuilder.buildContextualPrompt(scenario.contextData);
    
    console.log(`\n📝 Prompt généré (${prompt.length} chars):`);
    console.log(prompt.substring(0, 200) + '...');
    
    // Version compacte
    const compactPrompt = promptBuilder.buildCompactPrompt(scenario.contextData);
    console.log(`\n💾 Version compacte (${compactPrompt.length} chars):`);
    console.log(compactPrompt);
    
  } catch (error) {
    console.error(`❌ Erreur: ${error.message}`);
  }
});

console.log('\n✅ Tests terminés !');

// Test validation
console.log('\n--- TEST VALIDATION ---');
const validationTests = [
  {
    name: 'Contexte valide',
    data: { persona: 'emma', message: 'Hello', conversationHistory: [] }
  },
  {
    name: 'Persona invalide',
    data: { persona: 'invalid', message: 'Hello' }
  },
  {
    name: 'Message non-string',
    data: { persona: 'emma', message: 123 }
  },
  {
    name: 'Historique mal formaté',
    data: { persona: 'emma', conversationHistory: [{ user: 'hi' }] }
  }
];

validationTests.forEach(test => {
  const errors = promptBuilder.validateContext(test.data);
  console.log(`${test.name}: ${errors.length === 0 ? '✅' : '❌'} ${errors.join(', ')}`);
}); 