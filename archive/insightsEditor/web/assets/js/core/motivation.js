// === SYSTÈME DE MOTIVATION JEZA ===

// Transforme l'écriture de 900 insights en expérience addictive

class MotivationSystem {
  constructor() {
    this.currentPersona = 'emma';
    this.currentInsight = 1;
    this.totalInsights = 900;
    this.insightsPerPersona = 180;
    this.streak = 0;
    this.sessionsToday = 0;
    this.milestones = [50, 100, 150, 180]; // Par persona
    this.globalMilestones = [100, 250, 500, 750, 900];
    
    this.personas = {
      emma: {
        name: 'Emma',
        color: '#E91E63',
        age: '16-25 ans',
        style: 'Découverte énergique',
        completed: 0,
        total: 180
      },
      laure: {
        name: 'Laure',
        color: '#2196F3',
        age: '25-35 ans', 
        style: 'Efficacité pro',
        completed: 0,
        total: 180
      },
      sylvie: {
        name: 'Sylvie',
        color: '#FF9800',
        age: '35-45 ans',
        style: 'Transition sereine',
        completed: 0,
        total: 180
      },
      christine: {
        name: 'Christine',
        color: '#9C27B0',
        age: '45+ ans',
        style: 'Sagesse accomplie',
        completed: 0,
        total: 180
      },
      clara: {
        name: 'Clara',
        color: '#4CAF50',
        age: 'Scientifique',
        style: 'Rationalité pure',
        completed: 0,
        total: 180
      }
    };
    
    this.motivationalMessages = {
      milestone: [
        "🎉 Incroyable ! Tu déchires tout !",
        "🚀 Tu es une machine à insights !",
        "⭐ Jeza la légende ! Continue !",
        "🏆 Performance de championne !",
        "💎 Tu brilles de mille feux !"
      ],
      streak: [
        "🔥 Tu es en feu aujourd'hui !",
        "⚡ Rien ne peut t'arrêter !",
        "🌟 Quelle productivité !",  
        "💪 Force pure d'écriture !",
        "🎯 Précision et régularité !"
      ],
      completion: [
        "👑 Persona terminée ! Tu domines !",
        "🎊 Quel talent ! Next level !",
        "🌈 Magnifique travail accompli !",
        "🎪 Show must go on ! Suivante !",
        "🎖️ Médaille d'or bien méritée !"
      ]
    };
    
    this.init();
  }
  
  init() {
    this.loadProgress();
    this.setupEventListeners();
    this.startAutosave();
    this.updateUI();
    this.showWelcomeMessage();
  }
  
  // === PROGRESSION & STATS ===
  updateProgress(insightCompleted = false) {
    if (insightCompleted) {
      this.personas[this.currentPersona].completed++;
      this.currentInsight++;
      this.streak++;
      this.checkMilestones();
      this.saveProgress();
    }
    this.updateUI();
  }
  
  checkMilestones() {
    const completed = this.personas[this.currentPersona].completed;
    const totalCompleted = this.getTotalCompleted();
    
    // Milestone persona
    if (this.milestones.includes(completed)) {
      this.showMilestoneNotification(completed, 'persona');
    }
    
    // Milestone global
    if (this.globalMilestones.includes(totalCompleted)) {
      this.showMilestoneNotification(totalCompleted, 'global');
    }
    
    // Persona complète
    if (completed === this.insightsPerPersona) {
      this.showPersonaCompletionNotification();
    }
    
    // Streak notifications
    if (this.streak > 0 && this.streak % 5 === 0) {
      this.showStreakNotification();
    }
  }
  
  getTotalCompleted() {
    return Object.values(this.personas).reduce((sum, p) => sum + p.completed, 0);
  }
  
  getCompletedToday() {
    return this.sessionsToday;
  }
  
  // === NOTIFICATIONS ===
  showNotification(type, content, duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type} show`;
    
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-header">
          <div class="icon bounce">${content.icon}</div>
          <button class="close-btn" onclick="this.closest('.notification').remove()">×</button>
        </div>
        <div class="notification-body">
          <h4 class="title">${content.title}</h4>
          <p class="message">${content.message}</p>
          ${content.details ? `<p class="details">${content.details}</p>` : ''}
        </div>
        ${content.actions ? `<div class="notification-actions">${content.actions}</div>` : ''}
      </div>
      <div class="notification-progress"></div>
    `;
    
