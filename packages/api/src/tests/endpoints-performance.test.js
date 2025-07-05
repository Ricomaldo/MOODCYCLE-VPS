/**
 * Tests de performance des endpoints MoodCycle API
 * 
 * Ces tests valident :
 * - Les temps de réponse des endpoints
 * - La gestion de la charge
 * - La stabilité des performances
 */

const request = require('supertest');

// Configuration de test
const API_BASE_URL = process.env.API_BASE_URL || 'https://moodcycle.irimwebforge.com';
const TEST_DEVICE_ID = 'test-jest-performance';

// Seuils de performance (en millisecondes)
const PERFORMANCE_THRESHOLDS = {
  health: 200,        // Health check doit être très rapide
  insights: 1000,     // Insights (données volumineuses)
  phases: 500,        // Phases (données moyennes)
  closings: 300,      // Closings (données légères)
  vignettes: 800      // Vignettes (données moyennes)
};

describe('⚡ Tests de Performance des Endpoints', () => {
  
  describe('Temps de réponse individuels', () => {
    
    test('GET /api/health - Performance optimale', async () => {
      const startTime = Date.now();
      
      const response = await request(API_BASE_URL)
        .get('/api/health')
        .expect(200);
      
      const responseTime = Date.now() - startTime;
      
      expect(response.body.status).toBe('healthy');
      expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.health);
      
      console.log(`🏥 Health check: ${responseTime}ms (seuil: ${PERFORMANCE_THRESHOLDS.health}ms)`);
    });

    test('GET /api/insights - Performance acceptable', async () => {
      const startTime = Date.now();
      
      const response = await request(API_BASE_URL)
        .get('/api/insights')
        .set('X-Device-ID', TEST_DEVICE_ID)
        .expect(200);
      
      const responseTime = Date.now() - startTime;
      
      expect(response.body.success).toBe(true);
      expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.insights);
      
      console.log(`💡 Insights: ${responseTime}ms (seuil: ${PERFORMANCE_THRESHOLDS.insights}ms)`);
    });

    test('GET /api/phases - Performance acceptable', async () => {
      const startTime = Date.now();
      
      const response = await request(API_BASE_URL)
        .get('/api/phases')
        .set('X-Device-ID', TEST_DEVICE_ID)
        .expect(200);
      
      const responseTime = Date.now() - startTime;
      
      expect(response.body.success).toBe(true);
      expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.phases);
      
      console.log(`🌙 Phases: ${responseTime}ms (seuil: ${PERFORMANCE_THRESHOLDS.phases}ms)`);
    });

    test('GET /api/closings - Performance acceptable', async () => {
      const startTime = Date.now();
      
      const response = await request(API_BASE_URL)
        .get('/api/closings')
        .set('X-Device-ID', TEST_DEVICE_ID)
        .expect(200);
      
      const responseTime = Date.now() - startTime;
      
      expect(response.body.success).toBe(true);
      expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.closings);
      
      console.log(`🔚 Closings: ${responseTime}ms (seuil: ${PERFORMANCE_THRESHOLDS.closings}ms)`);
    });

    test('GET /api/vignettes - Performance acceptable', async () => {
      const startTime = Date.now();
      
      const response = await request(API_BASE_URL)
        .get('/api/vignettes')
        .set('X-Device-ID', TEST_DEVICE_ID)
        .expect(200);
      
      const responseTime = Date.now() - startTime;
      
      expect(response.body.success).toBe(true);
      expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.vignettes);
      
      console.log(`🎯 Vignettes: ${responseTime}ms (seuil: ${PERFORMANCE_THRESHOLDS.vignettes}ms)`);
    });
  });

  describe('Tests de charge légère', () => {
    
    test('Requêtes concurrentes sur /api/health', async () => {
      const concurrentRequests = 5;
      const startTime = Date.now();
      
      const promises = Array(concurrentRequests).fill().map(() =>
        request(API_BASE_URL)
          .get('/api/health')
          .expect(200)
      );
      
      const responses = await Promise.all(promises);
      const totalTime = Date.now() - startTime;
      const avgTime = totalTime / concurrentRequests;
      
      // Toutes les réponses doivent être valides
      responses.forEach(response => {
        expect(response.body.status).toBe('healthy');
      });
      
      // Le temps moyen ne doit pas dépasser le seuil
      expect(avgTime).toBeLessThan(PERFORMANCE_THRESHOLDS.health * 2);
      
      console.log(`🔄 ${concurrentRequests} requêtes health concurrentes: ${avgTime.toFixed(2)}ms/req`);
    });

    test('Requêtes concurrentes sur /api/insights', async () => {
      const concurrentRequests = 3;
      const startTime = Date.now();
      
      const promises = Array(concurrentRequests).fill().map((_, index) =>
        request(API_BASE_URL)
          .get('/api/insights')
          .set('X-Device-ID', `${TEST_DEVICE_ID}-concurrent-${index}`)
          .expect(200)
      );
      
      const responses = await Promise.all(promises);
      const totalTime = Date.now() - startTime;
      const avgTime = totalTime / concurrentRequests;
      
      // Toutes les réponses doivent être valides
      responses.forEach(response => {
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('menstrual');
      });
      
      // Le temps moyen ne doit pas dépasser le seuil multiplié par 1.5
      expect(avgTime).toBeLessThan(PERFORMANCE_THRESHOLDS.insights * 1.5);
      
      console.log(`🔄 ${concurrentRequests} requêtes insights concurrentes: ${avgTime.toFixed(2)}ms/req`);
    });
  });

  describe('Stabilité des performances', () => {
    
    test('Cohérence des temps de réponse', async () => {
      const iterations = 5;
      const responseTimes = [];
      
      for (let i = 0; i < iterations; i++) {
        const startTime = Date.now();
        
        await request(API_BASE_URL)
          .get('/api/phases')
          .set('X-Device-ID', `${TEST_DEVICE_ID}-stability-${i}`)
          .expect(200);
        
        responseTimes.push(Date.now() - startTime);
        
        // Petite pause entre les requêtes
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const avgTime = responseTimes.reduce((a, b) => a + b) / responseTimes.length;
      const maxTime = Math.max(...responseTimes);
      const minTime = Math.min(...responseTimes);
      const variance = maxTime - minTime;
      
      // La variance ne doit pas être trop importante
      expect(variance).toBeLessThan(avgTime * 2);
      expect(avgTime).toBeLessThan(PERFORMANCE_THRESHOLDS.phases);
      
      console.log(`📊 Stabilité phases: avg=${avgTime.toFixed(2)}ms, variance=${variance}ms`);
    });
  });

  describe('Gestion des erreurs performante', () => {
    
    test('Erreur 401 rapide sans device ID', async () => {
      const startTime = Date.now();
      
      const response = await request(API_BASE_URL)
        .get('/api/insights')
        .expect(401);
      
      const responseTime = Date.now() - startTime;
      
      expect(response.body.success).toBe(false);
      // Les erreurs d'auth doivent être très rapides
      expect(responseTime).toBeLessThan(100);
      
      console.log(`🚫 Erreur 401: ${responseTime}ms (très rapide)`);
    });

    test('Erreur 404 rapide endpoint inexistant', async () => {
      const startTime = Date.now();
      
      await request(API_BASE_URL)
        .get('/api/endpoint-inexistant')
        .set('X-Device-ID', TEST_DEVICE_ID)
        .expect(404);
      
      const responseTime = Date.now() - startTime;
      
      // Les erreurs 404 doivent être très rapides
      expect(responseTime).toBeLessThan(100);
      
      console.log(`🚫 Erreur 404: ${responseTime}ms (très rapide)`);
    });
  });
});

