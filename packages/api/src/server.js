// src/server.js - version cohérente avec ton architecture
// API Version 1.0.2 - Hook test deployment

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const claudeRateLimit = require('./middleware/claudeRateLimit');
require('dotenv').config();

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

// Routes chat - SANS /api prefix
const chatRoutes = require('./routes/chat');

// Rate limiting appliqué à toutes les routes (filtré par skip dans claudeRateLimit)
app.use(claudeRateLimit);
app.use('/', chatRoutes);

// Routes admin - SANS /api prefix  
const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`🌟 MoodCycle API running on port ${PORT}`);
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});// Deploy test - Architecture VPS validée Mon Jun 16 22:33:14 CEST 2025
// Hook test Wed Jun 18 14:57:28 CEST 2025
// Hook fix Wed Jun 18 15:10:55 CEST 2025
// Hook test final Wed Jun 18 15:16:06 CEST 2025
