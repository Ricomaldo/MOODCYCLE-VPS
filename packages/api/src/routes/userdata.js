const express = require('express');
const router = express.Router();
const deviceAuth = require('../middleware/deviceAuth');

// Store pour les données utilisateurs collectées (en production: base de données)
let userDataStore = new Map();

/**
 * POST /api/userdata/sync
 * Endpoint sécurisé pour recevoir les données des stores Zustand
 */
router.post('/sync', deviceAuth, async (req, res) => {
  try {
    const deviceId = req.headers['x-device-id'];
    const { stores, metadata } = req.body;
    
    // Validation des données requises
    if (!stores || !metadata) {
      return res.status(400).json({
        error: 'Missing required fields: stores and metadata'
      });
    }
    
    // Validation de la structure des stores
    const requiredStores = [
      'userStore', 
      'cycleStore', 
      'chatStore', 
      'notebookStore', 
      'engagementStore', 
      'userIntelligence', 
      'navigationStore'
    ];
    
    const missingStores = requiredStores.filter(store => !stores[store]);
    if (missingStores.length > 0) {
      return res.status(400).json({
        error: `Missing stores: ${missingStores.join(', ')}`
      });
    }
    
    // Enrichir avec des métadonnées serveur
    const userData = {
      userId: stores.userStore?.profile?.prenom || `user_${deviceId.slice(-8)}`,
      deviceId,
      lastSync: new Date().toISOString(),
      stores: {
        // Nettoyer et valider les données avant stockage
        userStore: sanitizeUserStore(stores.userStore),
        cycleStore: sanitizeCycleStore(stores.cycleStore),
        chatStore: sanitizeChatStore(stores.chatStore),
        notebookStore: sanitizeNotebookStore(stores.notebookStore),
        engagementStore: sanitizeEngagementStore(stores.engagementStore),
        userIntelligence: sanitizeUserIntelligence(stores.userIntelligence),
        navigationStore: sanitizeNavigationStore(stores.navigationStore)
      },
      metadata: {
        ...metadata,
        serverReceivedAt: new Date().toISOString(),
        dataVersion: '1.0'
      }
    };
    
    // Stocker les données (en production: sauvegarder en base de données)
    userDataStore.set(deviceId, userData);
    
    // Log pour monitoring
    console.log(`[UserData] Sync received from device ${deviceId}, user: ${userData.userId}`);
    
    res.json({
      success: true,
      message: 'User data synchronized successfully',
      syncId: `sync_${Date.now()}_${deviceId.slice(-8)}`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[UserData] Sync error:', error);
    res.status(500).json({
      error: 'Internal server error during sync',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Sync failed'
    });
  }
});

/**
 * GET /api/userdata/all
 * Endpoint admin pour récupérer toutes les données collectées
 */
router.get('/all', deviceAuth, async (req, res) => {
  try {
    // En production: vérifier les permissions admin
    const allUserData = Array.from(userDataStore.values());
    
    // Calculer des métriques agrégées
    const metrics = calculateMetrics(allUserData);
    
    res.json({
      success: true,
      data: allUserData,
      metrics,
      totalUsers: allUserData.length,
      lastUpdate: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[UserData] Get all error:', error);
    res.status(500).json({
      error: 'Failed to retrieve user data'
    });
  }
});

/**
 * GET /api/userdata/:deviceId
 * Récupérer les données d'un utilisateur spécifique
 */
router.get('/:deviceId', deviceAuth, async (req, res) => {
  try {
    const { deviceId } = req.params;
    const userData = userDataStore.get(deviceId);
    
    if (!userData) {
      return res.status(404).json({
        error: 'User data not found',
        deviceId
      });
    }
    
    res.json({
      success: true,
      data: userData
    });
    
  } catch (error) {
    console.error('[UserData] Get user error:', error);
    res.status(500).json({
      error: 'Failed to retrieve user data'
    });
  }
});

/**
 * DELETE /api/userdata/:deviceId
 * Supprimer les données d'un utilisateur (RGPD)
 */
router.delete('/:deviceId', deviceAuth, async (req, res) => {
  try {
    const { deviceId } = req.params;
    const existed = userDataStore.delete(deviceId);
    
    if (!existed) {
      return res.status(404).json({
        error: 'User data not found',
        deviceId
      });
    }
    
    console.log(`[UserData] Data deleted for device ${deviceId}`);
    
    res.json({
      success: true,
      message: 'User data deleted successfully',
      deviceId
    });
    
  } catch (error) {
    console.error('[UserData] Delete error:', error);
    res.status(500).json({
      error: 'Failed to delete user data'
    });
  }
});

// ═══════════════════════════════════════════════════════
// 🧹 FONCTIONS DE NETTOYAGE DES DONNÉES
// ═══════════════════════════════════════════════════════

function sanitizeUserStore(userStore) {
  return {
    profile: {
      prenom: userStore?.profile?.prenom || null,
      ageRange: userStore?.profile?.ageRange || null,
      journeyChoice: userStore?.profile?.journeyChoice || null,
      completed: userStore?.profile?.completed || false
    },
    preferences: userStore?.preferences || {},
    persona: {
      assigned: userStore?.persona?.assigned || null,
      confidence: userStore?.persona?.confidence || 0,
      lastCalculated: userStore?.persona?.lastCalculated || null
    },
    melune: userStore?.melune || {}
  };
}

function sanitizeCycleStore(cycleStore) {
  return {
    lastPeriodDate: cycleStore?.lastPeriodDate || null,
    length: cycleStore?.length || 28,
    periodDuration: cycleStore?.periodDuration || 5,
    isRegular: cycleStore?.isRegular || null,
    trackingExperience: cycleStore?.trackingExperience || null,
    observations: (cycleStore?.observations || []).slice(-50), // Limiter à 50 observations
    detectedPatterns: cycleStore?.detectedPatterns || null
  };
}

function sanitizeChatStore(chatStore) {
  return {
    messagesCount: (chatStore?.messages || []).length,
    suggestions: chatStore?.suggestions || [],
    isTyping: chatStore?.isTyping || false,
    pendingMessagesCount: (chatStore?.pendingMessages || []).length
  };
}

function sanitizeNotebookStore(notebookStore) {
  return {
    entriesCount: (notebookStore?.entries || []).length,
    availableTags: notebookStore?.availableTags || [],
    // Ne pas stocker le contenu complet des entrées pour la vie privée
    recentEntryTypes: (notebookStore?.entries || [])
      .slice(-10)
      .map(entry => ({
        type: entry.type,
        timestamp: entry.timestamp,
        phase: entry.phase,
        tagsCount: (entry.tags || []).length
      }))
  };
}

function sanitizeEngagementStore(engagementStore) {
  return {
    metrics: engagementStore?.metrics || {},
    maturity: engagementStore?.maturity || {
      current: 'discovery',
      confidence: 0
    }
  };
}

function sanitizeUserIntelligence(userIntelligence) {
  return {
    learning: {
      confidence: userIntelligence?.learning?.confidence || 0,
      timePatterns: {
        favoriteHours: (userIntelligence?.learning?.timePatterns?.favoriteHours || []).slice(-5),
        activeDays: (userIntelligence?.learning?.timePatterns?.activeDays || []).slice(-7)
      },
      phasePatterns: userIntelligence?.learning?.phasePatterns || {}
    },
    observationPatterns: {
      consistency: userIntelligence?.observationPatterns?.consistency || 0,
      confidence: userIntelligence?.observationPatterns?.confidence || 0,
      totalObservations: userIntelligence?.observationPatterns?.totalObservations || 0,
      autonomySignals: userIntelligence?.observationPatterns?.autonomySignals || {}
    }
  };
}

function sanitizeNavigationStore(navigationStore) {
  return {
    navigationHistory: {
      lastTab: navigationStore?.navigationHistory?.lastTab || null,
      vignetteInteractions: Object.keys(navigationStore?.navigationHistory?.vignetteInteractions || {}).length
    },
    notebookFilters: navigationStore?.notebookFilters || {}
  };
}

// ═══════════════════════════════════════════════════════
// 📊 CALCUL DES MÉTRIQUES AGRÉGÉES
// ═══════════════════════════════════════════════════════

function calculateMetrics(allUserData) {
  if (allUserData.length === 0) {
    return {
      totalUsers: 0,
      activeUsers: 0,
      avgSessionTime: 0,
      retentionRate: 0,
      completionRate: 0,
      cycleTrackingRate: 0,
      chatEngagementRate: 0,
      notebookUsageRate: 0
    };
  }
  
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  
  const activeUsers = allUserData.filter(user => 
    new Date(user.lastSync).getTime() > weekAgo
  ).length;
  
  const completedProfiles = allUserData.filter(user => 
    user.stores.userStore?.profile?.completed
  ).length;
  
  const cycleTrackers = allUserData.filter(user => 
    user.stores.cycleStore?.observations?.length > 0
  ).length;
  
  const chatUsers = allUserData.filter(user => 
    user.stores.chatStore?.messagesCount > 0
  ).length;
  
  const notebookUsers = allUserData.filter(user => 
    user.stores.notebookStore?.entriesCount > 0
  ).length;
  
  return {
    totalUsers: allUserData.length,
    activeUsers,
    avgSessionTime: 4.2, // Calculé depuis engagementStore en production
    retentionRate: (activeUsers / allUserData.length) * 100,
    completionRate: (completedProfiles / allUserData.length) * 100,
    cycleTrackingRate: (cycleTrackers / allUserData.length) * 100,
    chatEngagementRate: (chatUsers / allUserData.length) * 100,
    notebookUsageRate: (notebookUsers / allUserData.length) * 100
  };
}

module.exports = router; 