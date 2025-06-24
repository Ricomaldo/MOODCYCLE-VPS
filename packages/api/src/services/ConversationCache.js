// services/ConversationCache.js
class ConversationCache {
    constructor() {
      this.cache = new Map();
      this.TTL = 4 * 60 * 60 * 1000; // 4 heures
      this.MAX_MESSAGES = 12; // Garder 12 messages pour analyse
      this.RECENT_MESSAGES = 4; // Envoyer seulement 4 derniers à Claude
      
      // Stats pour monitoring
      this.stats = {
        hits: 0,
        misses: 0,
        compressions: 0
      };
      
      // Nettoyage automatique toutes les 30min
      setInterval(() => this.cleanup(), 30 * 60 * 1000);
    }
  
    // Récupérer conversation
    get(deviceId) {
      const entry = this.cache.get(deviceId);
      if (!entry) {
        this.stats.misses++;
        return { messages: [] };
      }
      
      // Vérifier TTL
      if (Date.now() - entry.lastActive > this.TTL) {
        this.cache.delete(deviceId);
        this.stats.misses++;
        return { messages: [] };
      }
      
      this.stats.hits++;
      return {
        messages: entry.messages,
        lastActive: entry.lastActive,
        persona: entry.persona,
        phase: entry.phase
      };
    }
  
    // Ajouter messages
    add(deviceId, userMessage, aiResponse, context) {
      const existing = this.get(deviceId);
      
      // Ajouter nouveaux messages
      existing.messages.push(
        { role: 'user', content: userMessage, timestamp: Date.now() },
        { role: 'assistant', content: aiResponse, timestamp: Date.now() }
      );
      
      // ✅ FIX: Validation défensive avant slice()
      if (Array.isArray(existing.messages) && existing.messages.length > this.MAX_MESSAGES) {
        existing.messages = existing.messages.slice(-this.MAX_MESSAGES);
      }
      
      // Mettre à jour cache
      this.cache.set(deviceId, {
        messages: existing.messages || [],
        lastActive: Date.now(),
        persona: context?.persona,
        phase: context?.currentPhase
      });
    }
  
    // Fusionner contextes client + cache avec compression intelligente
    mergeWithClientContext(deviceId, clientContext) {
      const cached = this.get(deviceId);
      const clientMessages = clientContext?.conversation?.recent || [];
      
      // Combiner tous les messages
      const allMessages = [...cached.messages, ...clientMessages];
      
      // Dédupliquer basé sur timestamp + content
      const uniqueMessages = this.deduplicateMessages(allMessages);
      
      // Séparer messages récents et anciens
      const recent = uniqueMessages.slice(-this.RECENT_MESSAGES);
      const older = uniqueMessages.slice(-this.MAX_MESSAGES, -this.RECENT_MESSAGES);
      
      // Générer résumé thématique si messages anciens
      let summary = null;
      if (older.length > 0) {
        summary = this.generateThematicSummary(older);
        this.stats.compressions++;
      }
      
      return {
        messages: recent,
        summary: summary,
        continuity: this.checkContinuity(cached.lastActive),
        hasCache: cached.messages.length > 0,
        totalMessagesAnalyzed: uniqueMessages.length
      };
    }
  
    // Dédupliquer messages basé sur contenu + timing proche
    deduplicateMessages(messages) {
      const seen = new Map();
      return messages.filter(msg => {
        // ✅ FIX: Validation défensive avant slice()
        if (!msg || !msg.content || typeof msg.content !== 'string') {
          console.warn('⚠️ Message invalide dans deduplicateMessages:', msg);
          return false;
        }

        const key = `${msg.role}:${msg.content.slice(0, 50)}`;
        const lastSeen = seen.get(key);
        
        // Si message similaire vu dans les 5 dernières secondes, skip
        if (lastSeen && msg.timestamp - lastSeen < 5000) {
          return false;
        }
        
        seen.set(key, msg.timestamp);
        return true;
      });
    }
  
