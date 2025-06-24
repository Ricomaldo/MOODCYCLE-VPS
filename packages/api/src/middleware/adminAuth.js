// middleware/adminAuth.js
const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token requis'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // ✅ NOUVEAU: Accepter les rôles admin
    const validRoles = ['super_admin', 'content_editor', 'admin']; // Backward compatibility
    if (!validRoles.includes(decoded.role)) {
      return res.status(403).json({
        success: false,
        error: 'Accès refusé - Rôle invalide'
      });
    }
    
    req.user = decoded;
    next();
    
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token invalide'
    });
  }
};

// ✅ NOUVEAU: Middleware pour vérifier permissions spécifiques
const requirePermission = (permission) => {
  return (req, res, next) => {
    const user = req.user;
    
    // Super admin a toutes les permissions
    if (user.role === 'super_admin' || user.permissions?.includes('all')) {
      return next();
    }
    
    // Vérifier permission spécifique
    if (!user.permissions?.includes(permission)) {
      return res.status(403).json({
        success: false,
        error: `Accès refusé - Permission '${permission}' requise`
      });
    }
    
    next();
  };
};

module.exports = adminAuth;
module.exports.requirePermission = requirePermission;