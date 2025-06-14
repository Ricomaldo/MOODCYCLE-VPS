// middleware/deviceAuth.js
const jwt = require('jsonwebtoken');

const deviceAuth = (req, res, next) => {
  const deviceId = req.headers['x-device-id'];
  
  if (!deviceId) {
    return res.status(401).json({ 
      success: false,
      error: { code: 'DEVICE_ID_REQUIRED', message: 'Device ID manquant' }
    });
  }

  // Stocker deviceId dans req pour usage dans controller
  req.deviceId = deviceId;
  req.isNewSession = true; // Simplifié pour cette couche
  req.sessionToken = 'temp-token'; // Simplifié

  next();
};

module.exports = deviceAuth;