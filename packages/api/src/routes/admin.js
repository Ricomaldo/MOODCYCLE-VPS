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
  saveClosings
} = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

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

module.exports = router;