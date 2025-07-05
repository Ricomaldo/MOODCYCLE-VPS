const fs = require('fs').promises;
const path = require('path');

/**
 * Middleware de logging spécialisé pour les analytics
 * Enregistre les requêtes, réponses, erreurs et métriques de performance
 */

class AnalyticsLogger {
  constructor() {
    this.logDir = path.join(__dirname, '../../../logs');
    this.analyticsLogFile = path.join(this.logDir, 'analytics.log');
    this.errorLogFile = path.join(this.logDir, 'analytics-errors.log');
    this.performanceLogFile = path.join(this.logDir, 'analytics-performance.log');
    
    this.initLogDirectory();
  }

  async initLogDirectory() {
    try {
      await fs.mkdir(this.logDir, { recursive: true });
    } catch (error) {
      console.error('❌ Erreur création répertoire logs:', error);
    }
  }

  /**
   * Formater un log avec timestamp et métadonnées
   */
  formatLog(level, category, message, metadata = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      category,
      message,
      ...metadata
    };
    
    return JSON.stringify(logEntry) + '\n';
  }

  /**
   * Écrire dans un fichier de log
   */
  async writeLog(filePath, content) {
    try {
      await fs.appendFile(filePath, content);
    } catch (error) {
      console.error(`❌ Erreur écriture log ${filePath}:`, error);
    }
  }

  /**
   * Logger une requête analytics
   */
  async logRequest(req, res, responseTime, success, error = null) {
    const logData = {
      method: req.method,
      url: req.originalUrl,
      deviceId: req.headers['x-device-id'],
      userAgent: req.headers['user-agent'],
      ip: req.ip,
      responseTime: `${responseTime}ms`,
      statusCode: res.statusCode,
      success,
      timestamp: new Date().toISOString()
    };

    if (error) {
      logData.error = {
        message: error.message,
        stack: error.stack
      };
    }

    // Log général
    const logEntry = this.formatLog('INFO', 'REQUEST', `${req.method} ${req.originalUrl}`, logData);
    await this.writeLog(this.analyticsLogFile, logEntry);

    // Log erreur si nécessaire
    if (error) {
      const errorEntry = this.formatLog('ERROR', 'REQUEST_ERROR', error.message, logData);
      await this.writeLog(this.errorLogFile, errorEntry);
    }

    // Log performance si lent
    if (responseTime > 1000) {
      const perfEntry = this.formatLog('WARN', 'SLOW_REQUEST', `Requête lente: ${responseTime}ms`, logData);
      await this.writeLog(this.performanceLogFile, perfEntry);
    }
  }

  /**
   * Logger les métriques de données
   */
  async logDataMetrics(endpoint, dataSize, processingTime, recordCount) {
    const logData = {
      endpoint,
      dataSize: `${dataSize} bytes`,
      processingTime: `${processingTime}ms`,
      recordCount,
      timestamp: new Date().toISOString()
    };

    const logEntry = this.formatLog('INFO', 'DATA_METRICS', `Données traitées pour ${endpoint}`, logData);
    await this.writeLog(this.performanceLogFile, logEntry);
  }

  /**
   * Logger les erreurs d'analyse
   */
  async logAnalysisError(analysisType, error, context = {}) {
    const logData = {
      analysisType,
      error: {
        message: error.message,
        stack: error.stack
      },
      context,
      timestamp: new Date().toISOString()
    };

    const logEntry = this.formatLog('ERROR', 'ANALYSIS_ERROR', `Erreur analyse ${analysisType}`, logData);
    await this.writeLog(this.errorLogFile, logEntry);
  }

  /**
   * Logger les recommandations générées
   */
  async logRecommendations(recommendations, analysisContext) {
    const logData = {
      recommendationsCount: recommendations.length,
      priorities: recommendations.reduce((acc, rec) => {
        acc[rec.priority] = (acc[rec.priority] || 0) + 1;
        return acc;
      }, {}),
      analysisContext,
      timestamp: new Date().toISOString()
    };

    const logEntry = this.formatLog('INFO', 'RECOMMENDATIONS', `${recommendations.length} recommandations générées`, logData);
    await this.writeLog(this.analyticsLogFile, logEntry);
  }

  /**
   * Middleware Express pour les routes analytics
   */
  middleware() {
    return async (req, res, next) => {
      // Vérifier si c'est une route analytics
      if (!req.originalUrl.includes('/api/analytics')) {
        return next();
      }

      const startTime = Date.now();
      
      // Intercepter la réponse
      const originalSend = res.send;
      let responseBody = null;
      let success = false;

      res.send = function(body) {
        responseBody = body;
        success = res.statusCode >= 200 && res.statusCode < 400;
        return originalSend.call(this, body);
      };

      // Intercepter les erreurs
      const originalNext = next;
      next = (error) => {
        if (error) {
          const responseTime = Date.now() - startTime;
          analyticsLogger.logRequest(req, res, responseTime, false, error);
        }
        return originalNext(error);
      };

      // Continuer le traitement
      res.on('finish', async () => {
        const responseTime = Date.now() - startTime;
        await this.logRequest(req, res, responseTime, success);

        // Logger les métriques de données si disponibles
        if (responseBody && success) {
          try {
            const parsed = JSON.parse(responseBody);
            if (parsed.data) {
              const dataSize = JSON.stringify(parsed.data).length;
              const recordCount = Array.isArray(parsed.data) ? parsed.data.length : 1;
              await this.logDataMetrics(req.originalUrl, dataSize, responseTime, recordCount);
            }
          } catch (e) {
            // Ignore les erreurs de parsing
          }
        }
      });

      next();
    };
  }

  /**
   * Nettoyer les anciens logs (garder 7 jours)
   */
  async cleanupOldLogs() {
    const logFiles = [this.analyticsLogFile, this.errorLogFile, this.performanceLogFile];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7);

    for (const logFile of logFiles) {
      try {
        const stats = await fs.stat(logFile);
        if (stats.mtime < cutoffDate) {
          await fs.writeFile(logFile, ''); // Vider le fichier
          console.log(`🧹 Log nettoyé: ${path.basename(logFile)}`);
        }
      } catch (error) {
        // Fichier n'existe pas, ignorer
      }
    }
  }

  /**
   * Obtenir les statistiques des logs
   */
  async getLogStats() {
    const stats = {
      analytics: { size: 0, lines: 0 },
      errors: { size: 0, lines: 0 },
      performance: { size: 0, lines: 0 }
    };

    const logFiles = [
      { key: 'analytics', path: this.analyticsLogFile },
      { key: 'errors', path: this.errorLogFile },
      { key: 'performance', path: this.performanceLogFile }
    ];

    for (const { key, path: logPath } of logFiles) {
      try {
        const fileStats = await fs.stat(logPath);
        const content = await fs.readFile(logPath, 'utf8');
        
        stats[key] = {
          size: fileStats.size,
          lines: content.split('\n').filter(line => line.trim()).length,
          lastModified: fileStats.mtime
        };
      } catch (error) {
        // Fichier n'existe pas
      }
    }

    return stats;
  }
}

// Instance singleton
const analyticsLogger = new AnalyticsLogger();

// Nettoyer les logs au démarrage
analyticsLogger.cleanupOldLogs();

module.exports = analyticsLogger; 