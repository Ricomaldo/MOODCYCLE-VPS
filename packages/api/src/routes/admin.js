// routes/admin.js
const express = require('express');
const { 
  getInsights, 
  saveInsights, 
  getPhases,
  getClosings, 
  adminLogin 
} = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Auth (pas de middleware)
router.post('/auth', adminLogin);

// Routes protégées
router.get('/insights', adminAuth, getInsights);
router.post('/insights', adminAuth, saveInsights);
router.get('/phases', adminAuth, getPhases);
router.get('/closings', adminAuth, getClosings);

module.exports = router;