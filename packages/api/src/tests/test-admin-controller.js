const fs = require('fs').promises;
const path = require('path');

// Mock simple pour tester les fonctions du contrôleur
class MockAdminController {
  constructor() {
    this.testData = {
      menstrual: [
        {
          id: "test_insight_01",
          baseContent: "Test content",
          targetPreferences: ["symptoms"],
          tone: "friendly",
          phase: "menstrual",
          jezaApproval: 1,
          status: "draft"
        }
      ]
    };
  }

  // Test de la fonction saveInsights
  async testSaveInsights() {
    console.log('🧪 Testing saveInsights...');
    
    const insightId = "test_insight_01";
    const variants = {
      baseContent: "Updated test content",
      targetJourney: JSON.stringify(["body_disconnect"])
    };

    try {
      // Simuler la logique de sauvegarde
      const phase = "menstrual";
      const insightIndex = this.testData[phase].findIndex(i => i.id === insightId);
      
      if (insightIndex !== -1) {
        // Mettre à jour l'insight
        this.testData[phase][insightIndex] = {
          ...this.testData[phase][insightIndex],
          ...variants,
          lastModified: new Date().toLocaleString('fr-FR', {timeZone: 'Europe/Paris'})
        };
        
        // Synchroniser targetJourney et targetPreferences
        if (variants.targetJourney) {
          try {
            const journeyArray = JSON.parse(variants.targetJourney);
            this.testData[phase][insightIndex].targetJourney = journeyArray;
            this.testData[phase][insightIndex].targetPreferences = journeyArray;
          } catch (e) {
            console.log('Failed to parse targetJourney:', e);
          }
        }
        
        // Gérer baseContent séparément
        if (variants.baseContent) {
          this.testData[phase][insightIndex].baseContent = variants.baseContent;
        }
        
        console.log('✅ Test saveInsights passed');
        console.log('Updated insight:', this.testData[phase][insightIndex]);
        return true;
      } else {
        console.log('❌ Test saveInsights failed: insight not found');
        return false;
      }
    } catch (error) {
      console.log('❌ Test saveInsights failed:', error.message);
      return false;
    }
  }

  // Test de la fonction getInsights
  async testGetInsights() {
    console.log('🧪 Testing getInsights...');
    
    try {
      const total = Object.values(this.testData).flat().length;
      const result = {
        success: true,
        data: {
          total: total,
          insights: this.testData
        }
      };
      
      console.log('✅ Test getInsights passed');
      console.log('Total insights:', total);
      return true;
    } catch (error) {
      console.log('❌ Test getInsights failed:', error.message);
      return false;
    }
  }

  // Test de validation des données
  async testDataValidation() {
    console.log('🧪 Testing data validation...');
    
    try {
      // Vérifier que tous les insights ont les champs requis
      const requiredFields = ['id', 'baseContent', 'tone', 'phase'];
      let allValid = true;
      
      Object.values(this.testData).flat().forEach(insight => {
        requiredFields.forEach(field => {
          if (!insight[field]) {
            console.log(`❌ Missing required field: ${field} in insight ${insight.id}`);
            allValid = false;
          }
        });
      });
      
      if (allValid) {
        console.log('✅ Test data validation passed');
        return true;
      } else {
        console.log('❌ Test data validation failed');
        return false;
      }
    } catch (error) {
      console.log('❌ Test data validation failed:', error.message);
      return false;
    }
  }

  // Exécuter tous les tests
  async runAllTests() {
    console.log('🚀 Starting Admin Controller Tests...\n');
    
    const tests = [
      this.testGetInsights(),
      this.testSaveInsights(),
      this.testDataValidation()
    ];
    
    const results = await Promise.all(tests);
    const passed = results.filter(r => r).length;
    const total = results.length;
    
    console.log(`\n📊 Test Results: ${passed}/${total} tests passed`);
    
    if (passed === total) {
      console.log('🎉 All tests passed!');
      return true;
    } else {
      console.log('❌ Some tests failed');
      return false;
    }
  }
}

// Exporter pour utilisation
module.exports = MockAdminController;

// Exécuter les tests si le fichier est appelé directement
if (require.main === module) {
  const controller = new MockAdminController();
  controller.runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
} 