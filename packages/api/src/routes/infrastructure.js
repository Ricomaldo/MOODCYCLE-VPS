const express = require('express');
const router = express.Router();
const deviceAuth = require('../middleware/deviceAuth');
const HostingerService = require('../services/HostingerService');

// Instance du service Hostinger
const hostingerService = new HostingerService();

/**
 * GET /api/infrastructure/metrics
 * Endpoint pour récupérer toutes les métriques infrastructure
 */
router.get('/metrics', deviceAuth, async (req, res) => {
  try {
    console.log('📊 Infrastructure metrics requested');
    
    const metrics = await hostingerService.getAllMetrics();
    
    // Ajouter des métriques API calculées localement
    const apiMetrics = await getApiMetrics();
    
    const response = {
      success: true,
      data: {
        ...metrics,
        api: apiMetrics
      },
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
    
  } catch (error) {
    console.error('❌ Infrastructure metrics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve infrastructure metrics',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/infrastructure/server
 * Endpoint pour récupérer uniquement les métriques serveur
 */
router.get('/server', deviceAuth, async (req, res) => {
  try {
    const serverMetrics = await hostingerService.getServerMetrics();
    
    res.json({
      success: true,
      data: serverMetrics,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Server metrics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve server metrics'
    });
  }
});

/**
 * GET /api/infrastructure/domain
 * Endpoint pour récupérer les informations de domaine et SSL
 */
router.get('/domain', deviceAuth, async (req, res) => {
  try {
    const domainInfo = await hostingerService.getDomainInfo();
    
    res.json({
      success: true,
      data: domainInfo,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Domain info error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve domain information'
    });
  }
});

/**
 * GET /api/infrastructure/security
 * Endpoint pour récupérer les métriques de sécurité
 */
router.get('/security', deviceAuth, async (req, res) => {
  try {
    const securityMetrics = await hostingerService.getSecurityMetrics();
    
    res.json({
      success: true,
      data: securityMetrics,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Security metrics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve security metrics'
    });
  }
});

/**
 * POST /api/infrastructure/clear-cache
 * Endpoint pour vider le cache des métriques
 */
router.post('/clear-cache', deviceAuth, async (req, res) => {
  try {
    hostingerService.clearCache();
    
    res.json({
      success: true,
      message: 'Infrastructure cache cleared successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Clear cache error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear cache'
    });
  }
});

// ═══════════════════════════════════════════════════════
// 🔍 FONCTIONS UTILITAIRES
// ═══════════════════════════════════════════════════════

/**
 * Calculer les métriques API locales
 */
async function getApiMetrics() {
  try {
    // Simuler le calcul des métriques API
    // En production, ceci pourrait venir d'un service de monitoring
    const now = Date.now();
    const variation = Math.sin(now / 120000) * 50; // Variation plus lente
    
    return {
      status: 'healthy',
      responseTime: Math.max(50, Math.min(500, 185 + variation + (Math.random() * 50 - 25))),
      requestsPerMinute: Math.max(0, Math.floor(42 + (Math.random() * 20 - 10))),
      errorRate: Math.max(0, Math.min(5, 0.2 + (Math.random() * 0.8 - 0.4))),
      endpoints: [
        { 
          path: '/api/insights', 
          status: 200, 
          responseTime: Math.floor(120 + (Math.random() * 40 - 20)), 
          lastCheck: new Date().toISOString() 
        },
        { 
          path: '/api/phases', 
          status: 200, 
          responseTime: Math.floor(95 + (Math.random() * 30 - 15)), 
          lastCheck: new Date().toISOString() 
        },
        { 
          path: '/api/closings', 
          status: 200, 
          responseTime: Math.floor(110 + (Math.random() * 35 - 17)), 
          lastCheck: new Date().toISOString() 
        },
        { 
          path: '/api/vignettes', 
          status: 200, 
          responseTime: Math.floor(140 + (Math.random() * 45 - 22)), 
          lastCheck: new Date().toISOString() 
        },
        { 
          path: '/api/chat', 
          status: 200, 
          responseTime: Math.floor(320 + (Math.random() * 80 - 40)), 
          lastCheck: new Date().toISOString() 
        }
      ],
      database: {
        status: 'connected',
        connectionPool: Math.floor(8 + (Math.random() * 4 - 2)),
        queryTime: Math.floor(25 + (Math.random() * 15 - 7))
      }
    };
    
  } catch (error) {
    console.error('❌ Error calculating API metrics:', error);
    
    // Fallback vers des métriques par défaut
    return {
      status: 'degraded',
      responseTime: 500,
      requestsPerMinute: 0,
      errorRate: 5,
      endpoints: [],
      database: {
        status: 'disconnected',
        connectionPool: 0,
        queryTime: 0
      }
    };
  }
}

module.exports = router; 