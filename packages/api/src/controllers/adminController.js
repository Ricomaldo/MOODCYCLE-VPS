// controllers/adminController.js
const fs = require('fs').promises;
const path = require('path');
const jwt = require('jsonwebtoken');



class AdminController {
  
  // GET /api/admin/insights - Lire les 178 insights de base
  async getInsights(req, res) {
    try {
      const insightsPath = path.join(__dirname, '../data/insights_validated.json');
      const data = await fs.readFile(insightsPath, 'utf8');
      const insights = JSON.parse(data);
      
      res.json({
        success: true,
        data: {
          total: Object.values(insights).flat().length,
          insights: insights
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erreur lecture insights'
      });
    }
  }

  // POST /api/admin/insights - Sauvegarder variants Jeza
  async saveInsights(req, res) {
    try {
      const { insightId, variants } = req.body;
      
      // Validation des 5 personas
      const requiredPersonas = ['emma', 'laure', 'sylvie', 'christine', 'clara'];
      for (const persona of requiredPersonas) {
        if (!variants[persona]) {
          return res.status(400).json({
            success: false,
            error: `Variant manquant pour persona: ${persona}`
          });
        }
      }
      
      // TODO: Logique sauvegarde (Sprint dimanche)
      res.json({
        success: true,
        data: { insightId, variantsCreated: 5 }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erreur sauvegarde insights'
      });
    }
  }

  // GET /api/admin/phases - Lire phases.json
  async getPhases(req, res) {
    try {
      const phasesPath = path.join(__dirname, '../data/phases.json');
      const data = await fs.readFile(phasesPath, 'utf8');
      
      res.json({
        success: true,
        data: JSON.parse(data)
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erreur lecture phases'
      });
    }
  }

  // GET /api/admin/closings - Lire persona-closings.json
  async getClosings(req, res) {
    try {
      const closingsPath = path.join(__dirname, '../data/persona-closings.json');
      const data = await fs.readFile(closingsPath, 'utf8');
      
      res.json({
        success: true,
        data: JSON.parse(data)
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erreur lecture closings'
      });
    }
  }

  // POST /api/admin/auth - Login Jeza
  async adminLogin(req, res) {
    try {
      const { username, password } = req.body;
      
      // Auth simple codée en dur (MVP)
      if (username === 'jeza' && password === process.env.JEZA_PASSWORD) {
        const token = jwt.sign(
          { username, role: 'admin' },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );
        
        res.json({
          success: true,
          token,
          user: { username, role: 'admin' }
        });
      } else {
        res.status(401).json({
          success: false,
          error: 'Identifiants invalides'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erreur authentification'
      });
    }
  }
}

const adminController = new AdminController();

module.exports = {
  getInsights: adminController.getInsights.bind(adminController),
  saveInsights: adminController.saveInsights.bind(adminController),
  getPhases: adminController.getPhases.bind(adminController),
  getClosings: adminController.getClosings.bind(adminController),
  adminLogin: adminController.adminLogin.bind(adminController)
};
