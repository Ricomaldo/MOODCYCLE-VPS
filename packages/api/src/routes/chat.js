// routes/chat.js
const express = require('express');
const { handleChat } = require('../controllers/chatController');
const deviceAuth = require('../middleware/deviceAuth');

const router = express.Router();

router.post('/chat', deviceAuth, handleChat);

module.exports = router;