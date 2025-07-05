const fs = require('fs').promises;
const path = require('path');

class AdvancedAnalyticsController {
  
  /**
   * GET /api/analytics/behavior - Analytics comportementaux
   */
  async getBehaviorAnalytics(req, res) {
    try {
      const storesPath = path.join(__dirname, '../data/stores.json');
      const data = await fs.readFile(storesPath, 'utf8');
      const stores = JSON.parse(data);
      
      // Analyser les données comportementales
      const behaviorAnalytics = this.analyzeBehaviorData(stores);
      
      res.json({
        success: true,
        data: behaviorAnalytics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Error in getBehaviorAnalytics:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur analyse comportementale'
      });
    }
  }

  /**
   * GET /api/analytics/device - Analytics device
   */
  async getDeviceAnalytics(req, res) {
    try {
      const storesPath = path.join(__dirname, '../data/stores.json');
      const data = await fs.readFile(storesPath, 'utf8');
      const stores = JSON.parse(data);
      
      // Analyser les données device
      const deviceAnalytics = this.analyzeDeviceData(stores);
      
      res.json({
        success: true,
        data: deviceAnalytics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Error in getDeviceAnalytics:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur analyse device'
      });
    }
  }

  /**
   * GET /api/analytics/performance - Analytics performance
   */
  async getPerformanceAnalytics(req, res) {
    try {
      const storesPath = path.join(__dirname, '../data/stores.json');
      const data = await fs.readFile(storesPath, 'utf8');
      const stores = JSON.parse(data);
      
      // Analyser les performances
      const performanceAnalytics = this.analyzePerformanceData(stores);
      
      res.json({
        success: true,
        data: performanceAnalytics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Error in getPerformanceAnalytics:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur analyse performance'
      });
    }
  }

  /**
   * GET /api/analytics/patterns - Patterns d'usage
   */
  async getUsagePatterns(req, res) {
    try {
      const storesPath = path.join(__dirname, '../data/stores.json');
      const data = await fs.readFile(storesPath, 'utf8');
      const stores = JSON.parse(data);
      
      // Analyser les patterns d'usage
      const usagePatterns = this.analyzeUsagePatterns(stores);
      
      res.json({
        success: true,
        data: usagePatterns,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Error in getUsagePatterns:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur analyse patterns'
      });
    }
  }

  /**
   * GET /api/analytics/crashes - Analytics crashes
   */
  async getCrashAnalytics(req, res) {
    try {
      const storesPath = path.join(__dirname, '../data/stores.json');
      const data = await fs.readFile(storesPath, 'utf8');
      const stores = JSON.parse(data);
      
      // Analyser les crashes
      const crashAnalytics = this.analyzeCrashData(stores);
      
      res.json({
        success: true,
        data: crashAnalytics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Error in getCrashAnalytics:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur analyse crashes'
      });
    }
  }

  /**
   * GET /api/analytics/dashboard - Dashboard complet
   */
  async getDashboard(req, res) {
    try {
      const storesPath = path.join(__dirname, '../data/stores.json');
      const data = await fs.readFile(storesPath, 'utf8');
      const stores = JSON.parse(data);
      
      // Créer un dashboard complet
      const dashboard = {
        overview: this.getOverviewMetrics(stores),
        behavior: this.analyzeBehaviorData(stores),
        device: this.analyzeDeviceData(stores),
        performance: this.analyzePerformanceData(stores),
        patterns: this.analyzeUsagePatterns(stores),
        crashes: this.analyzeCrashData(stores),
        recommendations: this.generateRecommendations(stores)
      };
      
      res.json({
        success: true,
        data: dashboard,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Error in getDashboard:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur génération dashboard'
      });
    }
  }

  /**
   * Analyser les données comportementales
   */
  analyzeBehaviorData(stores) {
    const behaviorData = {
      totalInteractions: 0,
      screenUsage: {},
      interactionTypes: {},
      sessionPatterns: {},
      engagementLevels: {},
      navigationFlows: []
    };

    stores.forEach(store => {
      const behavior = store.stores?.behaviorStore;
      if (!behavior) return;

      // Interactions totales
      behaviorData.totalInteractions += behavior.behaviors?.length || 0;

      // Analyse des patterns
      if (behavior.patterns) {
        // Navigation
        Object.entries(behavior.patterns.navigation || {}).forEach(([screen, count]) => {
          const screenName = screen.replace('nav_', '');
          behaviorData.screenUsage[screenName] = (behaviorData.screenUsage[screenName] || 0) + count;
        });

        // Types d'interactions
        Object.entries(behavior.patterns.interactions || {}).forEach(([interaction, count]) => {
          behaviorData.interactionTypes[interaction] = (behaviorData.interactionTypes[interaction] || 0) + count;
        });
      }

      // Analyse de l'engagement
      if (behavior.analysis?.engagement) {
        const level = behavior.analysis.engagement.engagementLevel;
        behaviorData.engagementLevels[level] = (behaviorData.engagementLevels[level] || 0) + 1;
      }
    });

    // Calculer les top écrans
    behaviorData.topScreens = Object.entries(behaviorData.screenUsage)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([screen, count]) => ({ screen, count }));

