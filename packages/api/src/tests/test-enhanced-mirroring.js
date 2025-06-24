// tests/test-enhanced-mirroring.js
const PromptBuilder = require('../services/PromptBuilder');

console.log('🔄 Test Système Mirroring Amélioré - MoodCycle');
console.log('='.repeat(60));

const promptBuilder = new PromptBuilder();

// Scénarios de test
const testScenarios = [
  {
    name: "SMS Ultra Court",
    message: "ça va pas",
    conversationHistory: [],
    expectedStyle: "ultra_concise",
    expectedLength: "20-45", // Exception première interaction
    expectOverride: true
  },
  {
    name: "Message Court Normal",
    message: "Je me sens fatiguée aujourd'hui",
    conversationHistory: [
      { user: "Salut", melune: "Bonjour ma belle ! Comment te sens-tu aujourd'hui ?" }
    ],
    expectedStyle: "concise",
    expectedLength: "15-35",
    expectOverride: false
  },
  {
    name: "Urgence Émotionnelle - Style Court",
    message: "J'ai mal !!! 😭 Aide-moi",
    conversationHistory: [
      { user: "Salut", melune: "Bonjour !" }
    ],
    expectedStyle: "ultra_concise",
    expectedLength: "25-50", // Override urgence
    expectOverride: true
  },
  {
    name: "Demande Explication - Style Court",
    message: "Explique-moi les phases",
    conversationHistory: [
      { user: "Salut", melune: "Bonjour !" }
    ],
    expectedStyle: "concise",
    expectedLength: "40-80", // Override explication
    expectOverride: true
  },
  {
    name: "Message Équilibré Normal",
    message: "Je ressens quelques symptômes depuis hier et j'aimerais comprendre si c'est lié à mon cycle",
    conversationHistory: [
      { user: "Salut", melune: "Bonjour !" },
      { user: "Comment ça va ?", melune: "Très bien merci !" }
    ],
    expectedStyle: "balanced",
    expectedLength: "35-70",
    expectOverride: false
  },
  {
    name: "Question Santé - Style Court",
    message: "Douleur intense",
    conversationHistory: [
      { user: "Salut", melune: "Bonjour !" }
    ],
    expectedStyle: "ultra_concise",
    expectedLength: "35-70", // Override santé
    expectOverride: true
  },
  {
    name: "Message Développé Normal",
    message: "J'ai remarqué que pendant ma phase lutéale, j'ai tendance à avoir plus de fringales et des changements d'humeur. J'aimerais savoir si tu as des conseils pour mieux gérer cette période en utilisant des méthodes naturelles comme la phytothérapie ou la lithothérapie.",
    conversationHistory: [
      { user: "Précédent message long...", melune: "Réponse développée..." }
    ],
    expectedStyle: "very_detailed",
    expectedLength: "80-150",
    expectOverride: false
  }
];

// Fonction de test
function testMirroringScenario(scenario) {
  console.log(`\n📝 Test: ${scenario.name}`);
  console.log('-'.repeat(40));
  console.log(`Message (${scenario.message.length} chars): "${scenario.message}"`);
  
  const contextData = {
    persona: 'emma',
    message: scenario.message,
    conversationHistory: scenario.conversationHistory,
    userProfile: { prenom: 'Test', ageRange: '25-30' },
    currentPhase: 'luteal',
    preferences: { moods: 4, symptoms: 3 }
  };

  // Analyses individuelles
  const messageStyle = promptBuilder.analyzeUserMessageStyle(scenario.message, scenario.conversationHistory);
  const conversationStage = promptBuilder.getConversationStage(scenario.conversationHistory);
  const urgencyLevel = promptBuilder.detectUrgency(scenario.message);
  const lengthOverride = promptBuilder.shouldOverrideLength(
    scenario.message, 
    scenario.conversationHistory, 
    urgencyLevel, 
    messageStyle
  );

  // Règles adaptatives
  const adaptiveRules = promptBuilder.getAdaptiveResponseRules(
    'emma',
    messageStyle,
    conversationStage,
    urgencyLevel,
    scenario.message,
    scenario.conversationHistory
  );

  // Résultats
  console.log(`Style détecté: ${messageStyle} (attendu: ${scenario.expectedStyle})`);
  console.log(`Étape conversation: ${conversationStage}`);
  console.log(`Urgence: ${urgencyLevel}`);
  console.log(`Override: ${lengthOverride.override} (attendu: ${scenario.expectOverride})`);
  if (lengthOverride.override) {
    console.log(`Raison override: ${lengthOverride.reason}`);
  }
  console.log(`Longueur calculée: ${adaptiveRules.wordCount}`);
  console.log(`Ratio mirroring: ${adaptiveRules.mirrorRatio || 'N/A'}`);

  // Validation
  const styleMatch = messageStyle === scenario.expectedStyle;
  const overrideMatch = lengthOverride.override === scenario.expectOverride;
  
  console.log(`✅ Style: ${styleMatch ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Override: ${overrideMatch ? 'PASS' : 'FAIL'}`);
  
  if (lengthOverride.override) {
    console.log(`🔄 Exception active: ${lengthOverride.reason}`);
  } else {
    console.log(`🔄 Mirroring normal appliqué`);
  }

  return { styleMatch, overrideMatch };
}

// Exécuter tous les tests
console.log('\n🚀 Démarrage des tests...\n');

let totalTests = 0;
let passedTests = 0;

testScenarios.forEach(scenario => {
  const results = testMirroringScenario(scenario);
  totalTests += 2; // style + override
  if (results.styleMatch) passedTests++;
  if (results.overrideMatch) passedTests++;
});

// Résultats finaux
console.log('\n' + '='.repeat(60));
console.log(`📊 RÉSULTATS: ${passedTests}/${totalTests} tests réussis`);
console.log(`✅ Taux de réussite: ${Math.round((passedTests/totalTests) * 100)}%`);

if (passedTests === totalTests) {
  console.log('🎉 Tous les tests passent ! Système de mirroring amélioré opérationnel.');
} else {
  console.log('⚠️ Certains tests échouent. Vérifier la logique d\'adaptation.');
}

// Test prompt complet pour un cas
console.log('\n🎭 Test Prompt Complet (Première interaction):');
console.log('-'.repeat(60));

const fullPrompt = promptBuilder.buildContextualPrompt({
  persona: 'emma',
  message: "Salut !",
  conversationHistory: [],
  userProfile: { prenom: 'Lisa', ageRange: '25-30' },
  currentPhase: 'luteal',
  preferences: { moods: 4, symptoms: 3 }
});

console.log(fullPrompt);
console.log('-'.repeat(60)); 