const express = require('express');
const router = express.Router();
const deviceAuth = require('../middleware/deviceAuth');

// Base de données en mémoire pour stocker les stores par device
const storesDatabase = new Map();

// Utilitaires pour nettoyer les données sensibles
const sanitizeStoreData = (storeData) => {
  const sanitized = { ...storeData };
  
  // Supprimer les fonctions et références circulaires
  const cleanObject = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return obj.toISOString();
    if (Array.isArray(obj)) return obj.map(cleanObject);
    
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'function') continue;
      if (key.startsWith('_') || key.includes('hydrate')) continue;
      cleaned[key] = cleanObject(value);
    }
    return cleaned;
  };
  
  return cleanObject(sanitized);
};

// Calculer métriques agrégées
const calculateMetrics = (allStores) => {
  const metrics = {
    totalUsers: allStores.length,
    avgEngagement: 0,
    maturityDistribution: { discovery: 0, learning: 0, autonomous: 0 },
    cycleTracking: { active: 0, inactive: 0 },
    conversationMetrics: { totalMessages: 0, avgPerUser: 0 },
    notebookMetrics: { totalEntries: 0, avgPerUser: 0 },
    intelligenceMetrics: { avgConfidence: 0, patternsDetected: 0 }
  };
  
  if (allStores.length === 0) return metrics;
  
  let totalEngagement = 0;
  let totalMessages = 0;
  let totalEntries = 0;
  let totalConfidence = 0;
  let patternsCount = 0;
  
  allStores.forEach(storeData => {
    const { userStore, cycleStore, chatStore, notebookStore, engagementStore, userIntelligence } = storeData.stores;
    
    // Engagement
    if (engagementStore?.metrics) {
      totalEngagement += engagementStore.metrics.daysUsed || 0;
      
      // Maturité
      const maturity = engagementStore.maturity?.current || 'discovery';
      metrics.maturityDistribution[maturity]++;
    }
    
    // Cycle tracking
    if (cycleStore?.lastPeriodDate) {
      metrics.cycleTracking.active++;
    } else {
      metrics.cycleTracking.inactive++;
    }
    
    // Conversations
    if (chatStore?.messages) {
      totalMessages += chatStore.messages.length;
    }
    
    // Notebook
    if (notebookStore?.entries) {
      totalEntries += notebookStore.entries.length;
    }
    
    // Intelligence
    if (userIntelligence?.learning?.confidence) {
      totalConfidence += userIntelligence.learning.confidence;
    }
    
    if (userIntelligence?.observationPatterns?.totalObservations > 0) {
      patternsCount++;
    }
  });
  
  metrics.avgEngagement = Math.round(totalEngagement / allStores.length);
  metrics.conversationMetrics.totalMessages = totalMessages;
  metrics.conversationMetrics.avgPerUser = Math.round(totalMessages / allStores.length);
  metrics.notebookMetrics.totalEntries = totalEntries;
  metrics.notebookMetrics.avgPerUser = Math.round(totalEntries / allStores.length);
  metrics.intelligenceMetrics.avgConfidence = Math.round(totalConfidence / allStores.length);
  metrics.intelligenceMetrics.patternsDetected = patternsCount;
  
  return metrics;
};

// POST /api/stores/sync - Collecter les stores depuis l'app mobile
router.post('/sync', deviceAuth, async (req, res) => {
  try {
    const deviceId = req.headers['x-device-id'];
    const { stores, metadata } = req.body;
    
    if (!stores || typeof stores !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Stores data is required'
      });
    }
    
    // Nettoyer et valider les données
    const sanitizedStores = sanitizeStoreData(stores);
    
    // Enrichir avec métadonnées
    const storeData = {
      deviceId,
      stores: sanitizedStores,
      metadata: {
        timestamp: new Date().toISOString(),
        appVersion: metadata?.appVersion || 'unknown',
        platform: metadata?.platform || 'unknown',
        ...metadata
      }
    };
    
    // Stocker en base (en mémoire pour l'instant)
    storesDatabase.set(deviceId, storeData);
    
    console.log(`📊 Stores collected for device ${deviceId}`);
    console.log(`📈 Total devices: ${storesDatabase.size}`);
    
    // Calculer métriques agrégées
    const allStores = Array.from(storesDatabase.values());
    const metrics = calculateMetrics(allStores);
    
    res.json({
      success: true,
      message: 'Stores data collected successfully',
      deviceId,
      timestamp: storeData.metadata.timestamp,
      aggregatedMetrics: metrics
    });
    
  } catch (error) {
    console.error('❌ Error collecting stores:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to collect stores data'
    });
  }
});

