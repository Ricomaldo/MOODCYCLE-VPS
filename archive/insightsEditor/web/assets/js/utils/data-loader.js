/**
 * Utilitaire de chargement des données pour InsightsEditor
 * Gère les chemins et les formats de données
 */

class DataLoader {
    constructor() {
        this.basePath = './data';
        this.paths = {
            // Données principales - APRÈS NETTOYAGE
            insights: '../insights_validated_2025-06-09.json', // Source unique Jeza
            current: `${this.basePath}/current/insights_validated_2025-06-09.json`, // Copie propre
            example: `${this.basePath}/current/insights.example.json`, // Format cible
            
            // Export final
            latest_export: '../insights_export_2025-06-09.json', // Dernière export
            
            // Archives (pour référence)
            archived: `${this.basePath}/archive/`
        };
    }

    /**
     * Charge les insights selon le format disponible
     * @param {string} preferredFormat - 'personas' ou 'legacy'
     * @returns {Promise<Object>} Les données des insights
     */
    async loadInsights(preferredFormat = 'export') {
        try {
            let response;
            
            if (preferredFormat === 'export') {
                // Essaye d'abord le fichier export (avec personas)
                response = await fetch(this.paths.latest_export);
                if (response.ok) {
                    const data = await response.json();
                    console.log('✅ Export personas chargé:', data.exportInfo);
                    return { data, format: 'export' };
                }
                console.warn('⚠️ Export non disponible, fallback sur source Jeza');
            }
            
            // Fallback sur la source Jeza (format legacy)
            response = await fetch(this.paths.insights);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('✅ Source Jeza chargée');
            return { data, format: 'legacy' };
            
        } catch (error) {
            console.error('❌ Erreur de chargement des données:', error);
            throw new Error(`Impossible de charger les insights: ${error.message}`);
        }
    }

    /**
     * Vérifie si les données sont au format personas
     * @param {Object} data - Les données à vérifier
     * @returns {boolean} True si format personas
     */
    isPersonasFormat(data) {
        if (!data || typeof data !== 'object') return false;
        
        const firstPhase = Object.values(data)[0];
        if (Array.isArray(firstPhase) && firstPhase.length > 0) {
            const firstInsight = firstPhase[0];
            return firstInsight.hasOwnProperty('personaVariants') || 
                   firstInsight.hasOwnProperty('baseContent');
        }
        return false;
    }

    /**
     * Parse les données au format personas
     * @param {Object} data - Données au format personas
     * @returns {Array} Liste des insights
     */
    parsePersonasFormat(data) {
        const insights = [];
        
        for (const [phase, phaseInsights] of Object.entries(data)) {
            if (Array.isArray(phaseInsights)) {
                insights.push(...phaseInsights);
            }
        }
        
        console.log(`📊 ${insights.length} insights personas parsés`);
        return insights;
    }

    /**
     * Parse les données au format legacy
     * @param {Object} data - Données au format legacy
     * @returns {Array} Liste des insights
     */
    parseLegacyFormat(data) {
        const insights = [];
        
        for (const [phase, categories] of Object.entries(data)) {
            if (typeof categories === 'object' && !Array.isArray(categories)) {
                for (const [category, categoryInsights] of Object.entries(categories)) {
                    if (Array.isArray(categoryInsights)) {
                        insights.push(...categoryInsights);
                    }
                }
            } else if (Array.isArray(categories)) {
                insights.push(...categories);
            }
        }
        
        console.log(`📊 ${insights.length} insights legacy parsés`);
        return insights;
    }

    /**
     * Sauvegarde les données modifiées
     * @param {Object} data - Données à sauvegarder
     * @param {string} filename - Nom du fichier (optionnel)
     * @returns {string} URL de téléchargement
     */
    exportData(data, filename = 'insights-modified.json') {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Crée un lien de téléchargement temporaire
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Nettoie l'URL après un délai
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        
        console.log(`💾 Export: ${filename}`);
        return url;
    }

    /**
     * Génère l'export final avec variants personas
     * @returns {Promise<string>} URL du fichier téléchargé
     */
    async generateFinalExport() {
        try {
            console.log('🚀 Génération export final...');
            
            // Note: Ceci simule l'appel au script Python
            // Dans un vrai environnement, ceci ferait un appel API
            const timestamp = new Date().toISOString().split('T')[0];
            const filename = `insights_export_${timestamp}.json`;
            
            // Pour le moment, on utilise les données actuelles comme base
            const { data } = await this.loadInsights('legacy');
            
            console.log('⚠️ Note: Export simulé - utilisez le script Python pour la vraie génération');
            console.log('Commande: python3 tools/active/simple_export.py');
            
            return this.exportData(data, filename);
            
        } catch (error) {
            console.error('❌ Erreur export final:', error);
            throw error;
        }
    }

    /**
     * Obtient les statistiques des données
     * @param {Array} insights - Liste des insights
     * @returns {Object} Statistiques
     */
    getStats(insights) {
        const phases = {};
        const tones = {};
        const preferences = {};
        const journeys = {};
        let personasCount = 0;
        
        insights.forEach(insight => {
            // Phases
            phases[insight.phase] = (phases[insight.phase] || 0) + 1;
            
            // Tons
            tones[insight.tone] = (tones[insight.tone] || 0) + 1;
            
            // Préférences
            if (insight.targetPreferences) {
                insight.targetPreferences.forEach(pref => {
                    preferences[pref] = (preferences[pref] || 0) + 1;
                });
            }
            
            // Parcours
            if (insight.targetJourney) {
                insight.targetJourney.forEach(journey => {
                    journeys[journey] = (journeys[journey] || 0) + 1;
                });
            }
            
            // Personas (si disponible)
            if (insight.personaVariants) {
                personasCount = Math.max(personasCount, Object.keys(insight.personaVariants).length);
            }
        });
        
        return {
            total: insights.length,
            phases,
            tones, 
            preferences,
            journeys,
            personasCount,
            hasPersonas: personasCount > 0
        };
    }
}

// Export pour utilisation dans d'autres scripts
window.DataLoader = DataLoader; 