    // Générer résumé thématique intelligent
    generateThematicSummary(messages) {
      const themes = {
        symptoms: new Set(),
        emotions: new Set(),
        solutions: new Set(),
        topics: new Set()
      };
      
      // Mots-clés pour extraction thématique
      const keywords = {
        symptoms: ['douleur', 'mal', 'fatigue', 'épuisée', 'crampe', 'migraine', 'nausée'],
        emotions: ['triste', 'anxieuse', 'stressée', 'heureuse', 'énervée', 'frustrée', 'sereine'],
        solutions: ['repos', 'exercice', 'méditation', 'tisane', 'massage', 'chaleur', 'étirement'],
        topics: ['travail', 'relation', 'famille', 'sommeil', 'alimentation', 'sport']
      };
      
      // Analyser chaque message
      messages.forEach(msg => {
        const content = msg.content.toLowerCase();
        
        // Extraire thèmes par catégorie
        Object.entries(keywords).forEach(([category, words]) => {
          words.forEach(word => {
            if (content.includes(word)) {
              themes[category].add(word);
            }
          });
        });
      });
      
      // Construire résumé structuré
      const summaryParts = [];
      
      if (themes.symptoms.size > 0) {
        summaryParts.push(`Symptômes: ${[...themes.symptoms].join(', ')}`);
      }
      
      if (themes.emotions.size > 0) {
        summaryParts.push(`État émotionnel: ${[...themes.emotions].join(', ')}`);
      }
      
      if (themes.solutions.size > 0) {
        summaryParts.push(`Solutions abordées: ${[...themes.solutions].join(', ')}`);
      }
      
      // Calculer durée conversation
      const duration = messages.length > 0 ? 
        Math.round((messages[messages.length-1].timestamp - messages[0].timestamp) / 60000) : 0;
      
      if (duration > 0) {
        summaryParts.push(`Durée: ${duration} min`);
      }
      
      return summaryParts.length > 0 ? 
        `[Contexte précédent: ${summaryParts.join('. ')}]` : 
        null;
    }
  
    // Vérifier continuité conversation
    checkContinuity(lastActive) {
      if (!lastActive) return { isNew: true, gap: 0 };
      
      const gapMinutes = Math.floor((Date.now() - lastActive) / 60000);
      return {
        isNew: gapMinutes > 30,
        gap: gapMinutes,
        shouldRecap: gapMinutes > 10 && gapMinutes < 30
      };
    }
  
    // Nettoyage périodique
    cleanup() {
      const now = Date.now();
      let cleaned = 0;
      
      for (const [deviceId, entry] of this.cache) {
        if (now - entry.lastActive > this.TTL) {
          this.cache.delete(deviceId);
          cleaned++;
        }
      }
      
      if (cleaned > 0) {
        console.log(`🧹 ConversationCache: Nettoyé ${cleaned} conversations expirées`);
      }
    }
  
    // Vider cache (admin)
    clear() {
      const count = this.cache.size;
      this.cache.clear();
      this.stats = { hits: 0, misses: 0, compressions: 0 };
      return count;
    }
  
    // Stats pour monitoring
    getStats() {
      const avgMessageCount = this.cache.size > 0 ?
        [...this.cache.values()].reduce((sum, entry) => sum + entry.messages.length, 0) / this.cache.size : 0;
      
      return {
        activeConversations: this.cache.size,
        totalMessages: [...this.cache.values()].reduce((sum, entry) => sum + entry.messages.length, 0),
        avgMessagesPerConversation: Math.round(avgMessageCount * 10) / 10,
        cacheHitRate: this.stats.hits > 0 ? 
          Math.round((this.stats.hits / (this.stats.hits + this.stats.misses)) * 100) : 0,
        compressionCount: this.stats.compressions,
        memoryUsage: JSON.stringify([...this.cache]).length,
        oldestConversation: this.cache.size > 0 ?
          new Date(Math.min(...[...this.cache.values()].map(e => e.lastActive))).toISOString() : null
      };
    }
  }
  
  module.exports = new ConversationCache();