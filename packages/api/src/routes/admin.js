// routes/admin.js
const express = require('express');
const { 
  getInsights, 
  saveInsights,
  saveAllInsights, 
  getPhases,
  getClosings, 
  adminLogin,
  savePhases,
  saveClosings,
  getVignettes,
  saveVignettes
} = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');
const ConversationCache = require('../services/ConversationCache');
const budgetProtection = require('../services/BudgetProtection');

const router = express.Router();

// Et dans routes/admin.js, ajoute ce middleware spécifique
router.use((req, res, next) => {
  console.log('🎯 Admin route hit:', req.method, req.path);
  console.log('Auth header:', req.headers.authorization);
  next();
});

// Auth (pas de middleware)
router.post('/auth', adminLogin);

// Routes protégées
router.get('/insights', adminAuth, getInsights);
router.post('/insights/bulk', adminAuth, saveAllInsights);
router.post('/insights', adminAuth, saveInsights);
router.get('/phases', adminAuth, getPhases);
router.post('/phases', adminAuth, savePhases);
router.get('/closings', adminAuth, getClosings);
router.post('/closings', adminAuth, saveClosings);
router.get('/vignettes', getVignettes); // Lecture publique
router.post('/vignettes', adminAuth, saveVignettes);

// ✅ NOUVEAU: Endpoint stats cache
router.get('/cache-stats', adminAuth, (req, res) => {
  try {
    const stats = ConversationCache.getStats();
    res.json({
      ...stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Erreur récupération stats cache:', error);
    res.status(500).json({
      error: 'CACHE_STATS_ERROR',
      message: 'Impossible de récupérer les statistiques du cache'
    });
  }
});

// ✅ NOUVEAU: Endpoint pour vider le cache (admin)
router.delete('/cache', adminAuth, (req, res) => {
  try {
    const clearedDevices = ConversationCache.clear();
    res.json({
      message: 'Cache vidé avec succès',
      devices_cleared: clearedDevices,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Erreur vidage cache:', error);
    res.status(500).json({
      error: 'CACHE_CLEAR_ERROR',
      message: 'Impossible de vider le cache'
    });
  }
});
router.get('/budget-status', adminAuth, (req, res) => {
  try {
    const status = budgetProtection.getBudgetStatus();
    res.json({
      budgets: status,
      timestamp: new Date().toISOString(),
      alerts: budgetProtection.checkAlerts ? budgetProtection.checkAlerts() : []
    });
  } catch (error) {
    console.error('❌ Erreur récupération budget:', error);
    res.status(500).json({
      error: 'BUDGET_STATUS_ERROR',
      message: 'Impossible de récupérer le statut budget'
    });
  }
});
module.exports = router;