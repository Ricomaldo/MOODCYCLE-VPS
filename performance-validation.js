#!/usr/bin/env node

/**
 * Validation Performance Système Analytics MoodCycle
 * Tests de charge, performance, stabilité et fiabilité
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { performance } = require('perf_hooks');

// Configuration
const BASE_URL = 'https://moodcycle.irimwebforge.com';
const DEVICE_ID = 'perf-test-device';
const CONCURRENT_USERS = 5;
const REQUESTS_PER_USER = 10;
const STRESS_DURATION = 60000; // 1 minute

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

console.log(`${colors.cyan}🚀 Validation Performance Système Analytics MoodCycle${colors.reset}`);
console.log('=======================================================');

// Endpoints à tester avec leurs seuils de performance
const ENDPOINTS = [
  { 
    path: '/api/analytics/health', 
    name: 'Health Check',
    maxResponseTime: 200,
    priority: 'critical'
  },
  { 
    path: '/api/analytics/overview', 
    name: 'Overview',
    maxResponseTime: 500,
    priority: 'high'
  },
  { 
    path: '/api/analytics/behavior', 
    name: 'Behavior Analytics',
    maxResponseTime: 1000,
    priority: 'high'
  },
  { 
    path: '/api/analytics/device', 
    name: 'Device Analytics',
    maxResponseTime: 1000,
    priority: 'medium'
  },
  { 
    path: '/api/analytics/performance', 
    name: 'Performance Analytics',
    maxResponseTime: 1500,
    priority: 'medium'
  },
  { 
    path: '/api/analytics/patterns', 
    name: 'Usage Patterns',
    maxResponseTime: 1200,
    priority: 'medium'
  },
  { 
    path: '/api/analytics/crashes', 
    name: 'Crash Analytics',
    maxResponseTime: 800,
    priority: 'low'
  },
  { 
    path: '/api/analytics/dashboard', 
    name: 'Dashboard',
    maxResponseTime: 2000,
    priority: 'high'
  },
  { 
    path: '/api/analytics/recommendations', 
    name: 'Recommendations',
    maxResponseTime: 1000,
    priority: 'medium'
  }
];

// Métriques globales
const metrics = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  totalResponseTime: 0,
  minResponseTime: Infinity,
  maxResponseTime: 0,
  responseTimes: [],
  errorsByEndpoint: {},
  performanceByEndpoint: {},
  memoryUsage: [],
  concurrentUsers: 0
};

/**
 * Effectuer une requête et mesurer les performances
 */
