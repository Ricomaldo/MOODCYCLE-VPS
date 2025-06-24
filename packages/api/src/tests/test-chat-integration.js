const PromptBuilder = require('../services/PromptBuilder');

console.log('🚀 Test Intégration ChatController + PromptBuilder v2');
console.log('===================================================\n');

const promptBuilder = new PromptBuilder();

// === SIMULATION CHATCONTROLLER ===
console.log('📡 SIMULATION FLOW CHATCONTROLLER');
console.log('----------------------------------');

// Mock des données de test comme dans chatController
const testScenarios = [
  {
    name: "Emma - Fatigue lutéale",
    payload: {
      message: "Je me sens fatiguée",
      context: { 
        persona: 'emma', 
        currentPhase: 'luteal',
        preferences: { energie: 5, symptoms: 4 },
        userProfile: { prenom: 'Sarah', ageRange: '25-35' },
        conversationHistory: []
      }
    },
    expectedInsights: true,
    expectedNavigation: true
  },
  {
    name: "Laure - Urgence douleur",
    payload: {
      message: "J'ai une douleur insupportable !!! Aide-moi 😭",
      context: { 
        persona: 'laure', 
        currentPhase: 'menstrual',
        preferences: { symptoms: 5, moods: 3 },
        userProfile: { prenom: 'Anne', ageRange: '30-40' },
        conversationHistory: [
          { user: "Bonjour", melune: "Bonjour Anne ! Comment allez-vous ?" }
        ]
      }
    },
    expectedInsights: true,
    expectedNavigation: false // Urgence = focus réponse directe
  },
  {
    name: "Clara - Question cycle",
    payload: {
      message: "Pourquoi j'ai plus d'énergie en phase ovulatoire ?",
      context: { 
        persona: 'clara', 
        currentPhase: 'ovulatory',
        preferences: { phases: 5, tracking: 4 },
        userProfile: { prenom: 'Julie', ageRange: '25-35' },
        conversationHistory: []
      }
    },
    expectedInsights: true,
    expectedNavigation: true // Question = opportunité cycle
  }
];