    // Ajouter confetti pour milestones
    if (type === 'milestone') {
      notification.innerHTML += '<div class="confetti"></div>';
    }
    
    this.getNotificationContainer().appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('hide');
      setTimeout(() => notification.remove(), 500);
    }, duration);
    
    // Son de notification (optionnel)
    this.playNotificationSound(type);
  }
  
  showMilestoneNotification(number, scope) {
    const message = this.getRandomMessage('milestone');
    const isGlobal = scope === 'global';
    
    this.showNotification('milestone', {
      icon: isGlobal ? '🎊' : '🎯',
      title: `${isGlobal ? 'Milestone Global' : 'Milestone Persona'} : ${number}`,
      message: message,
      details: isGlobal ? 
        `${900 - number} insights restants au total` :
        `${this.insightsPerPersona - number} insights restants pour ${this.personas[this.currentPersona].name}`,
      actions: `<button class="action-btn primary">Continuer !</button>`
    }, 7000);
    
    // Celebrate animation
    document.body.classList.add('celebrating');
    setTimeout(() => document.body.classList.remove('celebrating'), 3000);
  }
  
  showStreakNotification() {
    const message = this.getRandomMessage('streak');
    
    this.showNotification('streak', {
      icon: '🔥',
      title: `Streak : ${this.streak} insights !`,
      message: message,
      details: `Tu as écrit ${this.streak} insights d'affilée aujourd'hui`
    });
  }
  
  showPersonaCompletionNotification() {
    const persona = this.personas[this.currentPersona];
    const message = this.getRandomMessage('completion');
    
    this.showNotification('persona-complete', {
      icon: '👑',
      title: `${persona.name} terminée !`,
      message: message,
      details: `180 insights ${persona.style} dans la poche !`,
      actions: `<button class="action-btn primary" onclick="motivationSystem.switchToNextPersona()">Persona suivante</button>`
    }, 10000);
  }
  
  showWelcomeMessage() {
    const completed = this.getTotalCompleted();
    const remaining = this.totalInsights - completed;
    
    this.showToast('success', `👋 Salut Jeza ! ${remaining} insights t'attendent aujourd'hui !`);
  }
  
  showToast(type, message, duration = 3000) {
    console.log(`🍞 Toast ${type}: ${message}`);
    
    // Créer l'élément toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    // Ajouter au DOM
    document.body.appendChild(toast);
    
    // Animer l'apparition
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    // Supprimer après la durée
    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  }
  

  
  // === PERSONA SWITCHING ===
  switchPersona(personaId) {
    if (this.personas[personaId]) {
      const oldPersona = this.currentPersona;
      this.currentPersona = personaId;
      
      console.log(`🎭 Changement de persona: ${oldPersona} → ${personaId}`);
      
      // Mettre à jour l'interface
      this.updateUI();
      this.updatePersonaVisuals();
      this.saveProgress();
      
      this.showToast('success', `🔄 Passage à ${this.personas[personaId].name}`);
      
      // Mettre à jour les couleurs CSS
      this.updatePersonaTheme();
    }
  }

  updatePersonaVisuals() {
    const persona = this.personas[this.currentPersona];
    
    console.log(`🎨 Mise à jour visuelle pour ${persona.name}`);
    
    // Mettre à jour l'avatar principal
    const mainAvatar = document.querySelector('.current-persona .avatar img');
    if (mainAvatar) {
      mainAvatar.src = `assets/images/personas/avatars/${persona.name}.jpg`;
      mainAvatar.alt = persona.name;
      console.log(`✅ Avatar principal mis à jour: ${persona.name}`);
    }
    
    // Mettre à jour le nom de la persona
    const nameElements = document.querySelectorAll('.current-persona .name, .current-persona-name');
    nameElements.forEach(el => {
      el.textContent = persona.name;
    });
    
    // Mettre à jour la description
    const subtitleEl = document.querySelector('.persona-subtitle');
    if (subtitleEl) {
      subtitleEl.textContent = `${persona.description} • ${persona.age}`;
    }
    

    
    // NOUVEAU : Mettre à jour le sélecteur de persona principal si il existe
    const personaSelect = document.querySelector('#personaSelect, .persona-select');
    if (personaSelect && personaSelect.value !== undefined) {
      personaSelect.value = this.currentPersona;
    }
    
    // Mettre à jour le nom affiché dans l'éditeur
    const editorPersonaName = document.querySelector('.editor-title .current-persona-name');
    if (editorPersonaName) {
      editorPersonaName.textContent = persona.name;
    }
    
    // Mettre à jour le placeholder du textarea si il existe
    const textarea = document.querySelector('#contentTextarea');
    if (textarea) {
      textarea.placeholder = `✏️ Adaptez le contenu pour ${persona.name}...

💡 Conseils : 
• Ajustez le ton pour ${persona.age}
• Personnalisez les exemples 
• Adaptez le niveau de détail

🎯 Objectif : Créer du contenu authentique pour ${persona.description} !`;
    }
    
    console.log(`✅ Interface mise à jour pour ${persona.name}`);
  }
  
  switchToNextPersona() {
    const personaIds = Object.keys(this.personas);
    const currentIndex = personaIds.indexOf(this.currentPersona);
    const nextIndex = (currentIndex + 1) % personaIds.length;
    
    this.switchPersona(personaIds[nextIndex]);
  }
  
  updatePersonaTheme() {
    const persona = this.personas[this.currentPersona];
    document.documentElement.style.setProperty('--current-persona-color', persona.color);
    
    // Mettre à jour les éléments UI
    const elements = document.querySelectorAll('[data-persona-color]');
    elements.forEach(el => {
      el.style.setProperty('--persona-color', persona.color);
    });
  }
  
  // === AUTOSAVE ===
  startAutosave() {
    setInterval(() => {
      this.autosave();
    }, 10000); // Toutes les 10 secondes
  }
  
  autosave() {
    // Simuler sauvegarde
    const autosaveElement = document.querySelector('.focus-autosave');
    if (autosaveElement) {
      autosaveElement.classList.add('saving');
      
      setTimeout(() => {
        autosaveElement.classList.remove('saving');
        autosaveElement.classList.add('saved');
        
        setTimeout(() => {
          autosaveElement.classList.remove('saved');
        }, 2000);
      }, 1000);
    }
    
    this.saveProgress();
  }
  
  // === EVENT LISTENERS ===
  setupEventListeners() {
    // Raccourcis clavier
    document.addEventListener('keydown', (e) => {

      
      // Alt + 1-5 : Switch persona
      if (e.altKey && e.key >= '1' && e.key <= '5') {
        e.preventDefault();
        const personas = Object.keys(this.personas);
        const index = parseInt(e.key) - 1;
        if (personas[index]) {
          this.switchPersona(personas[index]);
        }
      }
      
      
      
      // Ctrl/Cmd + S : Marquer insight terminé
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        this.updateProgress(true);
        this.showToast('success', '💾 Insight sauvegardé !');
      }
    });
    
    // Détection d'écriture
    document.addEventListener('input', (e) => {
      if (e.target.matches('textarea, input[type="text"]')) {
        this.onTyping();
      }
    });
  }
  
  onTyping() {
    // Effet de frappe - mode focus supprimé
  }
  
  // === UI UPDATES ===
  updateUI() {
    this.updateProgressCard();
    this.updateQuickSwitcher();
    this.updatePersonaTheme();
    this.updateContextCounters();
  }

  updateContextCounters() {
    // Mettre à jour le compteur global dans le contexte
    const contextCounter = document.querySelector('.context-header #globalCounter');
    if (contextCounter) {
      contextCounter.textContent = `${this.currentInsight}/${this.totalInsights}`;
    }

    // Mettre à jour le compteur dans la navigation aussi
    const navCounter = document.querySelector('.insight-info #globalCounter');
    if (navCounter) {
      navCounter.textContent = `${this.currentInsight}/${this.totalInsights}`;
    }
    
    // NOUVEAU : Mettre à jour le compteur dans l'interface principale
    const mainCounter = document.querySelector('#insightCounter');
    if (mainCounter) {
      mainCounter.textContent = `${this.currentInsight}/${this.totalInsights}`;
    }
    
    // Mettre à jour le titre de l'insight si il existe
    const insightTitle = document.querySelector('.insight-title, .current-insight-title');
    if (insightTitle) {
      insightTitle.textContent = `Insight ${this.currentInsight}`;
    }
  }
  
  updateProgressCard() {
    const card = document.querySelector('.progress-card');
    if (!card) return;
    
    const persona = this.personas[this.currentPersona];
    const percentage = Math.round((persona.completed / persona.total) * 100);
    
    // Mettre à jour les valeurs
    const elements = {
      '.current-count': persona.completed,
      '.total': `/ ${persona.total}`,
      '.percentage': `${percentage}%`,
      '.persona-name': persona.name,
      '.streak-count': this.streak,
      '.stat-number[data-stat="today"]': this.getCompletedToday(),
      '.stat-number[data-stat="total"]': this.getTotalCompleted()
    };
    
    Object.entries(elements).forEach(([selector, value]) => {
      const element = card.querySelector(selector);
      if (element) element.textContent = value;
    });
    
    // Mettre à jour la barre de progression
    const progressFill = card.querySelector('.progress-fill');
    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }
    
    // Mettre à jour les milestones
    this.updateMilestones(card);
  }
  
  updateMilestones(card) {
    const milestoneElements = card.querySelectorAll('.milestone');
    const completed = this.personas[this.currentPersona].completed;
    
    milestoneElements.forEach((element, index) => {
      const milestone = this.milestones[index];
      const icon = element.querySelector('.milestone-icon');
      
      if (completed >= milestone) {
        icon.classList.add('reached');
        icon.textContent = '✓';
      } else if (milestone === this.getNextMilestone(completed)) {
        icon.classList.add('current');
        icon.textContent = milestone;
      } else {
        icon.textContent = milestone;
      }
    });
  }
  
  getNextMilestone(completed) {
    return this.milestones.find(m => m > completed) || this.milestones[this.milestones.length - 1];
  }
  
  updateQuickSwitcher() {
    const switcher = document.querySelector('.quick-switcher');
    if (!switcher) return;
    
    const buttons = switcher.querySelectorAll('.persona-quick-btn');
    buttons.forEach(btn => {
      const personaId = btn.dataset.persona;
      if (personaId === this.currentPersona) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
  
  // === STORAGE ===
  saveProgress() {
    const data = {
      currentPersona: this.currentPersona,
      currentInsight: this.currentInsight,
      personas: this.personas,
      streak: this.streak,
      sessionsToday: this.sessionsToday,
      lastSave: Date.now()
    };
    
    localStorage.setItem('jeza-motivation-progress', JSON.stringify(data));
  }
  
  loadProgress() {
    const saved = localStorage.getItem('jeza-motivation-progress');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        
        // Vérifier si c'est aujourd'hui
        const today = new Date().toDateString();
        const lastSave = new Date(data.lastSave).toDateString();
        
        if (today !== lastSave) {
          // Nouveau jour, reset streak si pas de progression hier
          this.streak = 0;
          this.sessionsToday = 0;
        } else {
          Object.assign(this, data);
        }
      } catch (e) {
        console.warn('Erreur lors du chargement des données:', e);
      }
    }
  }
  
  // === HELPERS ===
  getRandomMessage(type) {
    const messages = this.motivationalMessages[type];
    return messages[Math.floor(Math.random() * messages.length)];
  }
  
  getNotificationContainer() {
    let container = document.querySelector('.notification-system');
    if (!container) {
      container = document.createElement('div');
      container.className = 'notification-system';
      document.body.appendChild(container);
    }
    return container;
  }
  

  
  playNotificationSound(type) {
    // Implémentation optionnelle des sons
    if ('speechSynthesis' in window && type === 'milestone') {
      const utterance = new SpeechSynthesisUtterance('Milestone atteint !');
      utterance.volume = 0.1;
      utterance.rate = 1.2;
      speechSynthesis.speak(utterance);
    }
  }


}

// === INITIALISATION GLOBALE ===
let motivationSystem;

console.log('📦 Chargement Motivation System...');

// Fonction d'initialisation
function initializeMotivation() {
    console.log('🎯 Initialisation Motivation System...');
    motivationSystem = new MotivationSystem();
    window.motivationSystem = motivationSystem;
    console.log('✅ Motivation System initialisé:', motivationSystem);
}

// Initialiser dès que possible
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMotivation);
} else {
    initializeMotivation();
} 