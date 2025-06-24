// tests/test-promptbuilder-v2.js
const PromptBuilder = require('../services/PromptBuilder');

console.log('🧪 Tests PromptBuilder v2 - MoodCycle');
console.log('=====================================\n');

const promptBuilder = new PromptBuilder();

// === 1. TESTS UNITAIRES ===
console.log('📋 1. TESTS UNITAIRES');
console.log('---------------------');

// Test 1: Sélection insights avec fallback baseContent
describe('selectInsights avec fallback baseContent', () => {
  const mockPrefs = { symptoms: 5, moods: 4 };
  const mockMessage = "Je me sens fatiguée";
  
  console.log('🔍 Test: Sélection insights Emma - Phase menstruelle');
  
  // Analyser message d'abord
  const messageAnalysis = promptBuilder.analyzeMessage(mockMessage, []);
  const insights = promptBuilder.selectInsights('emma', 'menstrual', mockPrefs, messageAnalysis);
  
  console.log(`  • Insights trouvés: ${insights.length}`);
  
  // Vérifier que chaque insight a soit une variante Emma soit baseContent
  const hasValidContent = insights.every(insight => {
    const hasPersonaVariant = insight.personaVariants?.emma;
    const hasBaseContent = insight.baseContent;
    return hasPersonaVariant || hasBaseContent;
  });
  
  console.log(`  • Tous ont contenu valide: ${hasValidContent ? '✅' : '❌'}`);
  
  // Afficher détails pour debug
  insights.forEach((insight, index) => {
    const content = insight.personaVariants?.emma || insight.baseContent || 'MANQUANT';
    console.log(`  • Insight ${index + 1}: ${insight.id || 'no-id'}`);
    console.log(`    Content: ${content.substring(0, 50)}...`);
  });
});

// Test 2: Mirroring adapte longueur selon style user
describe('calculateMirroring adapte style utilisateur', () => {
  console.log('\n🔄 Test: Mirroring style concis');
  
  const mockHistory = [
    { user: "ok", melune: "Bonjour ! Comment allez-vous ?" },
    { user: "bien", melune: "Parfait ! Que puis-je faire pour vous ?" },
    { user: "aide", melune: "Bien sûr ! Dites-moi ce qui vous préoccupe." }
  ];
  
  const rules = promptBuilder.calculateMirroring("ok", mockHistory);
  
  console.log(`  • Style détecté: ${rules.style}`);
  console.log(`  • Mots min: ${rules.minWords}`);
  console.log(`  • Mots max: ${rules.maxWords}`);
  console.log(`  • Style concis détecté: ${rules.minWords <= 25 ? '✅' : '❌'}`);
});

// Test 3: Analyse message détecte urgence
describe('analyzeMessage détecte urgence', () => {
  console.log('\n🚨 Test: Détection urgence');
  
  const urgentMessage = "J'ai une douleur insupportable !!! Aide-moi 😭";
  const normalMessage = "Comment ça va aujourd'hui ?";
  
  const urgentAnalysis = promptBuilder.analyzeMessage(urgentMessage, []);
  const normalAnalysis = promptBuilder.analyzeMessage(normalMessage, []);
  
  console.log(`  • Message urgent - Intensité: ${urgentAnalysis.emotion.intensity}`);
  console.log(`  • Message normal - Intensité: ${normalAnalysis.emotion.intensity}`);
  console.log(`  • Urgence détectée: ${urgentAnalysis.emotion.intensity > 0.7 ? '✅' : '❌'}`);
});

// === 2. TEST INTÉGRATION CHATCONTROLLER ===
console.log('\n📡 2. TEST INTÉGRATION');
console.log('----------------------');

// Mock payload de test
const testPayload = {
  message: "Je me sens fatiguée",
  context: { 
    persona: 'emma', 
    currentPhase: 'luteal',
    preferences: { energie: 5, symptoms: 4 },
    userProfile: { prenom: 'Sarah', ageRange: '25-35' }
  }
};

console.log('🎯 Test: Construction prompt complet');
console.log(`  • Message: "${testPayload.message}"`);
console.log(`  • Persona: ${testPayload.context.persona}`);
console.log(`  • Phase: ${testPayload.context.currentPhase}`);

// Construction prompt enrichi
const enrichedPrompt = promptBuilder.buildContextualPrompt({
  ...testPayload.context,
  message: testPayload.message,
  conversationHistory: []
});

console.log(`\n📝 Prompt généré (${enrichedPrompt.length} caractères):`);
console.log('---');
console.log(enrichedPrompt.substring(0, 300) + '...');
console.log('---');

// Vérification des insights utilisés
const messageAnalysisForInsights = promptBuilder.analyzeMessage(testPayload.message, []);
const selectedInsights = promptBuilder.selectInsights(
  testPayload.context.persona,
  testPayload.context.currentPhase,
  testPayload.context.preferences,
  messageAnalysisForInsights
);