// Test chaque scénario
testScenarios.forEach((scenario, index) => {
  console.log(`\n${index + 1}. ${scenario.name}`);
  console.log('=' .repeat(scenario.name.length + 3));
  
  const { message, context } = scenario.payload;
  
  // === ÉTAPE 1: Enrichissement contexte (comme chatController) ===
  const enrichedContext = {
    ...context,
    message,
    conversationHistory: context.conversationHistory || [],
    meluneTone: context.meluneTone || 'friendly',
    userProfile: context.userProfile || {},
    preferences: context.preferences || {}
  };
  
  console.log(`📝 Message: "${message}"`);
  console.log(`👤 Persona: ${context.persona} | Phase: ${context.currentPhase}`);
  
  // === ÉTAPE 2: Construction prompt enrichi ===
  const systemPrompt = promptBuilder.buildContextualPrompt(enrichedContext);
  
  console.log(`\n🎯 Prompt généré (${systemPrompt.length} chars)`);
  console.log('---');
  console.log(systemPrompt.substring(0, 200) + '...');
  console.log('---');
  
  // === ÉTAPE 3: Vérification insights sélectionnés ===
  const messageAnalysisForInsights = promptBuilder.analyzeMessage(message, context.conversationHistory);
  const selectedInsights = promptBuilder.selectInsights(
    context.persona,
    context.currentPhase,
    context.preferences,
    messageAnalysisForInsights
  );
  
  console.log(`\n🎯 Insights utilisés: ${selectedInsights.length}`);
  const hasInsights = selectedInsights.length > 0;
  console.log(`  • Insights trouvés: ${hasInsights ? '✅' : '❌'} (attendu: ${scenario.expectedInsights})`);
  
  selectedInsights.forEach((insight, i) => {
    const content = insight.personaVariants?.[context.persona] || insight.baseContent;
    console.log(`  ${i + 1}. ${insight.id}: "${content?.substring(0, 40)}..."`);
  });
  
  // === ÉTAPE 4: Détection navigation ===
  const messageAnalysis = promptBuilder.analyzeMessage(message, context.conversationHistory);
  const navigationOpportunities = promptBuilder.detectNavigationNeeds(messageAnalysis, context.currentPhase);
  
  console.log(`\n📱 Navigation détectée: ${navigationOpportunities.length}`);
  const hasNavigation = navigationOpportunities.length > 0;
  console.log(`  • Navigation suggérée: ${hasNavigation ? '✅' : '❌'} (attendu: ${scenario.expectedNavigation})`);
  
  navigationOpportunities.forEach((nav, i) => {
    console.log(`  ${i + 1}. Vers: ${nav.target} (${nav.reason})`);
  });
  
  // === ÉTAPE 5: Analyse mirroring ===
  const mirroringRules = promptBuilder.calculateMirroring(message, context.conversationHistory);
  console.log(`\n🔄 Mirroring détecté:`);
  console.log(`  • Style: ${mirroringRules.style}`);
  console.log(`  • Longueur: ${mirroringRules.minWords}-${mirroringRules.maxWords} mots`);
  if (mirroringRules.priority) {
    console.log(`  • Priorité: ${mirroringRules.priority}`);
  }
  
  // === ÉTAPE 6: Simulation métadonnées réponse ===
  console.log(`\n📊 Métadonnées simulées pour client:`);
  console.log(`  • navigationHint: ${navigationOpportunities[0]?.target || null}`);
  console.log(`  • hasInsights: ${selectedInsights.length > 0}`);
  console.log(`  • urgencyDetected: ${messageAnalysis.emotion.intensity > 0.7}`);
  
  // === VALIDATION SCÉNARIO ===
  const insightMatch = hasInsights === scenario.expectedInsights;
  const navMatch = hasNavigation === scenario.expectedNavigation;
  const scenarioValid = insightMatch && navMatch;
  
  console.log(`\n✅ Validation scénario: ${scenarioValid ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);
  if (!scenarioValid) {
    console.log(`  • Insights: attendu ${scenario.expectedInsights}, obtenu ${hasInsights}`);
    console.log(`  • Navigation: attendu ${scenario.expectedNavigation}, obtenu ${hasNavigation}`);
  }
});

// === TEST PERFORMANCE INTÉGRATION ===
console.log('\n⚡ TEST PERFORMANCE INTÉGRATION');
console.log('--------------------------------');

const performanceIntegrationTest = () => {
  const scenarios = [
    { persona: 'emma', phase: 'menstrual', message: 'Je me sens mal' },
    { persona: 'laure', phase: 'luteal', message: 'Comment optimiser cette phase ?' },
    { persona: 'clara', phase: 'ovulatory', message: 'Pourquoi tant d\'énergie ?' },
    { persona: 'sylvie', phase: 'follicular', message: 'Je renais doucement' },
    { persona: 'christine', phase: 'menstrual', message: 'Cette sagesse cyclique...' }
  ];
  
  const start = Date.now();
  
  scenarios.forEach(scenario => {
    // Simulation flow complet chatController
    const enrichedContext = {
      persona: scenario.persona,
      currentPhase: scenario.phase,
      message: scenario.message,
      preferences: { symptoms: 4, moods: 3 },
      conversationHistory: [],
      userProfile: { prenom: 'Test' }
    };
    
    // Étapes principales
    const systemPrompt = promptBuilder.buildContextualPrompt(enrichedContext);
    const messageAnalysis = promptBuilder.analyzeMessage(scenario.message, []);
    const insights = promptBuilder.selectInsights(scenario.persona, scenario.phase, enrichedContext.preferences, messageAnalysis);
    const navigation = promptBuilder.detectNavigationNeeds(messageAnalysis, scenario.phase);
  });
  
  const duration = Date.now() - start;
  console.log(`  • ${scenarios.length} flows complets en: ${duration}ms`);
  console.log(`  • Moyenne par flow: ${Math.round(duration/scenarios.length)}ms`);
  console.log(`  • Performance: ${duration < 100 ? '✅ Excellent' : duration < 300 ? '⚠️ Acceptable' : '❌ Lent'}`);
};

performanceIntegrationTest();

// === TEST COHÉRENCE PROMPT ===
console.log('\n🎭 TEST COHÉRENCE PROMPT');
console.log('------------------------');

const coherenceTest = () => {
  const testContext = {
    persona: 'emma',
    currentPhase: 'luteal',
    message: 'Je me sens émotionnelle',
    preferences: { moods: 5, symptoms: 3 },
    conversationHistory: [],
    userProfile: { prenom: 'Marie', ageRange: '25-35' }
  };
  
  const prompt = promptBuilder.buildContextualPrompt(testContext);
  
  // Vérifications cohérence
  const checks = [
    { name: 'Contient persona Emma', test: () => prompt.includes('emma') },
    { name: 'Contient phase lutéale', test: () => prompt.includes('luteal') || prompt.includes('lutéale') },
    { name: 'Contient prénom utilisatrice', test: () => prompt.includes('Marie') },
    { name: 'Contient règles de longueur', test: () => prompt.includes('mots') },
    { name: 'Contient insights validés', test: () => prompt.includes('INSIGHTS') || prompt.includes('insights') },
    { name: 'Structure correcte', test: () => prompt.includes('Tu es Melune') && prompt.includes('CONTEXTE') }
  ];
  
  console.log('Vérifications cohérence prompt:');
  checks.forEach(check => {
    const result = check.test();
    console.log(`  • ${check.name}: ${result ? '✅' : '❌'}`);
  });
  
  const coherenceScore = checks.filter(c => c.test()).length / checks.length;
  console.log(`\n📊 Score cohérence: ${Math.round(coherenceScore * 100)}%`);
};

coherenceTest();

console.log('\n🎉 Tests intégration terminés !');
console.log('==============================='); 