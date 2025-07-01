// src/server.js - version cohérente avec ton architecture
// API Version 1.0.2 - Hook test deployment

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const claudeRateLimit = require('./middleware/claudeRateLimit');
const rateLimit = require('express-rate-limit');
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

const chatRoutes = require('./routes/chat');

app.use(claudeRateLimit);
app.use('/api', chatRoutes);

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`🌟 MoodCycle API running on port ${PORT}`);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});