describe('📈 Métriques de Performance', () => {
  
  test('Benchmark complet des endpoints', async () => {
    const endpoints = [
      { path: '/api/health', needsAuth: false, threshold: PERFORMANCE_THRESHOLDS.health },
      { path: '/api/insights', needsAuth: true, threshold: PERFORMANCE_THRESHOLDS.insights },
      { path: '/api/phases', needsAuth: true, threshold: PERFORMANCE_THRESHOLDS.phases },
      { path: '/api/closings', needsAuth: true, threshold: PERFORMANCE_THRESHOLDS.closings },
      { path: '/api/vignettes', needsAuth: true, threshold: PERFORMANCE_THRESHOLDS.vignettes }
    ];
    
    console.log('\n📊 === BENCHMARK COMPLET ===');
    
    for (const endpoint of endpoints) {
      const startTime = Date.now();
      
      const req = request(API_BASE_URL).get(endpoint.path);
      
      if (endpoint.needsAuth) {
        req.set('X-Device-ID', `${TEST_DEVICE_ID}-benchmark`);
      }
      
      const response = await req;
      const responseTime = Date.now() - startTime;
      
      const status = endpoint.needsAuth ? 
        (response.status === 200 ? '✅' : '❌') :
        (response.status === 200 ? '✅' : '❌');
      
      const performance = responseTime < endpoint.threshold ? '🚀' : '⚠️';
      
      console.log(`${status} ${performance} ${endpoint.path}: ${responseTime}ms (seuil: ${endpoint.threshold}ms)`);
      
      expect(responseTime).toBeLessThan(endpoint.threshold * 1.5); // Marge de 50%
    }
  });
}); 