// GET /api/stores/analytics - Récupérer métriques agrégées
router.get('/analytics', deviceAuth, async (req, res) => {
  try {
    const allStores = Array.from(storesDatabase.values());
    const metrics = calculateMetrics(allStores);
    
    // Métriques détaillées par store
    const detailedMetrics = {
      ...metrics,
      storeBreakdown: {
        userStore: {
          completedProfiles: allStores.filter(s => s.stores.userStore?.profile?.completed).length,
          personaDistribution: {}
        },
        cycleStore: {
          regularCycles: allStores.filter(s => s.stores.cycleStore?.isRegular === true).length,
          avgCycleLength: 0,
          observationsCount: 0
        },
        intelligenceStore: {
          highConfidence: allStores.filter(s => s.stores.userIntelligence?.learning?.confidence > 70).length,
          patternsDetected: allStores.filter(s => s.stores.userIntelligence?.observationPatterns?.totalObservations > 10).length
        }
      },
      lastUpdate: new Date().toISOString()
    };
    
    // Calculer distribution des personas
    allStores.forEach(storeData => {
      const persona = storeData.stores.userStore?.persona?.assigned || 'unknown';
      detailedMetrics.storeBreakdown.userStore.personaDistribution[persona] = 
        (detailedMetrics.storeBreakdown.userStore.personaDistribution[persona] || 0) + 1;
    });
    
    // Calculer moyenne cycle
    const cycleLengths = allStores
      .map(s => s.stores.cycleStore?.length)
      .filter(length => length && length > 0);
    if (cycleLengths.length > 0) {
      detailedMetrics.storeBreakdown.cycleStore.avgCycleLength = 
        Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length);
    }
    
    // Compter observations totales
    detailedMetrics.storeBreakdown.cycleStore.observationsCount = allStores
      .reduce((total, s) => total + (s.stores.cycleStore?.observations?.length || 0), 0);
    
    res.json({
      success: true,
      data: detailedMetrics,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error calculating analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate analytics'
    });
  }
});

// GET /api/stores/all - Récupérer toutes les données (admin)
router.get('/all', deviceAuth, async (req, res) => {
  try {
    const allStores = Array.from(storesDatabase.values());
    
    // Anonymiser les données sensibles
    const anonymizedStores = allStores.map(storeData => ({
      deviceId: storeData.deviceId.substring(0, 8) + '...',
      metadata: {
        timestamp: storeData.metadata.timestamp,
        platform: storeData.metadata.platform,
        appVersion: storeData.metadata.appVersion
      },
      stores: {
        userStore: {
          profile: {
            ageRange: storeData.stores.userStore?.profile?.ageRange,
            journeyChoice: storeData.stores.userStore?.profile?.journeyChoice,
            completed: storeData.stores.userStore?.profile?.completed
          },
          persona: storeData.stores.userStore?.persona
        },
        cycleStore: {
          length: storeData.stores.cycleStore?.length,
          isRegular: storeData.stores.cycleStore?.isRegular,
          observationsCount: storeData.stores.cycleStore?.observations?.length || 0
        },
        engagementStore: {
          metrics: storeData.stores.engagementStore?.metrics,
          maturity: storeData.stores.engagementStore?.maturity
        },
        intelligenceStore: {
          confidence: storeData.stores.userIntelligence?.learning?.confidence,
          totalObservations: storeData.stores.userIntelligence?.observationPatterns?.totalObservations,
          consistency: storeData.stores.userIntelligence?.observationPatterns?.consistency
        }
      }
    }));
    
    res.json({
      success: true,
      data: anonymizedStores,
      count: anonymizedStores.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error fetching all stores:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stores data'
    });
  }
});