async function performRequest(endpoint, userId = 'default') {
  const startTime = performance.now();
  const startMemory = process.memoryUsage();
  
  try {
    const response = await axios.get(`${BASE_URL}${endpoint.path}`, {
      headers: {
        'X-Device-ID': `${DEVICE_ID}-${userId}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    const endMemory = process.memoryUsage();
    
    // Collecter les métriques
    metrics.totalRequests++;
    metrics.totalResponseTime += responseTime;
    metrics.responseTimes.push(responseTime);
    
    if (responseTime < metrics.minResponseTime) {
      metrics.minResponseTime = responseTime;
    }
    
    if (responseTime > metrics.maxResponseTime) {
      metrics.maxResponseTime = responseTime;
    }
    
    // Métriques par endpoint
    if (!metrics.performanceByEndpoint[endpoint.path]) {
      metrics.performanceByEndpoint[endpoint.path] = {
        requests: 0,
        totalTime: 0,
        minTime: Infinity,
        maxTime: 0,
        successRate: 0,
        avgDataSize: 0,
        totalDataSize: 0
      };
    }
    
    const endpointMetrics = metrics.performanceByEndpoint[endpoint.path];
    endpointMetrics.requests++;
    endpointMetrics.totalTime += responseTime;
    
    if (responseTime < endpointMetrics.minTime) {
      endpointMetrics.minTime = responseTime;
    }
    
    if (responseTime > endpointMetrics.maxTime) {
      endpointMetrics.maxTime = responseTime;
    }
    
    // Taille des données
    if (response.data) {
      const dataSize = JSON.stringify(response.data).length;
      endpointMetrics.totalDataSize += dataSize;
      endpointMetrics.avgDataSize = endpointMetrics.totalDataSize / endpointMetrics.requests;
    }
    
    // Métriques mémoire
    metrics.memoryUsage.push({
      timestamp: Date.now(),
      heapUsed: endMemory.heapUsed - startMemory.heapUsed,
      heapTotal: endMemory.heapTotal,
      external: endMemory.external
    });
    
    if (response.status === 200) {
      metrics.successfulRequests++;
      endpointMetrics.successRate = (endpointMetrics.requests > 0) ? 
        (metrics.successfulRequests / endpointMetrics.requests) * 100 : 0;
      
      return {
        success: true,
        responseTime,
        statusCode: response.status,
        dataSize: response.data ? JSON.stringify(response.data).length : 0,
        endpoint: endpoint.path,
        withinThreshold: responseTime <= endpoint.maxResponseTime,
        memoryDelta: endMemory.heapUsed - startMemory.heapUsed
      };
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
    
  } catch (error) {
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    metrics.totalRequests++;
    metrics.failedRequests++;
    metrics.responseTimes.push(responseTime);
    
    // Erreurs par endpoint
    if (!metrics.errorsByEndpoint[endpoint.path]) {
      metrics.errorsByEndpoint[endpoint.path] = {};
    }
    
    const errorType = error.response?.status || error.code || 'UNKNOWN';
    metrics.errorsByEndpoint[endpoint.path][errorType] = 
      (metrics.errorsByEndpoint[endpoint.path][errorType] || 0) + 1;
    
    return {
      success: false,
      responseTime,
      error: error.message,
      endpoint: endpoint.path,
      statusCode: error.response?.status || 'TIMEOUT'
    };
  }
}

/**
 * Test de performance individuel
 */
async function testSingleEndpoint(endpoint) {
  console.log(`${colors.blue}🔍 Test Performance: ${endpoint.name}${colors.reset}`);
  
  const results = [];
  const iterations = 5;
  
  for (let i = 0; i < iterations; i++) {
    const result = await performRequest(endpoint, `single-${i}`);
    results.push(result);
    
    // Pause entre les requêtes
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Analyser les résultats
  const successfulResults = results.filter(r => r.success);
  const avgResponseTime = successfulResults.length > 0 ? 
    successfulResults.reduce((sum, r) => sum + r.responseTime, 0) / successfulResults.length : 0;
  
  const withinThreshold = avgResponseTime <= endpoint.maxResponseTime;
  const successRate = (successfulResults.length / results.length) * 100;
  
  console.log(`   ✅ Requêtes: ${successfulResults.length}/${results.length}`);
  console.log(`   ⏱️  Temps moyen: ${avgResponseTime.toFixed(2)}ms`);
  console.log(`   🎯 Seuil: ${endpoint.maxResponseTime}ms`);
  console.log(`   ${withinThreshold ? '✅' : '❌'} Performance: ${withinThreshold ? 'OK' : 'DÉPASSÉ'}`);
  console.log(`   📊 Taux de succès: ${successRate.toFixed(1)}%`);
  
  if (successfulResults.length > 0) {
    const avgDataSize = successfulResults.reduce((sum, r) => sum + (r.dataSize || 0), 0) / successfulResults.length;
    console.log(`   📦 Taille moyenne: ${(avgDataSize / 1024).toFixed(2)} KB`);
  }
  
  console.log('');
  
  return {
    endpoint: endpoint.path,
    name: endpoint.name,
    avgResponseTime,
    withinThreshold,
    successRate,
    priority: endpoint.priority,
    results
  };
}

/**
 * Test de charge concurrent
 */
async function testConcurrentLoad() {
  console.log(`${colors.magenta}🚀 Test de Charge Concurrent${colors.reset}`);
  console.log(`   Utilisateurs simultanés: ${CONCURRENT_USERS}`);
  console.log(`   Requêtes par utilisateur: ${REQUESTS_PER_USER}`);
  console.log('');
  
  const startTime = performance.now();
  metrics.concurrentUsers = CONCURRENT_USERS;
  
  // Créer des promesses pour chaque utilisateur concurrent
  const userPromises = [];
  
  for (let userId = 0; userId < CONCURRENT_USERS; userId++) {
    const userPromise = async () => {
      const userResults = [];
      
      for (let reqIndex = 0; reqIndex < REQUESTS_PER_USER; reqIndex++) {
        // Sélectionner un endpoint aléatoire
        const endpoint = ENDPOINTS[Math.floor(Math.random() * ENDPOINTS.length)];
        const result = await performRequest(endpoint, `concurrent-${userId}`);
        userResults.push(result);
        
        // Pause aléatoire entre les requêtes (50-200ms)
        const pauseTime = Math.random() * 150 + 50;
        await new Promise(resolve => setTimeout(resolve, pauseTime));
      }
      
      return userResults;
    };
    
    userPromises.push(userPromise());
  }
  
  // Exécuter tous les utilisateurs en parallèle
  const allResults = await Promise.all(userPromises);
  const flatResults = allResults.flat();
  
  const endTime = performance.now();
  const totalTime = endTime - startTime;
  
  // Analyser les résultats
  const successfulResults = flatResults.filter(r => r.success);
  const avgResponseTime = successfulResults.length > 0 ? 
    successfulResults.reduce((sum, r) => sum + r.responseTime, 0) / successfulResults.length : 0;
  
  const requestsPerSecond = (flatResults.length / totalTime) * 1000;
  const successRate = (successfulResults.length / flatResults.length) * 100;
  
  console.log(`${colors.green}📊 Résultats Test de Charge:${colors.reset}`);
  console.log(`   Durée totale: ${(totalTime / 1000).toFixed(2)}s`);
  console.log(`   Requêtes totales: ${flatResults.length}`);
  console.log(`   Requêtes/seconde: ${requestsPerSecond.toFixed(2)}`);
  console.log(`   Taux de succès: ${successRate.toFixed(1)}%`);
  console.log(`   Temps de réponse moyen: ${avgResponseTime.toFixed(2)}ms`);
  console.log('');
  
  return {
    totalTime,
    totalRequests: flatResults.length,
    requestsPerSecond,
    successRate,
    avgResponseTime,
    results: flatResults
  };
}

/**
 * Test de stress prolongé
 */
async function testStressEndurance() {
  console.log(`${colors.yellow}⚡ Test de Stress Prolongé${colors.reset}`);
  console.log(`   Durée: ${STRESS_DURATION / 1000}s`);
  console.log('');
  
  const startTime = Date.now();
  const endTime = startTime + STRESS_DURATION;
  const results = [];
  
  let requestCount = 0;
  
  while (Date.now() < endTime) {
    const endpoint = ENDPOINTS[Math.floor(Math.random() * ENDPOINTS.length)];
    const result = await performRequest(endpoint, `stress-${requestCount}`);
    results.push(result);
    requestCount++;
    
    // Pause très courte pour éviter de surcharger
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Afficher le progrès toutes les 10 secondes
    if (requestCount % 100 === 0) {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed / STRESS_DURATION) * 100;
      console.log(`   📈 Progrès: ${progress.toFixed(1)}% (${requestCount} requêtes)`);
    }
  }
  
  const actualDuration = Date.now() - startTime;
  const successfulResults = results.filter(r => r.success);
  const avgResponseTime = successfulResults.length > 0 ? 
    successfulResults.reduce((sum, r) => sum + r.responseTime, 0) / successfulResults.length : 0;
  
  const requestsPerSecond = (results.length / actualDuration) * 1000;
  const successRate = (successfulResults.length / results.length) * 100;
  
  console.log(`${colors.green}📊 Résultats Test de Stress:${colors.reset}`);
  console.log(`   Durée réelle: ${(actualDuration / 1000).toFixed(2)}s`);
  console.log(`   Requêtes totales: ${results.length}`);
  console.log(`   Requêtes/seconde: ${requestsPerSecond.toFixed(2)}`);
  console.log(`   Taux de succès: ${successRate.toFixed(1)}%`);
  console.log(`   Temps de réponse moyen: ${avgResponseTime.toFixed(2)}ms`);
  console.log('');
  
  return {
    duration: actualDuration,
    totalRequests: results.length,
    requestsPerSecond,
    successRate,
    avgResponseTime,
    results
  };
}

/**
 * Analyser les métriques mémoire
 */
function analyzeMemoryUsage() {
  if (metrics.memoryUsage.length === 0) return null;
  
  const memoryDeltas = metrics.memoryUsage.map(m => m.heapUsed);
  const avgMemoryDelta = memoryDeltas.reduce((sum, delta) => sum + delta, 0) / memoryDeltas.length;
  const maxMemoryDelta = Math.max(...memoryDeltas);
  const minMemoryDelta = Math.min(...memoryDeltas);
  
  return {
    avgMemoryDelta: avgMemoryDelta / 1024 / 1024, // MB
    maxMemoryDelta: maxMemoryDelta / 1024 / 1024, // MB
    minMemoryDelta: minMemoryDelta / 1024 / 1024, // MB
    totalMeasurements: metrics.memoryUsage.length
  };
}

/**
 * Générer rapport de performance
 */
async function generatePerformanceReport(testResults) {
  const reportPath = `/tmp/performance-report-${Date.now()}.json`;
  
  const report = {
    timestamp: new Date().toISOString(),
    testConfiguration: {
      baseUrl: BASE_URL,
      concurrentUsers: CONCURRENT_USERS,
      requestsPerUser: REQUESTS_PER_USER,
      stressDuration: STRESS_DURATION,
      endpointsTested: ENDPOINTS.length
    },
    globalMetrics: {
      totalRequests: metrics.totalRequests,
      successfulRequests: metrics.successfulRequests,
      failedRequests: metrics.failedRequests,
      successRate: ((metrics.successfulRequests / metrics.totalRequests) * 100).toFixed(2),
      avgResponseTime: (metrics.totalResponseTime / metrics.totalRequests).toFixed(2),
      minResponseTime: metrics.minResponseTime.toFixed(2),
      maxResponseTime: metrics.maxResponseTime.toFixed(2),
      medianResponseTime: calculateMedian(metrics.responseTimes).toFixed(2),
      p95ResponseTime: calculatePercentile(metrics.responseTimes, 95).toFixed(2),
      p99ResponseTime: calculatePercentile(metrics.responseTimes, 99).toFixed(2)
    },
    memoryAnalysis: analyzeMemoryUsage(),
    performanceByEndpoint: metrics.performanceByEndpoint,
    errorsByEndpoint: metrics.errorsByEndpoint,
    testResults: testResults,
    recommendations: generatePerformanceRecommendations(testResults)
  };
  
  try {
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    console.log(`${colors.green}📄 Rapport de performance généré: ${reportPath}${colors.reset}`);
    return reportPath;
  } catch (error) {
    console.error(`❌ Erreur génération rapport: ${error.message}`);
    return null;
  }
}

/**
 * Calculer la médiane
 */
function calculateMedian(numbers) {
  const sorted = [...numbers].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  } else {
    return sorted[middle];
  }
}

/**
 * Calculer un percentile
 */
function calculatePercentile(numbers, percentile) {
  const sorted = [...numbers].sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[index] || 0;
}

/**
 * Générer recommandations de performance
 */
function generatePerformanceRecommendations(testResults) {
  const recommendations = [];
  
  // Analyser les résultats par endpoint
  Object.entries(metrics.performanceByEndpoint).forEach(([endpoint, perf]) => {
    const avgTime = perf.totalTime / perf.requests;
    const endpointConfig = ENDPOINTS.find(e => e.path === endpoint);
    
    if (avgTime > endpointConfig?.maxResponseTime) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        endpoint,
        issue: `Temps de réponse moyen (${avgTime.toFixed(2)}ms) dépasse le seuil (${endpointConfig.maxResponseTime}ms)`,
        suggestion: 'Optimiser les requêtes de base de données ou ajouter du cache'
      });
    }
    
    if (perf.avgDataSize > 100000) { // 100KB
      recommendations.push({
        type: 'data-size',
        priority: 'medium',
        endpoint,
        issue: `Taille de données importante (${(perf.avgDataSize / 1024).toFixed(2)} KB)`,
        suggestion: 'Implémenter la pagination ou réduire les données retournées'
      });
    }
  });
  
  // Analyser le taux de succès global
  const globalSuccessRate = (metrics.successfulRequests / metrics.totalRequests) * 100;
  if (globalSuccessRate < 95) {
    recommendations.push({
      type: 'reliability',
      priority: 'critical',
      issue: `Taux de succès faible (${globalSuccessRate.toFixed(1)}%)`,
      suggestion: 'Investiguer les erreurs et améliorer la stabilité'
    });
  }
  
  // Analyser la mémoire
  const memoryAnalysis = analyzeMemoryUsage();
  if (memoryAnalysis && memoryAnalysis.maxMemoryDelta > 50) { // 50MB
    recommendations.push({
      type: 'memory',
      priority: 'medium',
      issue: `Consommation mémoire élevée (${memoryAnalysis.maxMemoryDelta.toFixed(2)} MB)`,
      suggestion: 'Optimiser la gestion mémoire et éviter les fuites'
    });
  }
  
  return recommendations;
}

/**
 * Fonction principale
 */
async function main() {
  console.log(`🚀 Démarrage de la validation de performance...`);
  console.log(`🎯 Base URL: ${BASE_URL}`);
  console.log(`🆔 Device ID: ${DEVICE_ID}`);
  console.log('');
  
  const testResults = {
    individual: [],
    concurrent: null,
    stress: null
  };
  
  try {
    // 1. Tests individuels de performance
    console.log(`${colors.blue}=== PHASE 1: Tests Performance Individuels ===${colors.reset}`);
    for (const endpoint of ENDPOINTS) {
      const result = await testSingleEndpoint(endpoint);
      testResults.individual.push(result);
      
      // Pause entre les tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // 2. Test de charge concurrent
    console.log(`${colors.magenta}=== PHASE 2: Test de Charge Concurrent ===${colors.reset}`);
    testResults.concurrent = await testConcurrentLoad();
    
    // 3. Test de stress prolongé
    console.log(`${colors.yellow}=== PHASE 3: Test de Stress Prolongé ===${colors.reset}`);
    testResults.stress = await testStressEndurance();
    
    // 4. Génération du rapport
    console.log(`${colors.cyan}=== PHASE 4: Génération Rapport ===${colors.reset}`);
    const reportPath = await generatePerformanceReport(testResults);
    
    // 5. Résumé final
    console.log(`${colors.green}=== RÉSUMÉ FINAL ===${colors.reset}`);
    console.log(`📊 Requêtes totales: ${metrics.totalRequests}`);
    console.log(`✅ Succès: ${metrics.successfulRequests} (${((metrics.successfulRequests / metrics.totalRequests) * 100).toFixed(1)}%)`);
    console.log(`❌ Échecs: ${metrics.failedRequests}`);
    console.log(`⏱️  Temps moyen: ${(metrics.totalResponseTime / metrics.totalRequests).toFixed(2)}ms`);
    console.log(`🔥 Temps max: ${metrics.maxResponseTime.toFixed(2)}ms`);
    console.log(`⚡ Temps min: ${metrics.minResponseTime.toFixed(2)}ms`);
    
    // Analyser les résultats critiques
    const criticalIssues = testResults.individual.filter(r => 
      r.priority === 'critical' && (!r.withinThreshold || r.successRate < 95)
    );
    
    if (criticalIssues.length > 0) {
      console.log(`${colors.red}🚨 PROBLÈMES CRITIQUES DÉTECTÉS:${colors.reset}`);
      criticalIssues.forEach(issue => {
        console.log(`   ❌ ${issue.name}: ${issue.avgResponseTime.toFixed(2)}ms (seuil dépassé)`);
      });
      process.exit(1);
    } else {
      console.log(`${colors.green}🎉 Validation de performance RÉUSSIE!${colors.reset}`);
      console.log(`📄 Rapport détaillé: ${reportPath}`);
      process.exit(0);
    }
    
  } catch (error) {
    console.error(`${colors.red}💥 Erreur lors de la validation: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Exécuter la validation
main(); 