// src/server.js - version cohérente avec ton architecture
// API Version 1.0.2 - Hook test deployment

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const claudeRateLimit = require('./middleware/claudeRateLimit');
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
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../admin/dist/index.html'));
});

const chatRoutes = require('./routes/chat');
const adminRoutes = require('./routes/admin');

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