console.log(`\n🎯 Insights utilisés (${selectedInsights.length}):`);
selectedInsights.forEach((insight, index) => {
  console.log(`  ${index + 1}. ${insight.id || 'no-id'}`);
  const content = insight.personaVariants?.emma || insight.baseContent || 'MANQUANT';
  console.log(`     "${content.substring(0, 60)}..."`);
});

// Détection navigation
const messageAnalysis = promptBuilder.analyzeMessage(testPayload.message, []);
const navigationHints = promptBuilder.detectNavigationNeeds(messageAnalysis, testPayload.context.currentPhase);

console.log(`\n📱 Navigation suggérée (${navigationHints.length}):`);
navigationHints.forEach((hint, index) => {
  console.log(`  ${index + 1}. Vers: ${hint.target}`);
  console.log(`     Raison: ${hint.reason}`);
});

// === 3. TESTS VALIDATION ===
console.log('\n✅ 3. TESTS VALIDATION');
console.log('----------------------');

// Test validation contexte
const validationTests = [
  {
    name: 'Contexte valide complet',
    data: { 
      persona: 'emma', 
      message: 'Hello', 
      conversationHistory: [],
      currentPhase: 'menstrual',
      preferences: { symptoms: 4 }
    },
    expectedValid: true
  },
  {
    name: 'Persona invalide',
    data: { 
      persona: 'invalid', 
      message: 'Hello',
      currentPhase: 'menstrual'
    },
    expectedValid: false
  },
  {
    name: 'Phase invalide',
    data: { 
      persona: 'emma', 
      message: 'Hello',
      currentPhase: 'invalid_phase'
    },
    expectedValid: false
  }
];

validationTests.forEach(test => {
  try {
    const prompt = promptBuilder.buildContextualPrompt(test.data);
    const isValid = prompt.length > 100; // Prompt minimal généré
    const result = isValid === test.expectedValid;
    console.log(`  ${test.name}: ${result ? '✅' : '❌'}`);
    if (!result) {
      console.log(`    Attendu: ${test.expectedValid}, Obtenu: ${isValid}`);
    }
  } catch (error) {
    const result = !test.expectedValid; // Erreur attendue pour cas invalides
    console.log(`  ${test.name}: ${result ? '✅' : '❌'} (Exception: ${error.message})`);
  }
});

// === 4. TEST PERFORMANCE ===
console.log('\n⚡ 4. TEST PERFORMANCE');
console.log('---------------------');

const performanceTest = () => {
  const start = Date.now();
  
  // Générer 10 prompts différents
  for (let i = 0; i < 10; i++) {
    const personas = ['emma', 'laure', 'clara', 'sylvie', 'christine'];
    const phases = ['menstrual', 'follicular', 'ovulatory', 'luteal'];
    
    promptBuilder.buildContextualPrompt({
      persona: personas[i % personas.length],
      currentPhase: phases[i % phases.length],
      message: `Test message ${i}`,
      preferences: { symptoms: Math.floor(Math.random() * 5) + 1 },
      conversationHistory: []
    });
  }
  
  const duration = Date.now() - start;
  console.log(`  • 10 prompts générés en: ${duration}ms`);
  console.log(`  • Moyenne par prompt: ${duration/10}ms`);
  console.log(`  • Performance: ${duration < 100 ? '✅ Excellent' : duration < 500 ? '⚠️ Acceptable' : '❌ Lent'}`);
};

performanceTest();

// === 5. TEST CACHE ===
console.log('\n💾 5. TEST CACHE INSIGHTS');
console.log('-------------------------');

const cacheTest = () => {
  const mockAnalysis = promptBuilder.analyzeMessage("test message", []);
  
  // Premier appel (miss cache)
  const start1 = Date.now();
  const insights1 = promptBuilder.selectInsights('emma', 'menstrual', { symptoms: 5 }, mockAnalysis);
  const time1 = Date.now() - start1;
  
  // Deuxième appel (hit cache)
  const start2 = Date.now();
  const insights2 = promptBuilder.selectInsights('emma', 'menstrual', { symptoms: 5 }, mockAnalysis);
  const time2 = Date.now() - start2;
  
  console.log(`  • Premier appel (cache miss): ${time1}ms`);
  console.log(`  • Deuxième appel (cache hit): ${time2}ms`);
  console.log(`  • Amélioration cache: ${time1 > time2 ? '✅' : '❌'} (${Math.round((time1-time2)/time1*100)}%)`);
  console.log(`  • Résultats identiques: ${JSON.stringify(insights1) === JSON.stringify(insights2) ? '✅' : '❌'}`);
};

cacheTest();

console.log('\n🎉 Tests PromptBuilder v2 terminés !');
console.log('====================================');

// Helper function pour simuler describe (comme Jest)
function describe(name, testFn) {
  console.log(`\n📋 ${name}:`);
  testFn();
} 