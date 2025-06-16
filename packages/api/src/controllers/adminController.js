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

  // POST /api/admin/insights/bulk - Sauvegarder tous les insights de base
  async saveAllInsights(req, res) {
    console.log('🔥 saveAllInsights called');
    console.log('Body type:', typeof req.body);
    console.log('Insights count:', req.body.insights?.length);
    
    try {
      const { insights } = req.body;
      
      if (!insights || !Array.isArray(insights)) {
        console.log('❌ Invalid format - not array:', typeof insights);
        return res.status(400).json({
          success: false,
          error: 'Format insights invalide - array attendu'
        });
      }

      const insightsPath = path.join(__dirname, '../data/insights_validated.json');
      
      // Lire le fichier existant structuré par phases
      const data = await fs.readFile(insightsPath, 'utf8');
      const fileData = JSON.parse(data);
      
      // Le fichier a une structure wrapper avec les vraies phases dans fileData.insights
      const existingInsights = fileData.insights || fileData;
      
      console.log('📁 File structure:', Object.keys(fileData));
      console.log('📁 Insight phases:', Object.keys(existingInsights));
      
      let updatedCount = 0;
      
      // DEBUG : Voir les premiers IDs reçus et ceux du fichier
      console.log('📋 First 3 IDs received:', insights.slice(0, 3).map(i => i.id));
      console.log('📋 First 3 IDs in menstrual phase:', existingInsights.menstrual?.slice(0, 3).map(i => i.id));
      
      // Pour chaque insight du tableau plat, trouver dans quelle phase il est
      insights.forEach(updatedInsight => {
        let found = false;
        
        // Chercher dans toutes les phases
        for (const phase in existingInsights) {
          if (Array.isArray(existingInsights[phase])) {
            const insightIndex = existingInsights[phase].findIndex(
              insight => insight.id === updatedInsight.id
            );
            
            if (insightIndex !== -1) {
              console.log(`✅ Updating ${updatedInsight.id} in phase ${phase}`);
              existingInsights[phase][insightIndex] = {
                ...existingInsights[phase][insightIndex],
                ...updatedInsight,
                lastModified: new Date().toISOString(),
                enrichedBy: 'admin-interface'
              };
              updatedCount++;
              found = true;
              break;
            }
          }
        }
        
        if (!found) {
          console.log(`⚠️ Insight ${updatedInsight.id} not found in any phase`);
        }
      });
      
      // Remettre les insights modifiés dans la structure wrapper
      fileData.insights = existingInsights;
      
      // Sauvegarder le fichier avec la structure wrapper préservée
      await fs.writeFile(insightsPath, JSON.stringify(fileData, null, 2));
      
      console.log(`✅ Updated ${updatedCount}/${insights.length} insights`);
      
      res.json({
        success: true,
        data: { 
          total: insights.length,
          updated: updatedCount,
          message: `${updatedCount} insights mis à jour`
        }
      });
      
    } catch (error) {
      console.error('❌ Error in saveAllInsights:', error);
      res.status(500).json({
        success: false,
        error: `Erreur sauvegarde: ${error.message}`
      });
    }
  }

  // POST /api/admin/insights - Sauvegarder variants Jeza
  async saveInsights(req, res) {
    console.log('🔥 saveInsights called with:', req.body);
    console.log('Body keys:', Object.keys(req.body));
    
    try {
      const { insightId, variants, insights } = req.body;
      
      if (insightId && variants) {
        console.log('📝 Saving variants for:', insightId);
        
        // 🌟 VRAIE LOGIQUE DE SAUVEGARDE VARIANTS
        const insightsPath = path.join(__dirname, '../data/insights_validated.json');
        const data = await fs.readFile(insightsPath, 'utf8');
        const fileData = JSON.parse(data);
        
        // Le fichier a une structure wrapper avec les vraies phases dans fileData.insights
        const existingInsights = fileData.insights || fileData;
        
        // Trouver et modifier l'insight
        let found = false;
        for (const phase in existingInsights) {
          if (Array.isArray(existingInsights[phase])) {
            const insightIndex = existingInsights[phase].findIndex(insight => insight.id === insightId);
            if (insightIndex !== -1) {
              console.log(`✅ Found ${insightId} in phase ${phase}, updating variants`);
              
              // Check if baseContent is being updated
              if (variants.baseContent) {
                console.log(`📝 Updating baseContent for ${insightId}`);
                existingInsights[phase][insightIndex].baseContent = variants.baseContent;
                // Remove baseContent from variants to avoid storing it twice
                const { baseContent, ...personaVariants } = variants;
                if (Object.keys(personaVariants).length > 0) {
                  existingInsights[phase][insightIndex].personaVariants = {
                    ...existingInsights[phase][insightIndex].personaVariants,
                    ...personaVariants
                  };
                }
              } else {
                // Regular persona variants update
                existingInsights[phase][insightIndex].personaVariants = {
                  ...existingInsights[phase][insightIndex].personaVariants,
                  ...variants
                };
              }
              
              existingInsights[phase][insightIndex].status = 'enriched';
              existingInsights[phase][insightIndex].lastModified = new Date().toISOString();
              found = true;
              break;
            }
          }
        }
        
        if (!found) {
          console.log(`❌ Insight ${insightId} not found in any phase`);
          return res.status(404).json({
            success: false,
            error: 'Insight non trouvé'
          });
        }
        
        // Remettre les insights modifiés dans la structure wrapper
        fileData.insights = existingInsights;
        
        // Sauvegarder le fichier avec la structure wrapper préservée
        await fs.writeFile(insightsPath, JSON.stringify(fileData, null, 2));
        
        const variantCount = Object.keys(variants).length;
        res.json({
          success: true,
          data: { insightId, variantsCreated: variantCount }
        });
        
      } else if (insights) {
        console.log('📦 Bulk saving:', insights.length, 'insights');
        
        // 🌟 LOGIQUE BULK SAVE
        const insightsPath = path.join(__dirname, '../data/insights_validated.json');
        const data = await fs.readFile(insightsPath, 'utf8');
        const existingInsights = JSON.parse(data);
        
        // Mettre à jour chaque insight
        insights.forEach(updatedInsight => {
          for (const phase in existingInsights) {
            const insightIndex = existingInsights[phase].findIndex(insight => insight.id === updatedInsight.id);
            if (insightIndex !== -1) {
              existingInsights[phase][insightIndex] = {
                ...existingInsights[phase][insightIndex],
                ...updatedInsight,
                lastModified: new Date().toISOString()
              };
            }
          }
        });
        
        // Sauvegarder le fichier
        await fs.writeFile(insightsPath, JSON.stringify(existingInsights, null, 2));
        
        res.json({
          success: true,
          data: { updated: insights.length }
        });
        
      } else {
        console.log('❌ Invalid request structure');
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid request - need insightId+variants or insights array' 
        });
      }
      
    } catch (error) {
      console.error('❌ Error in saveInsights:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message 
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

  // POST /api/admin/phases - Sauvegarder données des phases
  async savePhases(req, res) {
    console.log('🔥 savePhases called');
    console.log('Body:', req.body);
    
    try {
      const { phases } = req.body;
      
      if (!phases || typeof phases !== 'object') {
        return res.status(400).json({
          success: false,
          error: 'Format phases invalide - objet attendu'
        });
      }

      const phasesPath = path.join(__dirname, '../data/phases.json');
      
      // ✅ LIRE LES DONNÉES EXISTANTES PUIS MERGER
      let existingPhases = {};
      try {
        const existingData = await fs.readFile(phasesPath, 'utf8');
        existingPhases = JSON.parse(existingData);
      } catch (error) {
        console.log('📝 No existing phases file, creating new one');
      }
      
      // ✅ MERGER PROFONDÉMENT les nouvelles données avec les existantes
      const mergedPhases = { ...existingPhases };
      
      // Pour chaque phase dans les nouvelles données
      Object.keys(phases).forEach(phaseId => {
        if (mergedPhases[phaseId]) {
          // Merge profond : garder les propriétés existantes et ajouter/modifier les nouvelles
          mergedPhases[phaseId] = { ...mergedPhases[phaseId], ...phases[phaseId] };
        } else {
          // Nouvelle phase : ajouter complètement
          mergedPhases[phaseId] = phases[phaseId];
        }
      });
      
      // ✅ SAUVEGARDER LA STRUCTURE COMPLÈTE
      await fs.writeFile(phasesPath, JSON.stringify(mergedPhases, null, 2));
      
      console.log('✅ Phases saved successfully');
      console.log('📊 Total phases:', Object.keys(mergedPhases).length);
      
      res.json({
        success: true,
        data: { 
          message: 'Phases sauvegardées avec succès',
          phasesCount: Object.keys(phases).length,
          totalPhases: Object.keys(mergedPhases).length
        }
      });
      
    } catch (error) {
      console.error('❌ Error in savePhases:', error);
      res.status(500).json({
        success: false,
        error: `Erreur sauvegarde phases: ${error.message}`
      });
    }
  }

  // POST /api/admin/closings - Sauvegarder données des closings
  async saveClosings(req, res) {
    console.log('🔥 saveClosings called');
    console.log('Body:', req.body);
    
    try {
      const { closings } = req.body;
      
      if (!closings || typeof closings !== 'object') {
        return res.status(400).json({
          success: false,
          error: 'Format closings invalide - objet attendu'
        });
      }

      const closingsPath = path.join(__dirname, '../data/persona-closings.json');
      
      // ✅ LIRE LES DONNÉES EXISTANTES PUIS MERGER
      let existingClosings = {};
      try {
        const existingData = await fs.readFile(closingsPath, 'utf8');
        existingClosings = JSON.parse(existingData);
      } catch (error) {
        console.log('📝 No existing closings file, creating new one');
      }
      
      // ✅ MERGER PROFONDÉMENT les nouvelles données avec les existantes
      const mergedClosings = { ...existingClosings };
      
      // Pour chaque persona dans les nouvelles données
      Object.keys(closings).forEach(personaId => {
        if (mergedClosings[personaId]) {
          // Merge profond : garder les propriétés existantes et ajouter/modifier les nouvelles
          mergedClosings[personaId] = { ...mergedClosings[personaId], ...closings[personaId] };
        } else {
          // Nouvelle persona : ajouter complètement
          mergedClosings[personaId] = closings[personaId];
        }
      });
      
      // ✅ SAUVEGARDER LA STRUCTURE COMPLÈTE
      await fs.writeFile(closingsPath, JSON.stringify(mergedClosings, null, 2));
      
      console.log('✅ Closings saved successfully');
      console.log('📊 Total personas:', Object.keys(mergedClosings).length);
      
      res.json({
        success: true,
        data: { 
          message: 'Closings sauvegardés avec succès',
          personasCount: Object.keys(closings).length,
          totalPersonas: Object.keys(mergedClosings).length
        }
      });
      
    } catch (error) {
      console.error('❌ Error in saveClosings:', error);
      res.status(500).json({
        success: false,
        error: `Erreur sauvegarde closings: ${error.message}`
      });
    }
  }
}

const adminController = new AdminController();

module.exports = {
  getInsights: adminController.getInsights.bind(adminController),
  saveInsights: adminController.saveInsights.bind(adminController),
  saveAllInsights: adminController.saveAllInsights.bind(adminController),
  getPhases: adminController.getPhases.bind(adminController),
  getClosings: adminController.getClosings.bind(adminController),
  adminLogin: adminController.adminLogin.bind(adminController),
  savePhases: adminController.savePhases.bind(adminController),
  saveClosings: adminController.saveClosings.bind(adminController)
};