// GET /api/stores/:deviceId - Récupérer données d'un device spécifique
router.get('/:deviceId', deviceAuth, async (req, res) => {
  try {
    const { deviceId } = req.params;
    const storeData = storesDatabase.get(deviceId);
    
    if (!storeData) {
      return res.status(404).json({
        success: false,
        error: 'Device not found'
      });
    }
    
    res.json({
      success: true,
      data: storeData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error fetching device stores:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch device stores'
    });
  }
});

// DELETE /api/stores/:deviceId - Supprimer données d'un device (RGPD)
router.delete('/:deviceId', deviceAuth, async (req, res) => {
  try {
    const { deviceId } = req.params;
    const existed = storesDatabase.has(deviceId);
    
    if (existed) {
      storesDatabase.delete(deviceId);
      console.log(`🗑️ Deleted stores for device ${deviceId}`);
    }
    
    res.json({
      success: true,
      message: existed ? 'Device data deleted successfully' : 'Device not found',
      deviceId,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error deleting device stores:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete device stores'
    });
  }
});

// GET /api/stores/intelligence/patterns - Analytics intelligence avancés
router.get('/intelligence/patterns', deviceAuth, async (req, res) => {
  try {
    const allStores = Array.from(storesDatabase.values());
    
    const intelligenceAnalytics = {
      totalDevices: allStores.length,
      confidenceDistribution: { low: 0, medium: 0, high: 0 },
      phasePatterns: {
        menstrual: { topics: {}, moods: {} },
        follicular: { topics: {}, moods: {} },
        ovulatory: { topics: {}, moods: {} },
        luteal: { topics: {}, moods: {} }
      },
      observationReadiness: {
        ready: 0,
        learning: 0,
        starting: 0
      },
      autonomySignals: {
        total: 0,
        avgPerUser: 0,
        distribution: {}
      }
    };
    
    allStores.forEach(storeData => {
      const intelligence = storeData.stores.userIntelligence;
      if (!intelligence) return;
      
      // Distribution confiance
      const confidence = intelligence.learning?.confidence || 0;
      if (confidence < 30) intelligenceAnalytics.confidenceDistribution.low++;
      else if (confidence < 70) intelligenceAnalytics.confidenceDistribution.medium++;
      else intelligenceAnalytics.confidenceDistribution.high++;
      
      // Patterns par phase
      if (intelligence.learning?.phasePatterns) {
        Object.entries(intelligence.learning.phasePatterns).forEach(([phase, pattern]) => {
          if (pattern.topics?.length > 0) {
            pattern.topics.forEach(topic => {
              intelligenceAnalytics.phasePatterns[phase].topics[topic] = 
                (intelligenceAnalytics.phasePatterns[phase].topics[topic] || 0) + 1;
            });
          }
          if (pattern.mood) {
            intelligenceAnalytics.phasePatterns[phase].moods[pattern.mood] = 
              (intelligenceAnalytics.phasePatterns[phase].moods[pattern.mood] || 0) + 1;
          }
        });
      }
      
      // Readiness pour observations
      const totalObs = intelligence.observationPatterns?.totalObservations || 0;
      if (totalObs >= 20) intelligenceAnalytics.observationReadiness.ready++;
      else if (totalObs >= 5) intelligenceAnalytics.observationReadiness.learning++;
      else intelligenceAnalytics.observationReadiness.starting++;
      
      // Signaux autonomie
      if (intelligence.observationPatterns?.autonomySignals) {
        const signals = intelligence.observationPatterns.autonomySignals;
        const totalSignals = Object.values(signals).reduce((sum, val) => sum + val, 0);
        intelligenceAnalytics.autonomySignals.total += totalSignals;
        
        Object.entries(signals).forEach(([signal, count]) => {
          intelligenceAnalytics.autonomySignals.distribution[signal] = 
            (intelligenceAnalytics.autonomySignals.distribution[signal] || 0) + count;
        });
      }
    });
    
    if (allStores.length > 0) {
      intelligenceAnalytics.autonomySignals.avgPerUser = 
        Math.round(intelligenceAnalytics.autonomySignals.total / allStores.length);
    }
    
    res.json({
      success: true,
      data: intelligenceAnalytics,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error analyzing intelligence patterns:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze intelligence patterns'
    });
  }
});

module.exports = router; 