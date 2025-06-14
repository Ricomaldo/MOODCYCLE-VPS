class InsightEditorPersonas {
    constructor() {
        this.insights = [];
        this.currentIndex = 0;
        this.selectedPersona = 'emma'; // Persona par défaut
        this.progress = this.loadProgress();
        this.elements = this.initializeElements();
        this.loadInsights();
        this.bindEvents();
    }

    initializeElements() {
        return {
            // Interface Pro - IDs corrigés
            progressFill: document.getElementById('progressFill'),
            globalCounter: document.getElementById('globalCounter'), // Nouveau nom
            insightCounter: document.getElementById('insightCounter'),
            scoreStars: document.getElementById('scoreStars'),
            statusBadge: document.getElementById('statusBadge'),
            profileLink: document.getElementById('profileLink'),
            
            // Métadonnées
            insightPhase: document.getElementById('insightPhase'),
            insightTone: document.getElementById('insightTone'),
            insightPreferences: document.getElementById('insightPreferences'),
            journeyBadges: document.getElementById('journeyBadges'),
            insightScore: document.getElementById('insightScore'),
            
            // Contenu
            contentTextarea: document.getElementById('contentTextarea'),
            baseContentDiv: document.getElementById('baseContent'),
            personaSelect: document.getElementById('personaSelect'),
            personaPreview: document.getElementById('personaPreview'),
            
            // Navigation
            prevBtn: document.getElementById('prevBtn'),
            nextBtn: document.getElementById('nextBtn'),
            validateBtn: document.getElementById('validateBtn'),
            resetBtn: document.getElementById('resetBtn'),
            exportBtn: document.getElementById('exportBtn')
        };
    }

    loadProgress() {
        const saved = localStorage.getItem('insightProgressPersonas');
        return saved ? JSON.parse(saved) : {
            currentIndex: 0,
            totalValidated: 0,
            selectedPersona: 'emma',
            lastSession: new Date().toISOString(),
            insights: {}
        };
    }

    saveProgress() {
        this.progress.lastSession = new Date().toISOString();
        this.progress.selectedPersona = this.selectedPersona;
        localStorage.setItem('insightProgressPersonas', JSON.stringify(this.progress));
    }

    async loadInsights() {
        try {
            console.log('📝 Chargement insights_validated.json...');
            
            const response = await fetch('./data/current/insights_validated.json');
            if (!response.ok) {
                throw new Error(`Erreur ${response.status}: Impossible de charger insights_validated.json`);
            }
            
            const data = await response.json();
            console.log('✅ insights_validated.json chargé avec succès');
            
            // Parse le format personas (on sait que c'est ce format)
            this.insights = this.parsePersonasFormat(data);
            console.log(`✅ ${this.insights.length} insights chargés depuis insights_validated.json`);
            
            this.currentIndex = this.progress.currentIndex;
            this.selectedPersona = this.progress.selectedPersona || 'emma';
            this.updateDisplay();
            this.createPersonaSelector();
            
        } catch (error) {
            console.error('❌ Erreur chargement insights_validated.json:', error);
            alert('Erreur de chargement: ' + error.message);
        }
    }

    parsePersonasFormat(data) {
        // Parse le format personas
        const insights = [];
        for (const [phase, phaseInsights] of Object.entries(data)) {
            phaseInsights.forEach(insight => {
                // S'assurer que chaque insight a une structure personas complète
                this.ensurePersonaVariants(insight);
                insights.push(insight);
            });
        }
        return insights;
    }

    ensurePersonaVariants(insight) {
        // S'assurer que l'insight a tous les champs personas nécessaires
        const personas = ['emma', 'laure', 'sylvie', 'christine', 'clara'];
        
        if (!insight.personaVariants) {
            insight.personaVariants = {};
        }
        
        personas.forEach(persona => {
            if (!insight.personaVariants[persona]) {
                insight.personaVariants[persona] = '';
            }
        });
        
        if (!insight.targetPersonas) {
            insight.targetPersonas = personas;
        }
    }

    createPersonaSelector() {
        if (!this.elements.personaSelect) return;

        const personas = {
            'emma': '👩 Emma - Découverte (16-25)',
            'laure': '💼 Laure - Active (25-35)', 
            'sylvie': '🔄 Sylvie - Transition (35-45)',
            'christine': '🌙 Christine - Sagesse (45+)',
            'clara': '🔬 Clara - Scientifique'
        };

        this.elements.personaSelect.innerHTML = '';
        
        Object.entries(personas).forEach(([key, label]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = label;
            if (key === this.selectedPersona) {
                option.selected = true;
            }
            this.elements.personaSelect.appendChild(option);
        });
    }

    getDisplayContent(insight) {
        // Retourne le contenu à afficher selon le format
        if (insight.personaVariants && insight.personaVariants[this.selectedPersona] && insight.personaVariants[this.selectedPersona].trim() !== '') {
            return insight.personaVariants[this.selectedPersona];
        } else if (insight.baseContent && insight.baseContent.trim() !== '') {
            // Si pas de variante pour cette persona, ne pas afficher le baseContent dans la textarea
            // Il sera affiché séparément dans baseContentDiv
            return '';
        } else {
            return insight.content || '';
        }
    }

    updateScoreStars(score) {
        if (!this.elements.scoreStars) return;
        
        const stars = this.elements.scoreStars.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.classList.toggle('filled', index < score);
        });
    }



    updateInsightScore(newScore) {
        const current = this.insights[this.currentIndex];
        if (current) {
            current.jezaApproval = newScore;
            this.updateScoreStars(newScore);
            if (this.elements.insightScore) {
                this.elements.insightScore.textContent = `${newScore}/5`;
            }
            
            // Sauvegarder la modification
            this.progress.insights[current.id] = {
                ...this.progress.insights[current.id],
                score: newScore,
                lastModified: new Date().toISOString()
            };
            this.saveProgress();
        }
    }

    updateDisplay() {
        const current = this.insights[this.currentIndex];
        if (!current) return;

        // Compteur d'insights
        if (this.elements.insightCounter) {
            this.elements.insightCounter.textContent = `${this.currentIndex + 1}/${this.insights.length}`;
        }

        // Traductions des phases et tons
        const phaseMap = {
            menstrual: 'Sorcière',
            follicular: 'Jeune fille',
            ovulatory: 'Mère',
            luteal: 'Enchanteresse'
        };
        const toneMap = {
            friendly: 'copine',
            professional: 'coach',
            inspiring: 'guide'
        };
        const prefMap = {
            symptoms: 'Symptômes',
            moods: 'Humeurs',
            phyto: 'Plantes',
            phases: 'Phases',
            lithotherapy: 'Pierres',
            rituals: 'Rituels'
        };
        const journeyMap = {
            body_disconnect: 'Incarnation',
            hiding_nature: 'Déploiement',
            emotional_control: 'Apaisement'
        };

        // Affichage métadonnées avec vérifications
        if (this.elements.insightPhase) {
            this.elements.insightPhase.textContent = phaseMap[current.phase] || current.phase;
        }
        if (this.elements.insightTone) {
            this.elements.insightTone.textContent = toneMap[current.tone] || current.tone;
        }
        if (this.elements.insightPreferences) {
            this.elements.insightPreferences.textContent = (current.targetPreferences || []).map(p => prefMap[p] || p).join(', ');
        }
        
        // Mettre à jour les badges de parcours
        this.updateJourneyBadges(current.targetJourney || []);

        // Score Jeza avec étoiles
        const score = current.jezaApproval || 3;
        if (this.elements.insightScore) {
            this.elements.insightScore.textContent = `${score}/5`;
        }
        this.updateScoreStars(score);

        // Lien vers le profil persona
        if (this.elements.profileLink) {
            this.elements.profileLink.href = `personas/${this.selectedPersona}.html`;
        }

        // Contenu selon le persona sélectionné
        const displayContent = this.getDisplayContent(current);
        const savedContent = this.progress.insights[current.id]?.content;
        const finalContent = savedContent || displayContent;
        
        // Gestion du placeholder
        if (this.elements.contentTextarea) {
            if (!finalContent || finalContent.trim() === '') {
                this.elements.contentTextarea.value = '';
                this.elements.contentTextarea.placeholder = this.getPlaceholderText();
            } else {
                this.elements.contentTextarea.value = finalContent;
                this.elements.contentTextarea.placeholder = '';
            }
        }

        // Affichage du contenu de base (si format personas)
        if (this.elements.baseContentDiv && current.baseContent) {
            this.elements.baseContentDiv.innerHTML = `
                <h4>Contenu de base</h4>
                <div class="base-content">${current.baseContent}</div>
            `;
            this.elements.baseContentDiv.style.display = 'block';
        } else if (this.elements.baseContentDiv) {
            this.elements.baseContentDiv.style.display = 'none';
        }

        // Preview des autres personas
        this.updatePersonaPreview(current);

        // Mettre à jour le select personnalisé
        this.updateCustomSelectDisplay();

        this.updateStatus(current.status);
        if (this.elements.contentTextarea) {
            this.elements.contentTextarea.className = current.status || 'unread';
        }
        
        // Navigation avec vérifications
        if (this.elements.prevBtn) {
            this.elements.prevBtn.disabled = this.currentIndex === 0;
        }
        if (this.elements.nextBtn) {
            this.elements.nextBtn.disabled = this.currentIndex === this.insights.length - 1;
        }
        
        this.updateProgress();
    }

    updatePersonaPreview(insight) {
        if (!this.elements.personaPreview || !insight.personaVariants) return;
        
        const personas = [
            { key: 'emma', name: 'Emma' },
            { key: 'laure', name: 'Laure' },
            { key: 'sylvie', name: 'Sylvie' },
            { key: 'christine', name: 'Christine' },
            { key: 'clara', name: 'Clara' }
        ];
        
        let previewHTML = '';
        
        personas.forEach(persona => {
            const content = insight.personaVariants[persona.key] || '';
            const isSelected = persona.key === this.selectedPersona;
            const displayText = content.trim() !== '' ? 
                (content.substring(0, 80) + (content.length > 80 ? '...' : '')) : 
                '✏️ À rédiger...';
            const isEmpty = content.trim() === '';
            
            previewHTML += `
                <div class="persona-variant ${isSelected ? 'current' : ''} ${isEmpty ? 'empty' : ''}" data-persona="${persona.key}">
                    <div class="persona-name">${persona.name}</div>
                    <div class="persona-preview-text ${isEmpty ? 'placeholder' : ''}">${displayText}</div>
                </div>
            `;
        });
        
        this.elements.personaPreview.innerHTML = previewHTML;
    }

    updateStatus(status) {
        const statusConfig = {
            unread: { class: 'status-unread', text: 'Non lu' },
            editing: { class: 'status-editing', text: 'En cours' },
            validated: { class: 'status-validated', text: 'Validé' },
            enriched: { class: 'status-enriched', text: 'Enrichi' }
        };
        const config = statusConfig[status] || statusConfig['unread'];
        
        if (this.elements.statusBadge) {
            this.elements.statusBadge.className = `status-badge ${config.class}`;
            this.elements.statusBadge.textContent = config.text;
        }
    }

    updateProgress() {
        const personas = ['emma', 'laure', 'sylvie', 'christine', 'clara'];
        let filledVariants = 0;
        
        // Compter les variantes renseignées
        this.insights.forEach(insight => {
            if (insight.personaVariants) {
                personas.forEach(persona => {
                    const content = insight.personaVariants[persona];
                    if (content && content.trim() !== '') {
                        filledVariants++;
                    }
                });
            }
        });
        
        const totalVariants = this.insights.length * personas.length;
        const percent = Math.round((filledVariants / totalVariants) * 100);
        
        // Barre de progression : variantes renseignées
        if (this.elements.progressFill) {
            this.elements.progressFill.style.width = `${percent}%`;
        }
        if (this.elements.globalCounter) {
            this.elements.globalCounter.textContent = `${filledVariants}/${totalVariants}`;
        }
        
        this.progress.totalValidated = filledVariants;
    }

    updateJourneyBadges(selectedJourneys) {
        if (!this.elements.journeyBadges) return;
        
        const badges = this.elements.journeyBadges.querySelectorAll('.badge-journey');
        
        badges.forEach(badge => {
            const journey = badge.dataset.journey;
            if (selectedJourneys.includes(journey)) {
                badge.classList.add('active');
            } else {
                badge.classList.remove('active');
            }
        });
    }

    onJourneyBadgeClick(journey) {
        const current = this.insights[this.currentIndex];
        const currentJourneys = current.targetJourney || [];
        
        // Toggle la sélection
        let newJourneys;
        if (currentJourneys.includes(journey)) {
            // Retirer si déjà sélectionné
            newJourneys = currentJourneys.filter(j => j !== journey);
        } else {
            // Ajouter si pas sélectionné
            newJourneys = [...currentJourneys, journey];
        }
        
        // Mettre à jour l'insight
        current.targetJourney = newJourneys;
        
        // Mettre à jour l'affichage
        this.updateJourneyBadges(newJourneys);
        
        // Sauvegarder automatiquement
        this.autoSave();
    }

    bindEvents() {
        // Navigation gérée par interface.js - supprimé pour éviter double navigation
        // this.elements.prevBtn?.addEventListener('click', () => this.navigate(-1));
        // this.elements.nextBtn?.addEventListener('click', () => this.navigate(1));
        
        // Validation
        this.elements.validateBtn?.addEventListener('click', () => this.validateCurrent());
        
        // Sauvegarde automatique
        this.elements.contentTextarea?.addEventListener('input', () => this.autoSave());
        
        // Autres actions
        this.elements.resetBtn?.addEventListener('click', () => this.reset());
        this.elements.exportBtn?.addEventListener('click', () => this.exportData());
        
        // Écouteur pour les badges de parcours
        this.elements.journeyBadges?.addEventListener('click', (e) => {
            if (e.target.classList.contains('badge-journey')) {
                const journey = e.target.dataset.journey;
                this.onJourneyBadgeClick(journey);
            }
        });
        
        // Sélection persona (ancien select caché)
        this.elements.personaSelect?.addEventListener('change', (e) => {
            this.selectedPersona = e.target.value;
            this.updateDisplay();
            this.saveProgress();
        });

        // Nouveau système de select avec avatars
        this.initializeCustomSelect();
        
        // Étoiles cliquables
        if (this.elements.scoreStars) {
            this.elements.scoreStars.addEventListener('click', (e) => {
                if (e.target.classList.contains('star')) {
                    const score = parseInt(e.target.dataset.score);
                    this.updateInsightScore(score);
                }
            });
        }
        
        // Preview personas cliquables
        this.elements.personaPreview?.addEventListener('click', (e) => {
            const variant = e.target.closest('.persona-variant');
            if (variant) {
                const persona = variant.dataset.persona;
                this.selectPersonaOption(persona);
            }
        });
        
        // Raccourcis clavier pour efficacité (navigation supprimée)
        document.addEventListener('keydown', (e) => {
            // Validation avec Ctrl+Enter
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                this.validateCurrent();
            }
            // Changement de persona avec Tab
            else if (e.key === 'Tab' && e.target === this.elements.personaSelect) {
                // Comportement par défaut du Tab
            }
        });
    }

    validateCurrent() {
        // 1️⃣ RÉCUPÉRATION DES DONNÉES
        const current = this.insights[this.currentIndex];
        const content = this.elements.contentTextarea.value.trim();
        
        // 2️⃣ VALIDATION OBLIGATOIRE
        if (!content) {
            alert('Le contenu ne peut pas être vide !');
            return;
        }
        
        // 3️⃣ SAUVEGARDE DANS LE NOUVEAU FORMAT
        if (current.personaVariants) {
            current.personaVariants[this.selectedPersona] = content;
            current.lastModified = new Date().toISOString();
        }
        
        // 4️⃣ SAUVEGARDE DANS LE SYSTÈME DE PROGRESSION
        this.progress.insights[current.id] = {
            status: 'validated',
            content: content,
            persona: this.selectedPersona,
            targetJourney: current.targetJourney,
            lastModified: new Date().toISOString()
        };
        
        // 5️⃣ MISE À JOUR DU STATUT
        current.status = 'validated';
        this.saveProgress();
        this.updateDisplay();
        
        // 6️⃣ NAVIGATION AUTOMATIQUE
        if (this.currentIndex < this.insights.length - 1) {
            setTimeout(() => this.navigate(1), 500);
        }
    }

    autoSave() {
        const current = this.insights[this.currentIndex];
        const content = this.elements.contentTextarea.value;
        
        if (current.status === 'unread') {
            current.status = 'editing';
            this.updateStatus('editing');
        }
        
        // Sauvegarder dans personaVariants si c'est le nouveau format
        if (current.personaVariants) {
            current.personaVariants[this.selectedPersona] = content;
            current.lastModified = new Date().toISOString();
        }
        
        this.progress.insights[current.id] = {
            status: current.status,
            content: content,
            persona: this.selectedPersona,
            targetJourney: current.targetJourney,
            lastModified: new Date().toISOString()
        };
        
        this.saveProgress();
    }

    reset() {
        if (confirm('Êtes-vous sûr de vouloir remettre à zéro tous les progrès ?')) {
            localStorage.removeItem('insightProgressPersonas');
            location.reload();
        }
    }

    exportData() {
        const exportData = {
            exportDate: new Date().toISOString(),
            totalInsights: this.insights.length,
            validatedCount: Object.values(this.progress.insights).filter(i => i.status === 'validated').length,
            selectedPersona: this.selectedPersona,
            insights: this.insights,
            progress: this.progress
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `insights_personas_validated_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    getPlaceholderText() {
        // Retourne le texte de placeholder selon le contexte
        return `✏️ Adaptez le contenu pour ${this.getPersonaName(this.selectedPersona)}...

💡 Conseils d'édition :
• Ajustez le ton selon la persona
• Personnalisez les exemples 
• Adaptez le niveau de détail
• Gardez le message principal clair

🎯 Focus : Créez une version spécifique pour cette persona !`;
    }

    getPersonaName(personaKey) {
        const personas = {
            'emma': 'Emma (Découverte 16-25)',
            'laure': 'Laure (Active 25-35)', 
            'sylvie': 'Sylvie (Transition 35-45)',
            'christine': 'Christine (Sagesse 45+)',
            'clara': 'Clara (Scientifique)'
        };
        return personas[personaKey] || personaKey;
    }

    initializeCustomSelect() {
        const current = document.getElementById('personaSelectCurrent');
        const options = document.getElementById('personaOptions');
        
        if (!current || !options) return;

        // Ouvrir/fermer le select
        current.addEventListener('click', () => {
            const isOpen = current.classList.contains('open');
            if (isOpen) {
                this.closeCustomSelect();
            } else {
                this.openCustomSelect();
            }
        });

        // Sélectionner une option
        options.addEventListener('click', (e) => {
            const option = e.target.closest('.persona-option');
            if (option) {
                const value = option.dataset.value;
                this.selectPersonaOption(value);
                this.closeCustomSelect();
            }
        });

        // Fermer en cliquant ailleurs
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.persona-select-container')) {
                this.closeCustomSelect();
            }
        });

        // Support clavier
        current.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const isOpen = current.classList.contains('open');
                if (isOpen) {
                    this.closeCustomSelect();
                } else {
                    this.openCustomSelect();
                }
            } else if (e.key === 'Escape') {
                this.closeCustomSelect();
            }
        });

        // Initialiser la sélection
        this.updateCustomSelectDisplay();
    }

    openCustomSelect() {
        const current = document.getElementById('personaSelectCurrent');
        const options = document.getElementById('personaOptions');
        
        current.classList.add('open');
        options.classList.add('open');
        current.setAttribute('aria-expanded', 'true');
    }

    closeCustomSelect() {
        const current = document.getElementById('personaSelectCurrent');
        const options = document.getElementById('personaOptions');
        
        current.classList.remove('open');
        options.classList.remove('open');
        current.setAttribute('aria-expanded', 'false');
    }

    selectPersonaOption(value) {
        // Mettre à jour la sélection
        this.selectedPersona = value;
        
        // Mettre à jour l'affichage
        this.updateCustomSelectDisplay();
        this.updateDisplay();
        this.saveProgress();
    }

    updateCustomSelectDisplay() {
        const current = document.getElementById('personaSelectCurrent');
        if (!current) return;

        // Liste des prénoms
        const prenoms = {
            'emma': 'Emma',
            'laure': 'Laure',
            'sylvie': 'Sylvie',
            'christine': 'Christine',
            'clara': 'Clara'
        };

        // Affiche uniquement le prénom sélectionné
        current.innerHTML = `<span class=\"persona-name\">${prenoms[this.selectedPersona] || this.selectedPersona}</span><span class=\"select-arrow\">▼</span>`;

        // Génère dynamiquement les options du menu déroulant (prénoms seuls)
        const optionsContainer = document.getElementById('personaOptions');
        if (optionsContainer) {
            optionsContainer.innerHTML = '';
            Object.entries(prenoms).forEach(([key, prenom]) => {
                const option = document.createElement('div');
                option.className = 'persona-option';
                option.dataset.value = key;
                if (key === this.selectedPersona) option.classList.add('selected');
                option.innerHTML = `<span class=\"persona-name\">${prenom}</span>`;
                optionsContainer.appendChild(option);
            });
        }
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.insightEditor = new InsightEditorPersonas();
}); 