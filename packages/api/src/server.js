// src/server.js - version cohérente avec ton architecture
// API Version 1.0.2 - Hook test deployment

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
app.set('trust proxy', true);

const PORT = process.env.PORT || 4000;

// Middleware sécurité
app.use(helmet());
app.use(cors({
  origin: true,
  methods: ['POST', 'GET'],
  allowedHeaders: ['Content-Type', 'X-Device-ID', 'Authorization']
}));

app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Rate limit exceeded' }
}));

app.use(express.json());

// Routes chat existantes
const chatRoutes = require('./routes/chat');
app.use('/api', chatRoutes);

// Nouvelles routes admin
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`🌟 MoodCycle API running on port ${PORT}`);
});

