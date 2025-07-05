#!/usr/bin/env node

/**
 * Test complet des logs Analytics MoodCycle
 * Teste les endpoints et vérifie les logs générés
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const BASE_URL = 'https://moodcycle.irimwebforge.com';
const DEVICE_ID = 'test-logs-device';
const LOG_DIR = '/srv/www/internal/moodcycle-api/logs';

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

console.log(`${colors.cyan}🧪 Test Analytics Logs MoodCycle${colors.reset}`);
console.log('==========================================');

// Endpoints à tester
const ENDPOINTS = [
  { path: '/api/analytics/health', name: 'Health Check' },
  { path: '/api/analytics/overview', name: 'Overview' },
  { path: '/api/analytics/behavior', name: 'Behavior Analytics' },
  { path: '/api/analytics/device', name: 'Device Analytics' },
  { path: '/api/analytics/performance', name: 'Performance Analytics' },
  { path: '/api/analytics/patterns', name: 'Usage Patterns' },
  { path: '/api/analytics/crashes', name: 'Crash Analytics' },
  { path: '/api/analytics/dashboard', name: 'Dashboard' },
  { path: '/api/analytics/recommendations', name: 'Recommendations' }
];

/**
 * Tester un endpoint
 */
async function testEndpoint(endpoint) {
  console.log(`${colors.blue}🔍 Test ${endpoint.name}${colors.reset}`);
  
  try {
    const startTime = Date.now();
    
    const response = await axios.get(`${BASE_URL}${endpoint.path}`, {
      headers: {
        'X-Device-ID': DEVICE_ID,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    const responseTime = Date.now() - startTime;
    
    if (response.status === 200) {
      console.log(`   ✅ Status: ${response.status}`);
      console.log(`   ⏱️  Response time: ${responseTime}ms`);
      
      if (response.data && response.data.success) {
        console.log(`   📊 Success: ${response.data.success}`);
        
        if (response.data.data) {
          const dataSize = JSON.stringify(response.data.data).length;
          console.log(`   📦 Data size: ${dataSize} bytes`);
        }
      } else {
        console.log(`   ⚠️  Invalid response format`);
      }
    } else {
      console.log(`   ❌ Status: ${response.status}`);
    }
    
    return {
      success: true,
      status: response.status,
      responseTime,
      dataSize: response.data ? JSON.stringify(response.data).length : 0
    };
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    
    if (error.response) {
      console.log(`   📄 Response: ${error.response.status} - ${error.response.statusText}`);
    }
    
    return {
      success: false,
      error: error.message,
      status: error.response?.status || 'TIMEOUT'
    };
  }
}

/**
 * Lire les logs analytics
 */
async function readAnalyticsLogs() {
  console.log(`${colors.magenta}📋 Lecture des logs analytics${colors.reset}`);
  
  const logFiles = [
    { name: 'Analytics General', path: path.join(LOG_DIR, 'analytics.log') },
    { name: 'Analytics Errors', path: path.join(LOG_DIR, 'analytics-errors.log') },
    { name: 'Analytics Performance', path: path.join(LOG_DIR, 'analytics-performance.log') }
  ];
  
  for (const logFile of logFiles) {
    try {
      const stats = await fs.stat(logFile.path);
      const content = await fs.readFile(logFile.path, 'utf8');
      const lines = content.split('\n').filter(line => line.trim());
      
      console.log(`${colors.yellow}📄 ${logFile.name}${colors.reset}`);
      console.log(`   📊 Size: ${stats.size} bytes`);
      console.log(`   📝 Lines: ${lines.length}`);
      console.log(`   🕐 Last modified: ${stats.mtime.toLocaleString('fr-FR')}`);
      
      // Afficher les dernières lignes
      if (lines.length > 0) {
        console.log(`   📋 Dernières entrées:`);
        const lastLines = lines.slice(-3);
        lastLines.forEach(line => {
          try {
            const parsed = JSON.parse(line);
            console.log(`      ${parsed.timestamp} - ${parsed.level} - ${parsed.message}`);
          } catch (e) {
            console.log(`      ${line.substring(0, 100)}...`);
          }
        });
      }
      
    } catch (error) {
      console.log(`   ❌ Erreur lecture ${logFile.name}: ${error.message}`);
    }
    
    console.log('');
  }
}

/**
 * Analyser les logs pour les requêtes de test
 */
async function analyzeTestLogs() {
  console.log(`${colors.cyan}🔍 Analyse des logs de test${colors.reset}`);
  
  try {
    const analyticsLogPath = path.join(LOG_DIR, 'analytics.log');
    const content = await fs.readFile(analyticsLogPath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim());
    
    // Filtrer les logs de notre test
    const testLogs = lines.filter(line => {
      try {
        const parsed = JSON.parse(line);
        return parsed.deviceId === DEVICE_ID || 
               (parsed.userAgent && parsed.userAgent.includes('axios'));
      } catch (e) {
        return false;
      }
    });
    
    console.log(`📊 Logs de test trouvés: ${testLogs.length}`);
    
    if (testLogs.length > 0) {
      console.log(`📋 Détails des requêtes de test:`);
      
      testLogs.forEach((line, index) => {
        try {
          const parsed = JSON.parse(line);
          console.log(`   ${index + 1}. ${parsed.method} ${parsed.url}`);
          console.log(`      Status: ${parsed.statusCode}, Time: ${parsed.responseTime}`);
          console.log(`      Success: ${parsed.success}`);
        } catch (e) {
          console.log(`   ${index + 1}. ${line.substring(0, 100)}...`);
        }
      });
    }
    
  } catch (error) {
    console.log(`❌ Erreur analyse logs: ${error.message}`);
  }
}

/**
 * Tester l'endpoint de stats de logs
 */
async function testLogStats() {
  console.log(`${colors.green}📊 Test stats de logs${colors.reset}`);
  
  try {
    const response = await axios.get(`${BASE_URL}/api/logs/analytics/stats`, {
      headers: {
        'X-Device-ID': DEVICE_ID
      },
      timeout: 5000
    });
    
    if (response.status === 200 && response.data.success) {
      console.log(`✅ Stats récupérées avec succès`);
      console.log(`📊 Statistiques:`);
      
      const stats = response.data.data;
      Object.entries(stats).forEach(([key, value]) => {
        console.log(`   ${key}:`);
        console.log(`     Size: ${value.size} bytes`);
        console.log(`     Lines: ${value.lines}`);
        if (value.lastModified) {
          console.log(`     Last modified: ${new Date(value.lastModified).toLocaleString('fr-FR')}`);
        }
      });
    } else {
      console.log(`❌ Erreur récupération stats`);
    }
    
  } catch (error) {
    console.log(`❌ Erreur test stats: ${error.message}`);
  }
}

/**
 * Générer un rapport de test
 */
async function generateTestReport(results) {
  const reportPath = `/tmp/analytics-logs-test-report-${Date.now()}.json`;
  
  const report = {
    timestamp: new Date().toISOString(),
    testConfig: {
      baseUrl: BASE_URL,
      deviceId: DEVICE_ID,
      endpointsTested: ENDPOINTS.length
    },
    results: results,
    summary: {
      totalTests: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      averageResponseTime: results
        .filter(r => r.responseTime)
        .reduce((sum, r) => sum + r.responseTime, 0) / results.filter(r => r.responseTime).length || 0
    }
  };
  
  try {
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    console.log(`${colors.green}📄 Rapport généré: ${reportPath}${colors.reset}`);
  } catch (error) {
    console.log(`❌ Erreur génération rapport: ${error.message}`);
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log(`🚀 Démarrage des tests...`);
  console.log(`🎯 Base URL: ${BASE_URL}`);
  console.log(`🆔 Device ID: ${DEVICE_ID}`);
  console.log('');
  
  // 1. Tester tous les endpoints
  console.log(`${colors.blue}=== PHASE 1: Test des endpoints ===${colors.reset}`);
  const results = [];
  
  for (const endpoint of ENDPOINTS) {
    const result = await testEndpoint(endpoint);
    results.push({ endpoint: endpoint.path, name: endpoint.name, ...result });
    console.log('');
    
    // Pause entre les requêtes
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // 2. Attendre que les logs soient écrits
  console.log(`${colors.yellow}⏳ Attente écriture logs (5s)...${colors.reset}`);
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // 3. Lire les logs
  console.log(`${colors.magenta}=== PHASE 2: Lecture des logs ===${colors.reset}`);
  await readAnalyticsLogs();
  
  // 4. Analyser les logs de test
  console.log(`${colors.cyan}=== PHASE 3: Analyse des logs de test ===${colors.reset}`);
  await analyzeTestLogs();
  
  // 5. Tester les stats de logs
  console.log(`${colors.green}=== PHASE 4: Test stats de logs ===${colors.reset}`);
  await testLogStats();
  
  // 6. Générer le rapport
  console.log(`${colors.yellow}=== PHASE 5: Génération rapport ===${colors.reset}`);
  await generateTestReport(results);
  
  // 7. Résumé final
  console.log(`${colors.cyan}=== RÉSUMÉ FINAL ===${colors.reset}`);
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Tests réussis: ${successful}/${results.length}`);
  console.log(`❌ Tests échoués: ${failed}/${results.length}`);
  
  if (failed > 0) {
    console.log(`${colors.red}⚠️  Échecs détectés - vérifiez les logs${colors.reset}`);
    process.exit(1);
  } else {
    console.log(`${colors.green}🎉 Tous les tests sont passés!${colors.reset}`);
    process.exit(0);
  }
}

// Exécuter les tests
main().catch(error => {
  console.error(`${colors.red}💥 Erreur fatale: ${error.message}${colors.reset}`);
  process.exit(1);
}); 