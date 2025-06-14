/**
 * INITIALISATION GLOBALE - InsightsEditor Pro
 * Coordonne le chargement de tous les systèmes
 */

class AppInitializer {
    constructor() {
        this.systems = {
            motivation: null,
            editor: null,
            interface: null
        };
        
        this.init();
    }
    
    async init() {
        console.log('🚀 Initialisation InsightsEditor Pro...');
        
        try {
            // 1. Initialiser le système de motivation
            await this.initMotivationSystem();
            
            // 2. Initialiser l'éditeur d'insights
            await this.initInsightEditor();
            
            // 3. Initialiser l'interface controller
            await this.initInterfaceController();
            
            // 4. Connecter tous les systèmes
            await this.connectSystems();
            
            console.log('✅ Tous les systèmes initialisés avec succès !');
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation:', error);
            this.showErrorMessage(error);
        }
    }
    
    async initMotivationSystem() {
        console.log('🎯 Initialisation système de motivation...');
        
        if (typeof MotivationSystem !== 'undefined') {
            this.systems.motivation = new MotivationSystem();
            window.motivationSystem = this.systems.motivation;
            console.log('✅ Système de motivation initialisé');
        } else {
            throw new Error('MotivationSystem non trouvé');
        }
    }
    
    async initInsightEditor() {
        console.log('📝 Initialisation éditeur d\'insights...');
        
        if (typeof InsightEditorPersonas !== 'undefined') {
            this.systems.editor = new InsightEditorPersonas();
            window.editor = this.systems.editor;
            
            // Attendre que les données soient chargées
            await this.waitForDataLoad();
            
            console.log('✅ Éditeur d\'insights initialisé avec données');
        } else {
            throw new Error('InsightEditorPersonas non trouvé');
        }
    }
    
    async initInterfaceController() {
        console.log('🎮 Initialisation interface controller...');
        
        if (typeof InterfaceController !== 'undefined') {
            this.systems.interface = new InterfaceController();
            window.interfaceController = this.systems.interface;
            console.log('✅ Interface controller initialisé');
        } else {
            throw new Error('InterfaceController non trouvé');
        }
    }
    
    async waitForDataLoad() {
        return new Promise((resolve, reject) => {
            const checkData = () => {
                if (this.systems.editor && this.systems.editor.insights && this.systems.editor.insights.length > 0) {
                    console.log(`✅ ${this.systems.editor.insights.length} insights chargés`);
                    resolve();
                } else {
                    setTimeout(checkData, 100);
                }
            };
            
            // Timeout après 10 secondes
            setTimeout(() => {
                reject(new Error('Timeout: Impossible de charger les données'));
            }, 10000);
            
            checkData();
        });
    }
    
    async connectSystems() {
        console.log('🔗 Connexion des systèmes...');
        
        // Synchroniser le système de motivation avec l'éditeur
        if (this.systems.motivation && this.systems.editor) {
            this.systems.motivation.totalInsights = this.systems.editor.insights.length;
            this.systems.motivation.currentInsight = this.systems.editor.currentIndex + 1;
            this.systems.motivation.updateUI();
        }
        
        // Connecter l'interface aux autres systèmes
        if (this.systems.interface) {
            this.systems.interface.editor = this.systems.editor;
            this.systems.interface.updateNavigationButtons();
        }
        
        console.log('✅ Systèmes connectés');
    }
    
    showErrorMessage(error) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 15px;
            border-radius: 8px;
            z-index: 10000;
            max-width: 400px;
        `;
        errorDiv.innerHTML = `
            <h4>❌ Erreur d'initialisation</h4>
            <p>${error.message}</p>
            <button onclick="this.parentElement.remove()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Fermer</button>
        `;
        document.body.appendChild(errorDiv);
    }
}

// Initialiser l'application quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.appInitializer = new AppInitializer();
    });
} else {
    window.appInitializer = new AppInitializer();
} 