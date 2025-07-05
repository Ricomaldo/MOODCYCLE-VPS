const express = require('express');
const router = express.Router();
const deviceAuth = require('../middleware/deviceAuth');
const advancedAnalyticsController = require('../controllers/advancedAnalyticsController');

// ═══════════════════════════════════════════════════════
// 🔍 ROUTES ANALYTICS AVANCÉS
// ═══════════════════════════════════════════════════════

/**
 * GET /api/analytics/behavior - Analytics comportementaux
 * Analyse des interactions utilisateur, navigation, patterns
 */
router.get('/behavior', deviceAuth, advancedAnalyticsController.getBehaviorAnalytics);

/**
 * GET /api/analytics/device - Analytics device
 * Analyse des métriques device, plateformes, modèles
 */
router.get('/device', deviceAuth, advancedAnalyticsController.getDeviceAnalytics);

/**
 * GET /api/analytics/performance - Analytics performance
 * Analyse des performances, FPS, latence, mémoire
 */
router.get('/performance', deviceAuth, advancedAnalyticsController.getPerformanceAnalytics);

/**
 * GET /api/analytics/patterns - Patterns d'usage
 * Analyse des patterns temporels, sessions, fonctionnalités
 */
router.get('/patterns', deviceAuth, advancedAnalyticsController.getUsagePatterns);

/**
 * GET /api/analytics/crashes - Analytics crashes
 * Analyse des crashes, erreurs, stabilité
 */
router.get('/crashes', deviceAuth, advancedAnalyticsController.getCrashAnalytics);

/**
 * GET /api/analytics/dashboard - Dashboard complet
 * Vue d'ensemble complète avec toutes les métriques
 */
router.get('/dashboard', deviceAuth, advancedAnalyticsController.getDashboard);

// ═══════════════════════════════════════════════════════
// 📊 ROUTES SPÉCIALISÉES
// ═══════════════════════════════════════════════════════

/**
 * GET /api/analytics/overview - Métriques d'overview
 * Métriques rapides pour dashboard principal
 */
router.get('/overview', deviceAuth, async (req, res) => {
  try {
    const fs = require('fs').promises;
    const path = require('path');
    
    const storesPath = path.join(__dirname, '../data/stores.json');
    const data = await fs.readFile(storesPath, 'utf8');
    const stores = JSON.parse(data);
    
    const overview = advancedAnalyticsController.getOverviewMetrics(stores);
    
    res.json({
      success: true,
      data: overview,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error in overview:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur récupération overview'
    });
  }
});

/**
 * GET /api/analytics/recommendations - Recommandations
 * Recommandations basées sur l'analyse des données
 */
router.get('/recommendations', deviceAuth, async (req, res) => {
  try {
    const fs = require('fs').promises;
    const path = require('path');
    
    const storesPath = path.join(__dirname, '../data/stores.json');
    const data = await fs.readFile(storesPath, 'utf8');
    const stores = JSON.parse(data);
    
    const recommendations = advancedAnalyticsController.generateRecommendations(stores);
    
    res.json({
      success: true,
      data: recommendations,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error in recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur génération recommandations'
    });
  }
});

/**
 * GET /api/analytics/health - Santé du système analytics
 * Vérification de la santé du système d'analytics
 */
router.get('/health', deviceAuth, async (req, res) => {
  try {
    const fs = require('fs').promises;
    const path = require('path');
    
    const storesPath = path.join(__dirname, '../data/stores.json');
    
    // Vérifier si le fichier existe et est accessible
    const stats = await fs.stat(storesPath);
    const data = await fs.readFile(storesPath, 'utf8');
    const stores = JSON.parse(data);
    
    const health = {
      status: 'healthy',
      dataAvailable: true,
      storesCount: stores.length,
      lastUpdate: stats.mtime.toISOString(),
      services: {
        behaviorAnalytics: true,
        deviceAnalytics: true,
        performanceAnalytics: true,
        crashAnalytics: true
      }
    };
    
    res.json({
      success: true,
      data: health,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error in health check:', error);
    res.status(500).json({
      success: false,
      data: {
        status: 'unhealthy',
        dataAvailable: false,
        error: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router; 