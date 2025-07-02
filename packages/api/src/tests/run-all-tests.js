// tests/run-all-tests.js
const { spawn } = require('child_process');
const path = require('path');
const MockAdminController = require('./test-admin-controller');

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
  console.log('🚀 Starting All Tests Suite...\n');
  
  let totalTests = 0;
  let passedTests = 0;
  
  // Test du contrôleur admin
  console.log('📋 Testing Admin Controller...');
  const adminController = new MockAdminController();
  const adminResults = await adminController.runAllTests();
  
  if (adminResults) {
    passedTests += 3; // 3 tests dans le contrôleur admin
  }
  totalTests += 3;
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test de validation des données
  console.log('📋 Testing Data Validation...');
  try {
    const fs = require('fs').promises;
    const insightsPath = path.join(__dirname, '../data/insights.json');
    const data = await fs.readFile(insightsPath, 'utf8');
    const insights = JSON.parse(data);
    
    let dataValid = true;
    const requiredFields = ['id', 'baseContent', 'tone', 'phase'];
    
    Object.values(insights).flat().forEach(insight => {
      requiredFields.forEach(field => {
        if (!insight[field]) {
          console.log(`❌ Missing required field: ${field} in insight ${insight.id}`);
          dataValid = false;
        }
      });
    });
    
    if (dataValid) {
      console.log('✅ Data validation passed');
      passedTests += 1;
    } else {
      console.log('❌ Data validation failed');
    }
    totalTests += 1;
    
  } catch (error) {
    console.log('❌ Data validation failed:', error.message);
    totalTests += 1;
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Résultats finaux
  console.log(`📊 Final Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed');
    process.exit(1);
  }
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
  runAllTests().catch(error => {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  });
} 