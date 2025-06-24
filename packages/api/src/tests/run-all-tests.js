// tests/run-all-tests.js
const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 MoodCycle - Suite de Tests Complète');
console.log('=====================================\n');

const tests = [
  {
    name: '1. Tests Unitaires PromptBuilder v2',
    file: 'test-promptbuilder-v2.js',
    description: 'Sélection insights, mirroring, analyse messages'
  },
  {
    name: '2. Tests Intégration ChatController',
    file: 'test-chat-integration.js', 
    description: 'Flow complet avec enrichissement contexte'
  },
  {
    name: '3. Tests Système Adaptatif (existant)',
    file: 'test-adaptive-system.js',
    description: 'Debug système adaptatif et validation contexte'
  },
  {
    name: '4. Tests Mirroring Avancé (existant)',
    file: 'test-enhanced-mirroring.js',
    description: 'Système mirroring avec cas d\'usage variés'
  }
];

async function runTest(testFile, testName) {
  return new Promise((resolve, reject) => {
    console.log(`\n🚀 Lancement: ${testName}`);
    console.log('='.repeat(testName.length + 12));
    
    const testPath = path.join(__dirname, testFile);
    const child = spawn('node', [testPath], {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log(`\n✅ ${testName} - SUCCÈS`);
        resolve(true);
      } else {
        console.log(`\n❌ ${testName} - ÉCHEC (code: ${code})`);
        resolve(false);
      }
    });
    
    child.on('error', (error) => {
      console.error(`\n💥 Erreur ${testName}:`, error.message);
      resolve(false);
    });
  });
}

async function runAllTests() {
  console.log('📋 Tests programmés:');
  tests.forEach((test, index) => {
    console.log(`  ${index + 1}. ${test.name}`);
    console.log(`     ${test.description}`);
  });
  
  console.log('\n⏱️  Démarrage des tests...\n');
  
  const results = [];
  const startTime = Date.now();
  
  for (const test of tests) {
    const success = await runTest(test.file, test.name);
    results.push({ name: test.name, success });
    
    // Pause entre tests pour lisibilité
    if (test !== tests[tests.length - 1]) {
      console.log('\n⏸️  Pause 2s avant test suivant...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  const totalTime = Date.now() - startTime;
  
  // === RAPPORT FINAL ===
  console.log('\n' + '='.repeat(50));
  console.log('📊 RAPPORT FINAL DES TESTS');
  console.log('='.repeat(50));
  
  const successCount = results.filter(r => r.success).length;
  const failCount = results.length - successCount;
  
  console.log(`\n🎯 Résultats:`);
  results.forEach((result, index) => {
    const status = result.success ? '✅ SUCCÈS' : '❌ ÉCHEC';
    console.log(`  ${index + 1}. ${status} - ${result.name}`);
  });
  
  console.log(`\n📈 Statistiques:`);
  console.log(`  • Tests exécutés: ${results.length}`);
  console.log(`  • Succès: ${successCount}`);
  console.log(`  • Échecs: ${failCount}`);
  console.log(`  • Taux de réussite: ${Math.round((successCount/results.length)*100)}%`);
  console.log(`  • Temps total: ${Math.round(totalTime/1000)}s`);
  
  const overallSuccess = failCount === 0;
  console.log(`\n🏆 Résultat global: ${overallSuccess ? '✅ TOUS LES TESTS PASSENT' : '❌ CERTAINS TESTS ÉCHOUENT'}`);
  
  if (overallSuccess) {
    console.log('\n🎉 Félicitations ! Votre implémentation PromptBuilder v2 est validée.');
    console.log('💡 Prêt pour déploiement avec insights Jeza intégrés.');
  } else {
    console.log('\n🔧 Vérifiez les tests en échec avant déploiement.');
    console.log('💡 Focus sur la sélection d\'insights et l\'intégration navigation.');
  }
  
  console.log('\n' + '='.repeat(50));
  
  // Code de sortie pour CI/CD
  process.exit(overallSuccess ? 0 : 1);
}

// === GESTION DES ARGUMENTS ===
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log('Usage:');
  console.log('  node run-all-tests.js           # Lancer tous les tests');
  console.log('  node run-all-tests.js --unit    # Tests unitaires uniquement');
  console.log('  node run-all-tests.js --integration # Tests intégration uniquement');
  console.log('  node run-all-tests.js --quick   # Tests rapides (skip performance)');
  process.exit(0);
}

if (args.includes('--unit')) {
  // Tests unitaires uniquement
  runTest('test-promptbuilder-v2.js', 'Tests Unitaires PromptBuilder v2')
    .then(success => process.exit(success ? 0 : 1));
} else if (args.includes('--integration')) {
  // Tests intégration uniquement
  runTest('test-chat-integration.js', 'Tests Intégration ChatController')
    .then(success => process.exit(success ? 0 : 1));
} else {
  // Tous les tests
  runAllTests();
} 