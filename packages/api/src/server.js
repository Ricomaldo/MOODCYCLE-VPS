// src/server.js - version cohérente avec ton architecture
// API Version 1.0.2 - Hook test deployment

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const claudeRateLimit = require('./middleware/claudeRateLimit');
const deviceAuth = require('./middleware/deviceAuth');
const fs = require('fs').promises;
require('dotenv').config();

// Test nouveau système de déploiement
const app = express();

// Fix trust proxy AVANT tout middleware
app.set('trust proxy', 1);

// Debug startup
console.log('🚀 MoodCycle API starting...');

const PORT = process.env.PORT || 4000;

// Middleware sécurité
app.use(helmet());
app.use(cors({
  origin: true,
  methods: ['POST', 'GET'],
  allowedHeaders: ['Content-Type', 'X-Device-ID', 'Authorization']
}));


app.use(express.json());

// Dans server.js, après app.use(express.json())
app.use((req, res, next) => {
  console.log(`🔍 ${new Date().toLocaleString('fr-FR', {timeZone: 'Europe/Paris'})} - ${req.method} ${req.originalUrl}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body keys:', Object.keys(req.body));
    if (req.body.insights) {
      console.log('Insights count:', req.body.insights.length);
    }
  }
  next();
});

// Serve static files for admin interface
app.use('/admin', express.static(path.join(__dirname, '../../admin/dist')));

// Handle admin routes for client-side routing
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../../admin/dist/index.html'));
});

const chatRoutes = require('./routes/chat');
const adminRoutes = require('./routes/admin');

// ✅ ENDPOINTS SÉCURISÉS POUR APP MOBILE (avec deviceAuth)
// Ces endpoints sont protégés par X-Device-ID, pas accessibles depuis web

app.get('/api/insights', deviceAuth, async (req, res) => {
  try {
    const insightsPath = path.join(__dirname, 'data/insights.json');
    const data = await fs.readFile(insightsPath, 'utf8');
    const insights = JSON.parse(data);
    
    res.json({ 
      success: true,
      data: insights,
      deviceId: req.deviceId // Pour debug
    });
  } catch (error) {
    console.error('❌ Error reading insights:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lecture insights' 
    });
  }
});

app.get('/api/phases', deviceAuth, async (req, res) => {
  try {
    const phasesPath = path.join(__dirname, 'data/phases.json');
    const data = await fs.readFile(phasesPath, 'utf8');
    const phases = JSON.parse(data);
    
    res.json({ 
      success: true,
      data: phases,
      deviceId: req.deviceId
    });
  } catch (error) {
    console.error('❌ Error reading phases:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lecture phases' 
    });
  }
});

app.get('/api/closings', deviceAuth, async (req, res) => {
  try {
    const closingsPath = path.join(__dirname, 'data/closings.json');
    const data = await fs.readFile(closingsPath, 'utf8');
    const closings = JSON.parse(data);
    
    res.json({ 
      success: true,
      data: closings,
      deviceId: req.deviceId
    });
  } catch (error) {
    console.error('❌ Error reading closings:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lecture closings' 
    });
  }
});

app.get('/api/vignettes', deviceAuth, async (req, res) => {
  try {
    const vignettesPath = path.join(__dirname, 'data/vignettes.json');
    const data = await fs.readFile(vignettesPath, 'utf8');
    const vignettes = JSON.parse(data);
    
    res.json({ 
      success: true,
      data: vignettes,
      deviceId: req.deviceId
    });
  } catch (error) {
    console.error('❌ Error reading vignettes:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lecture vignettes' 
    });
  }
});

app.use(claudeRateLimit);
app.use('/api', chatRoutes);
app.use('/api/admin', adminRoutes);

// Root route handler
app.get('/', (req, res) => {
  res.redirect('/admin');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(PORT, () => {
  console.log(`🌟 MoodCycle API running on port ${PORT}`);
});
