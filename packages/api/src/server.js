// src/server.js - version corrigée
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const deviceAuth = require('./middleware/deviceAuth'); // ADD
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware sécurité
app.use(helmet());
app.use(cors({
  origin: true,
  methods: ['POST', 'GET'],
  allowedHeaders: ['Content-Type', 'X-Device-ID', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Rate limit exceeded' }
});

app.use(limiter);
app.use(express.json());

// Route chat avec auth
const { handleChat } = require('./controllers/chatController');
app.post('/api/chat', deviceAuth, handleChat); // ADD deviceAuth

app.listen(PORT, () => {
  console.log(`🌟 MoodCycle API running on port ${PORT}`);
});