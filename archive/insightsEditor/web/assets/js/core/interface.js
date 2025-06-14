/**
 * INTERFACE CONTROLLER - InsightsEditor Pro (Nouvelle Hiérarchie)
 * Gestion simplifiée et optimisée de l'interface utilisateur
 */

class InterfaceController {
    constructor() {
        this.currentIndex = 0;
        this.editor = null;
        this.isContextSidebarOpen = false;
        this.isPreviewPanelOpen = false;
        this.isPersonaDropdownOpen = false;
        console.log('🚀 Interface Controller v2.0 créé');
        this.init();
    }

    // === INITIALISATION ===
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeComponents();
                this.bindEvents();
                this.setupMotivationIntegration();
            });
        } else {
            this.initializeComponents();
            this.bindEvents();
            this.setupMotivationIntegration();
        }

        // Gérer le redimensionnement
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.updateResponsive();
            }, 100);
        });
    }

    initializeComponents() {
        try {
            console.log('🚀 Initialisation Interface Controller v2.0...');
            
            this.debugElements();
            this.initializePersonaHeader();
            this.initializeContextStars();
            this.initializeJourneyBadges();
            this.initializeWordCount();
            this.updateNavigationButtons();
            
            // Initialiser l'éditeur principal
            if (typeof InsightEditorPersonas !== 'undefined' && !window.editor) {
                window.editor = new InsightEditorPersonas();
                this.editor = window.editor;
                console.log('✅ Éditeur initialisé:', this.editor);
            } else if (window.editor) {
                this.editor = window.editor;
                console.log('✅ Éditeur existant récupéré');
            } else {
                console.error('⚠️ InsightEditorPersonas non trouvé');
            }
        } catch (error) {
            console.error('❌ Erreur initialisation:', error);
        }
    }

    // === GESTION HEADER COMPACT ===
    initializePersonaHeader() {
        const personaCompact = document.querySelector('.current-persona-compact');
        if (personaCompact) {
            // Mettre à jour l'affichage initial
            this.updatePersonaHeader();
            console.log('✅ Header persona initialisé');
        }
    }

    updatePersonaHeader(personaName = 'Emma') {
        const personaAvatar = document.querySelector('.current-persona-compact .persona-avatar img');
        const personaNameEl = document.querySelector('.current-persona-compact .persona-name');
        
        if (personaAvatar) {
            personaAvatar.src = `assets/images/personas/avatars/${personaName}.jpg`;
            personaAvatar.alt = personaName;
        }
        
        if (personaNameEl) {
            personaNameEl.textContent = personaName;
        }

        // Mettre à jour aussi la zone d'adaptation
        const adaptationPersonaName = document.querySelector('.current-persona-name');
        if (adaptationPersonaName) {
            adaptationPersonaName.textContent = personaName;
        }
    }

    // === GESTION DROPDOWN PERSONAS ===
    togglePersonaDropdown() {
        const dropdown = document.getElementById('personaDropdown');
        if (!dropdown) return;

        this.isPersonaDropdownOpen = !this.isPersonaDropdownOpen;
        
        if (this.isPersonaDropdownOpen) {
            dropdown.classList.remove('collapsed');
            console.log('📂 Dropdown personas ouvert');
        } else {
            dropdown.classList.add('collapsed');
            console.log('📁 Dropdown personas fermé');
        }
    }

    closePersonaDropdown() {
        const dropdown = document.getElementById('personaDropdown');
        if (dropdown) {
            dropdown.classList.add('collapsed');
            this.isPersonaDropdownOpen = false;
        }
    }

    // === GESTION SIDEBARS CONTEXTUELLES ===
    toggleContextSidebar() {
        const sidebar = document.getElementById('contextSidebar');
        if (!sidebar) return;

        this.isContextSidebarOpen = !this.isContextSidebarOpen;
        
        if (this.isContextSidebarOpen) {
            sidebar.classList.remove('collapsed');
            console.log('📊 Sidebar contexte ouverte');
        } else {
            sidebar.classList.add('collapsed');
            console.log('📊 Sidebar contexte fermée');
        }
    }

    togglePreviewPanel() {
        const panel = document.getElementById('previewPanel');
        if (!panel) return;

        this.isPreviewPanelOpen = !this.isPreviewPanelOpen;
        
        if (this.isPreviewPanelOpen) {
            panel.classList.remove('collapsed');
            console.log('👁️ Panel aperçu ouvert');
        } else {
            panel.classList.add('collapsed');
            console.log('👁️ Panel aperçu fermé');
        }
    }

    closeAllPanels() {
        // Fermer tous les panels ouverts
        const contextSidebar = document.getElementById('contextSidebar');
        const previewPanel = document.getElementById('previewPanel');
        const personaDropdown = document.getElementById('personaDropdown');

        if (contextSidebar) contextSidebar.classList.add('collapsed');
        if (previewPanel) previewPanel.classList.add('collapsed');
        if (personaDropdown) personaDropdown.classList.add('collapsed');

        this.isContextSidebarOpen = false;
        this.isPreviewPanelOpen = false;
        this.isPersonaDropdownOpen = false;
    }

    // === GESTION WORD COUNT ===
    initializeWordCount() {
        const textarea = document.getElementById('contentTextarea');
        const wordCountEl = document.querySelector('.word-count');
        
        if (textarea && wordCountEl) {
            const updateCount = () => {
                const words = textarea.value.trim().split(/\s+/).filter(word => word.length > 0);
                wordCountEl.textContent = `${words.length} mots`;
            };
            
            textarea.addEventListener('input', updateCount);
            updateCount(); // Initial count
            console.log('✅ Word count initialisé');
        }
    }

    // === GESTION BADGES JOURNEY ===
    initializeJourneyBadges() {
        const badges = document.querySelectorAll('.badge-journey');
        
        badges.forEach(badge => {
            badge.addEventListener('click', () => {
                badge.classList.toggle('active');
                
                const journey = badge.dataset.journey || badge.textContent;
                console.log(`🎯 Badge journey ${journey} ${badge.classList.contains('active') ? 'activé' : 'désactivé'}`);
            });
        });
        
        // Activer le premier badge par défaut
        if (badges.length > 0) {
            badges[0].classList.add('active');
        }
        
        console.log('✅ Badges journey initialisés');
    }

    // === GESTION RATING STARS ===
    initializeContextStars() {
        const stars = document.querySelectorAll('#scoreStars .star, .star-rating .star');
        
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                const rating = parseInt(star.dataset.score) || index + 1;
                this.setRating(rating);
            });
            
            star.addEventListener('mouseenter', () => {
                const rating = parseInt(star.dataset.score) || index + 1;
                this.previewRating(rating);
            });
        });
        
        const starsContainer = document.querySelector('#scoreStars, .star-rating');
        if (starsContainer) {
            starsContainer.addEventListener('mouseleave', () => {
                this.resetRatingPreview();
            });
        }
        
        console.log('✅ Stars rating initialisées');
    }

    setRating(rating) {
        const stars = document.querySelectorAll('#scoreStars .star, .star-rating .star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('filled');
            } else {
                star.classList.remove('filled');
            }
        });
        
        // Mettre à jour l'affichage dans la context bar
        const ratingDisplay = document.querySelector('.rating-display');
        if (ratingDisplay) {
            ratingDisplay.textContent = `${rating}/5`;
        }
        
        console.log(`⭐ Rating défini à ${rating}/5`);
    }

    previewRating(rating) {
        const stars = document.querySelectorAll('#scoreStars .star, .star-rating .star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.style.opacity = '1';
                star.style.transform = 'scale(1.1)';
            } else {
                star.style.opacity = '0.5';
                star.style.transform = 'scale(1)';
            }
        });
    }

    resetRatingPreview() {
        const stars = document.querySelectorAll('#scoreStars .star, .star-rating .star');
        stars.forEach(star => {
            star.style.opacity = '';
            star.style.transform = '';
        });
    }

    // === NAVIGATION ===
    previousInsight() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateNavigationButtons();
            this.loadInsight(this.currentIndex);
            console.log(`🔙 Insight précédent: ${this.currentIndex + 1}`);
        }
    }

    nextInsight() {
        const maxIndex = 177; // 178 insights total
        if (this.currentIndex < maxIndex) {
            this.currentIndex++;
            this.updateNavigationButtons();
            this.loadInsight(this.currentIndex);
            console.log(`🔜 Insight suivant: ${this.currentIndex + 1}`);
        }
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const counter = document.getElementById('globalCounter');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentIndex === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentIndex >= 177;
        }
        
        if (counter) {
            counter.textContent = `${this.currentIndex + 1}/178`;
        }
        
        // Mettre à jour la progress bar
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            const percentage = ((this.currentIndex + 1) / 178) * 100;
            progressFill.style.width = `${percentage}%`;
        }
        
        // Mettre à jour l'indicateur fixe
        const progressText = document.querySelector('.progress-text');
        if (progressText) {
            const percentage = Math.round(((this.currentIndex + 1) / 178) * 100);
            progressText.textContent = `${percentage}%`;
        }
    }

    loadInsight(index) {
        // Déléguer à l'éditeur principal si disponible
        if (this.editor && this.editor.loadInsight) {
            this.editor.loadInsight(index);
        }
    }

    // === GESTION EMOJIS ===
    toggleEmojiPanel() {
        const panel = document.getElementById('emojiGrid');
        if (!panel) return;

        const isCollapsed = panel.classList.contains('collapsed');
        
        if (isCollapsed) {
            panel.classList.remove('collapsed');
            console.log('🎨 Panel emoji ouvert');
        } else {
            panel.classList.add('collapsed');
            console.log('🎨 Panel emoji fermé');
        }
    }

    insertEmoji(emoji) {
        const textarea = document.getElementById('contentTextarea');
        if (!textarea) return;
        
        const cursorPos = textarea.selectionStart;
        const textBefore = textarea.value.substring(0, cursorPos);
        const textAfter = textarea.value.substring(textarea.selectionEnd);
        
        textarea.value = textBefore + emoji + textAfter;
        textarea.selectionStart = textarea.selectionEnd = cursorPos + emoji.length;
        textarea.focus();
        
        // Mettre à jour le word count
        textarea.dispatchEvent(new Event('input'));
        
        console.log(`😀 Emoji inséré: ${emoji}`);
    }

    // === VALIDATION ===
    validateInsight() {
        const textarea = document.getElementById('contentTextarea');
        if (!textarea || !textarea.value.trim()) {
            this.showNotification('warning', '⚠️ Veuillez saisir du contenu avant de valider');
            return;
        }

        // Sauvegarder le contenu
        if (this.editor && this.editor.saveContent) {
            this.editor.saveContent(textarea.value);
        }

        // Mettre à jour la motivation
        if (window.motivationSystem) {
            window.motivationSystem.updateProgress(true);
            window.motivationSystem.showNotification('success', '✅ Insight validé avec succès !');
        }

        // Passer au suivant automatiquement
        setTimeout(() => {
            this.nextInsight();
        }, 1000);
        
        console.log('✅ Insight validé et sauvegardé');
    }

    // === GESTION RESPONSIVE ===
    updateResponsive() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile && (this.isContextSidebarOpen || this.isPreviewPanelOpen)) {
            // Sur mobile, fermer les panels en mode plein écran
            this.closeAllPanels();
        }
        
        console.log(`📱 Mode responsive: ${isMobile ? 'Mobile' : 'Desktop'}`);
    }

    // === NOTIFICATIONS ===
    showNotification(type, message) {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        container.appendChild(notification);
        
        // Animer l'apparition
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Supprimer après 3 secondes
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // === SETUP MOTIVATION ===
    setupMotivationIntegration() {
        // Intégrer les boutons de validation avec la motivation
        const validateBtn = document.getElementById('validateBtn');
        const validateMainBtn = document.getElementById('validateMainBtn');
        
        [validateBtn, validateMainBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => this.validateInsight());
            }
        });
        
        console.log('✅ Intégration motivation configurée');
    }

    // === ÉVÉNEMENTS ===
    bindEvents() {
        console.log('🔗 Liaison des événements v2.0...');
        
        // === NAVIGATION ===
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousInsight());
            console.log('✅ Bouton précédent connecté');
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextInsight());
            console.log('✅ Bouton suivant connecté');
        }

        // === PERSONA HEADER ===
        const personaCompact = document.querySelector('.current-persona-compact');
        const personasMenuBtn = document.querySelector('.personas-menu-btn');
        
        if (personaCompact) {
            personaCompact.addEventListener('click', () => this.togglePersonaDropdown());
        }
        
        if (personasMenuBtn) {
            personasMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.togglePersonaDropdown();
            });
        }

        // === DROPDOWN PERSONAS ===
        const personaOptions = document.querySelectorAll('.persona-option');
        personaOptions.forEach(option => {
            option.addEventListener('click', () => {
                const persona = option.dataset.persona;
                if (persona) {
                    this.switchPersona(persona);
                    this.closePersonaDropdown();
                }
            });
        });

        // === CONTEXT BAR ===
        const btnContext = document.querySelector('.btn-context');
        const btnPreview = document.querySelector('.btn-preview');
        
        if (btnContext) {
            btnContext.addEventListener('click', () => this.toggleContextSidebar());
        }
        
        if (btnPreview) {
            btnPreview.addEventListener('click', () => this.togglePreviewPanel());
        }

        // === SIDEBARS ===
        const sidebarClose = document.querySelector('.sidebar-close');
        const panelClose = document.querySelector('.panel-close');
        
        if (sidebarClose) {
            sidebarClose.addEventListener('click', () => this.toggleContextSidebar());
        }
        
        if (panelClose) {
            panelClose.addEventListener('click', () => this.togglePreviewPanel());
        }

        // === ÉDITEUR ===
        const emojiToggle = document.querySelector('.emoji-toggle');
        if (emojiToggle) {
            emojiToggle.addEventListener('click', () => this.toggleEmojiPanel());
        }

        const emojiBtns = document.querySelectorAll('.emoji-btn');
        emojiBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const emoji = btn.textContent;
                this.insertEmoji(emoji);
            });
        });
        console.log(`✅ ${emojiBtns.length} boutons emoji connectés`);

        // === MODAL CONTENU DE BASE ===
        this.bindBaseContentModal();

        // === GESTION GLOBALE ===
        // Fermer les dropdowns en cliquant ailleurs
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.current-persona-compact') && 
                !e.target.closest('.persona-dropdown')) {
                this.closePersonaDropdown();
            }
        });

        // Gestion clavier
        document.addEventListener('keydown', (e) => {
            // Échap pour fermer les panels
            if (e.key === 'Escape') {
                this.closeAllPanels();
            }
            
            // Cmd/Ctrl + S pour valider
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                this.validateInsight();
            }
        });

        console.log('✅ Tous les événements connectés');
    }

    // === UTILITAIRES ===
    switchPersona(personaName) {
        // Mettre à jour l'affichage
        this.updatePersonaHeader(personaName);
        
        // Mettre à jour l'éditeur
        if (this.editor) {
            this.editor.selectedPersona = personaName;
            this.editor.updateDisplay();
            this.editor.saveProgress();
        }
        
        // Mettre à jour les options du dropdown
        const options = document.querySelectorAll('.persona-option');
        options.forEach(option => {
            if (option.dataset.persona === personaName.toLowerCase()) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
        
        console.log(`🎭 Persona changée vers ${personaName}`);
    }

    bindBaseContentModal() {
        const editBaseBtn = document.querySelector('.edit-base-btn');
        const baseContentModal = document.getElementById('baseContentModal');
        
        if (!editBaseBtn || !baseContentModal) return;

        editBaseBtn.addEventListener('click', () => {
            baseContentModal.style.display = 'flex';
            
            const baseContentDiv = document.getElementById('baseContent');
            const textarea = document.getElementById('baseContentTextarea');
            if (baseContentDiv && textarea) {
                const currentText = baseContentDiv.textContent || '';
                textarea.value = currentText;
            }
        });

        const closeBtn = baseContentModal.querySelector('.modal-close');
        const cancelBtn = baseContentModal.querySelector('.btn-cancel');
        const saveBtn = baseContentModal.querySelector('.btn-save');
        
        const closeModal = () => {
            baseContentModal.style.display = 'none';
        };
        
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const textarea = document.getElementById('baseContentTextarea');
                const baseContentDiv = document.getElementById('baseContent');
                
                if (textarea && baseContentDiv) {
                    const newContent = textarea.value.trim();
                    baseContentDiv.textContent = newContent;
                    
                    if (this.editor && this.editor.insights?.[this.currentIndex]) {
                        this.editor.insights[this.currentIndex].baseContent = newContent;
                        this.editor.saveProgress();
                    }
                    
                    console.log('💾 Contenu de base sauvegardé');
                    closeModal();
                }
            });
        }
        
        console.log('✅ Modal contenu de base connectée');
    }

    debugElements() {
        console.log('🔍 Debug éléments interface v2.0:');
        console.log('Header:', document.querySelector('.app-header-clean'));
        console.log('Navigation:', document.getElementById('prevBtn'), document.getElementById('nextBtn'));
        console.log('Persona compact:', document.querySelector('.current-persona-compact'));
        console.log('Context bar:', document.querySelector('.context-bar'));
        console.log('Editor workspace:', document.querySelector('.editing-workspace'));
        console.log('Sidebars:', document.getElementById('contextSidebar'), document.getElementById('previewPanel'));
    }
}

// === INITIALISATION GLOBALE ===
function initializeInterface() {
    console.log('🌟 Initialisation Interface v2.0...');
    
    if (window.interfaceController) {
        console.log('ℹ️ Interface déjà initialisée');
        return window.interfaceController;
    }
    
    window.interfaceController = new InterfaceController();
    return window.interfaceController;
}

// Auto-initialisation
document.addEventListener('DOMContentLoaded', () => {
    initializeInterface();
});

// Export global
window.InterfaceController = InterfaceController;
window.initializeInterface = initializeInterface; 