    // Calculer les top interactions
    behaviorData.topInteractions = Object.entries(behaviorData.interactionTypes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([interaction, count]) => ({ interaction, count }));

    return behaviorData;
  }

  /**
   * Analyser les données device
   */
  analyzeDeviceData(stores) {
    const deviceData = {
      platforms: {},
      models: {},
      osVersions: {},
      screenSizes: {},
      networkTypes: {},
      batteryLevels: {},
      performanceScores: []
    };

    stores.forEach(store => {
      const device = store.stores?.deviceStore;
      if (!device) return;

      // Informations device
      if (device.device) {
        const { platform, model, platformVersion } = device.device;
        
        deviceData.platforms[platform] = (deviceData.platforms[platform] || 0) + 1;
        deviceData.models[model] = (deviceData.models[model] || 0) + 1;
        deviceData.osVersions[platformVersion] = (deviceData.osVersions[platformVersion] || 0) + 1;

        // Taille d'écran
        const screenSize = `${device.device.screenWidth}x${device.device.screenHeight}`;
        deviceData.screenSizes[screenSize] = (deviceData.screenSizes[screenSize] || 0) + 1;
      }

      // Réseau
      if (device.network?.current) {
        const networkType = device.network.current.type;
        deviceData.networkTypes[networkType] = (deviceData.networkTypes[networkType] || 0) + 1;
      }

      // Batterie
      if (device.battery?.current) {
        const batteryLevel = Math.floor(device.battery.current.level / 20) * 20; // Groupes de 20%
        const batteryRange = `${batteryLevel}-${batteryLevel + 19}%`;
        deviceData.batteryLevels[batteryRange] = (deviceData.batteryLevels[batteryRange] || 0) + 1;
      }

      // Score de performance
      if (device.analysis?.overallScore) {
        deviceData.performanceScores.push(device.analysis.overallScore.score);
      }
    });

    // Calculer les moyennes
    if (deviceData.performanceScores.length > 0) {
      deviceData.avgPerformanceScore = Math.round(
        deviceData.performanceScores.reduce((sum, score) => sum + score, 0) / deviceData.performanceScores.length
      );
    }

    return deviceData;
  }

  /**
   * Analyser les données de performance
   */
  analyzePerformanceData(stores) {
    const performanceData = {
      avgRenderTime: 0,
      avgFPS: 0,
      memoryUsage: [],
      networkLatencies: [],
      crashRates: {},
      performanceIssues: []
    };

    let renderTimes = [];
    let fpsList = [];

    stores.forEach(store => {
      const device = store.stores?.deviceStore;
      if (!device) return;

      // Performance
      if (device.performance?.current) {
        const perf = device.performance.current;
        if (perf.renderTime) renderTimes.push(perf.renderTime);
        if (perf.estimatedFPS) fpsList.push(perf.estimatedFPS);
        if (perf.jsHeapSizeUsed) performanceData.memoryUsage.push(perf.jsHeapSizeUsed);
      }

      // Réseau
      if (device.network?.current?.latency && device.network.current.latency > 0) {
        performanceData.networkLatencies.push(device.network.current.latency);
      }

      // Crashes
      if (device.crashes) {
        const crashCount = device.crashes.length;
        const crashLevel = crashCount === 0 ? 'none' : crashCount < 3 ? 'low' : 'high';
        performanceData.crashRates[crashLevel] = (performanceData.crashRates[crashLevel] || 0) + 1;
      }
    });

    // Calculer les moyennes
    if (renderTimes.length > 0) {
      performanceData.avgRenderTime = Math.round(renderTimes.reduce((sum, time) => sum + time, 0) / renderTimes.length);
    }

    if (fpsList.length > 0) {
      performanceData.avgFPS = Math.round(fpsList.reduce((sum, fps) => sum + fps, 0) / fpsList.length);
    }

    if (performanceData.networkLatencies.length > 0) {
      performanceData.avgNetworkLatency = Math.round(
        performanceData.networkLatencies.reduce((sum, lat) => sum + lat, 0) / performanceData.networkLatencies.length
      );
    }

    // Identifier les problèmes
    if (performanceData.avgFPS < 30) {
      performanceData.performanceIssues.push('FPS faible détecté');
    }
    if (performanceData.avgNetworkLatency > 1000) {
      performanceData.performanceIssues.push('Latence réseau élevée');
    }

    return performanceData;
  }

  /**
   * Analyser les patterns d'usage
   */
  analyzeUsagePatterns(stores) {
    const patterns = {
      timePatterns: {},
      dayPatterns: {},
      sessionDurations: [],
      featureUsage: {},
      userJourneys: []
    };

    stores.forEach(store => {
      const behavior = store.stores?.behaviorStore;
      const engagement = store.stores?.engagementStore;
      
      if (!behavior) return;

      // Patterns temporels
      if (behavior.sessionInfo) {
        const sessionDuration = behavior.sessionInfo.sessionDuration / 1000 / 60; // en minutes
        patterns.sessionDurations.push(sessionDuration);

        // Heure d'utilisation (approximative)
        const hour = new Date().getHours();
        patterns.timePatterns[hour] = (patterns.timePatterns[hour] || 0) + 1;
      }

      // Usage des fonctionnalités
      if (engagement?.metrics) {
        const metrics = engagement.metrics;
        patterns.featureUsage.conversations = (patterns.featureUsage.conversations || 0) + (metrics.conversationsStarted || 0);
        patterns.featureUsage.notebook = (patterns.featureUsage.notebook || 0) + (metrics.notebookEntriesCreated || 0);
        patterns.featureUsage.cycle = (patterns.featureUsage.cycle || 0) + (metrics.cycleTrackedDays || 0);
      }
    });

    // Calculer les moyennes
    if (patterns.sessionDurations.length > 0) {
      patterns.avgSessionDuration = Math.round(
        patterns.sessionDurations.reduce((sum, duration) => sum + duration, 0) / patterns.sessionDurations.length
      );
    }

    return patterns;
  }

  /**
   * Analyser les données de crash
   */
  analyzeCrashData(stores) {
    const crashData = {
      totalCrashes: 0,
      crashTypes: {},
      crashTrends: {},
      topErrors: [],
      crashByDevice: {},
      crashByOS: {}
    };

    const allCrashes = [];

    stores.forEach(store => {
      const device = store.stores?.deviceStore;
      if (!device?.crashes) return;

      device.crashes.forEach(crash => {
        crashData.totalCrashes++;
        allCrashes.push(crash);

        // Types d'erreurs
        const errorType = crash.error?.name || 'Unknown';
        crashData.crashTypes[errorType] = (crashData.crashTypes[errorType] || 0) + 1;

        // Crash par device
        const deviceModel = crash.device?.model || 'Unknown';
        crashData.crashByDevice[deviceModel] = (crashData.crashByDevice[deviceModel] || 0) + 1;

        // Crash par OS
        const osVersion = crash.device?.platformVersion || 'Unknown';
        crashData.crashByOS[osVersion] = (crashData.crashByOS[osVersion] || 0) + 1;
      });
    });

    // Top erreurs
    crashData.topErrors = Object.entries(crashData.crashTypes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([error, count]) => ({ error, count }));

    // Taux de crash
    const totalUsers = stores.length;
    crashData.crashRate = totalUsers > 0 ? (crashData.totalCrashes / totalUsers).toFixed(2) : 0;

    return crashData;
  }

  /**
   * Métriques d'overview
   */
  getOverviewMetrics(stores) {
    return {
      totalUsers: stores.length,
      totalInteractions: stores.reduce((sum, store) => {
        return sum + (store.stores?.behaviorStore?.behaviors?.length || 0);
      }, 0),
      totalCrashes: stores.reduce((sum, store) => {
        return sum + (store.stores?.deviceStore?.crashes?.length || 0);
      }, 0),
      avgEngagement: stores.reduce((sum, store) => {
        return sum + (store.stores?.engagementStore?.metrics?.daysUsed || 0);
      }, 0) / stores.length,
      platformDistribution: this.getPlatformDistribution(stores)
    };
  }

  /**
   * Distribution des plateformes
   */
  getPlatformDistribution(stores) {
    const platforms = {};
    stores.forEach(store => {
      const platform = store.stores?.deviceStore?.device?.platform || 'unknown';
      platforms[platform] = (platforms[platform] || 0) + 1;
    });
    return platforms;
  }

  /**
   * Générer des recommandations
   */
  generateRecommendations(stores) {
    const recommendations = [];
    
    // Analyser les performances
    const performanceData = this.analyzePerformanceData(stores);
    if (performanceData.avgFPS < 30) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        message: 'FPS moyen faible détecté - optimiser les animations',
        metric: `${performanceData.avgFPS} FPS`
      });
    }

    // Analyser les crashes
    const crashData = this.analyzeCrashData(stores);
    if (crashData.crashRate > 0.1) {
      recommendations.push({
        type: 'stability',
        priority: 'critical',
        message: 'Taux de crash élevé - corriger les bugs critiques',
        metric: `${crashData.crashRate} crashes/user`
      });
    }

    // Analyser l'engagement
    const behaviorData = this.analyzeBehaviorData(stores);
    if (behaviorData.totalInteractions / stores.length < 10) {
      recommendations.push({
        type: 'engagement',
        priority: 'medium',
        message: 'Engagement faible - améliorer l\'UX',
        metric: `${Math.round(behaviorData.totalInteractions / stores.length)} interactions/user`
      });
    }

    return recommendations;
  }
}

module.exports = new AdvancedAnalyticsController(); 