# 📊 **Guide Complet Analytics MoodCycle**

*Version 1.0 - Janvier 2025*

## 🎯 **Vue d'Ensemble**

Ce document détaille **toutes les données** que nous collectons et pouvons collecter dans l'écosystème MoodCycle pour optimiser l'expérience utilisateur avant et après le lancement.

---

## 📡 **1. DONNÉES ACTUELLEMENT COLLECTÉES**

### 🏗️ **Infrastructure Hostinger**
```javascript
{
  serverMetrics: {
    requests: 1247,                    // Requêtes API totales
    responseTime: 145,                 // Temps réponse moyen (ms)
    errorRate: 0.02,                   // Taux d'erreur
    uptime: 99.8,                      // Disponibilité %
    activeConnections: 12,             // Connexions simultanées
    dataTransfer: 2.3,                 // GB transférés
    peakHours: [8, 13, 20],           // Heures de pic
    geographicDistribution: {
      "FR": 78,                        // % utilisatrices France
      "CA": 12,                        // % utilisatrices Canada
      "BE": 10                         // % utilisatrices Belgique
    }
  },
  
  apiEndpoints: {
    "/api/chat": { calls: 456, avgTime: 890 },
    "/api/stores/sync": { calls: 89, avgTime: 234 },
    "/api/stores/analytics": { calls: 145, avgTime: 67 },
    "/api/health": { calls: 2341, avgTime: 12 }
  }
}
```

### 📱 **Stores Zustand Collectés (8 Stores)**

#### **👤 useUserStore - Profil Utilisateur**
```javascript
{
  profile: {
    prenom: "Marie",                   // Prénom utilisatrice
    ageRange: "26-35",                 // Tranche d'âge
    journeyChoice: "emotions",         // Parcours choisi
    completed: true                    // Profil complété
  },
  
  preferences: {                       // Préférences 0-5
    symptoms: 4,                       // Symptômes physiques
    moods: 5,                          // Gestion émotionnelle
    phyto: 2,                          // Phytothérapie
    phases: 4,                         // Énergie cyclique
    lithotherapy: 1,                   // Lithothérapie
    rituals: 3,                        // Rituels bien-être
    terminology: "medical"             // Terminologie cyclique
  },
  
  persona: {
    assigned: "emma",                  // Persona assigné
    confidence: 0.8,                   // Confiance calcul
    lastCalculated: "2025-01-15T10:30:00Z",
    scores: {...}                      // Scores détaillés
  },
  
  melune: {
    avatarStyle: "classic",            // Style avatar
    tone: "friendly",                  // Ton conversation
    personalityMatch: "high",          // Compatibilité
    position: "bottom-right",          // Position écran
    animated: true                     // Animations
  }
}
```

#### **🩸 useCycleStore - Cycle Menstruel**
```javascript
{
  lastPeriodDate: "2025-01-01T00:00:00Z",  // Dernières règles
  length: 28,                               // Durée cycle
  periodDuration: 5,                        // Durée règles
  isRegular: true,                          // Régularité
  trackingExperience: "beginner",           // Expérience tracking
  
  observations: [                           // Observations détaillées
    {
      id: "obs_123",
      feeling: 3,                           // Ressenti 1-5
      energy: 4,                            // Énergie 1-5
      notes: "Bien dormi aujourd'hui",
      timestamp: "2025-01-15T08:00:00Z",
      phase: "follicular",                  // Phase détectée
      cycleDay: 15                          // Jour du cycle
    }
  ],
  
  detectedPatterns: {                       // Patterns détectés
    regularityScore: 0.85,
    averageCycleLength: 28.3,
    averagePeriodLength: 5.2,
    phaseConsistency: 0.78
  }
}
```

#### **💬 useChatStore - Conversations**
```javascript
{
  messages: [
    {
      id: "msg_456",
      text: "Comment tu te sens aujourd'hui ?",
      isUser: false,                        // Message de Melune
      timestamp: "2025-01-15T09:15:00Z",
      phase: "follicular",                  // Phase lors du message
      conversationId: "conv_789",
      metadata: {
        responseTime: 1.2,                  // Temps réponse IA
        tokens: 45,                         // Tokens utilisés
        relevanceScore: 0.87                // Pertinence réponse
      }
    }
  ],
  
  conversationStats: {
    totalMessages: 234,
    averagePerDay: 3.2,
    longestConversation: 12,                // Messages dans conversation
    averageResponseTime: 1.8,               // Secondes
    topicDistribution: {
      "cycle": 45,                          // % messages sur cycle
      "emotions": 32,                       // % messages émotions
      "symptoms": 23                        // % messages symptômes
    }
  }
}
```

#### **📝 useNotebookStore - Carnet Personnel**
```javascript
{
  entries: [
    {
      id: "entry_321",
      content: "Aujourd'hui j'ai ressenti une énergie incroyable...",
      type: "personal",                     // Type entrée
      tags: ["#émotion", "#follicular"],    // Tags associés
      timestamp: 1705312800000,
      phase: "follicular",
      wordCount: 67,                        // Nombre de mots
      sentiment: "positive",                // Sentiment détecté
      readingTime: 25                       // Temps lecture estimé
    }
  ],
  
  writingPatterns: {
    averageEntryLength: 89,                 // Mots par entrée
    writingFrequency: 0.6,                  // Entrées par jour
    preferredWritingTime: "evening",        // Moment préféré
    emotionalTone: "reflective",            // Ton dominant
    topTags: ["#émotion", "#cycle", "#bien-être"],
    phaseWritingDistribution: {
      "menstrual": 0.35,                    // % entrées en menstruel
      "follicular": 0.25,
      "ovulatory": 0.20,
      "luteal": 0.20
    }
  }
}
```

#### **📈 useEngagementStore - Métriques Engagement**
```javascript
{
  metrics: {
    // Utilisation globale
    daysUsed: 45,                          // Jours d'utilisation
    sessionsCount: 120,                    // Nombre de sessions
    totalTimeSpent: 890,                   // Minutes totales
    averageSessionLength: 7.4,             // Minutes par session
    lastActiveDate: "2025-01-15",
    
    // Actions spécifiques
    conversationsStarted: 25,
    conversationsCompleted: 18,            // Taux completion: 72%
    notebookEntriesCreated: 67,
    cycleTrackedDays: 40,
    insightsSaved: 12,
    vignettesEngaged: 34,
    
    // Progression cyclique
    phasesExplored: ["menstrual", "follicular", "ovulatory"],
    cyclesCompleted: 3,
    autonomySignals: 8                     // Signaux d'autonomie
  },
  
  maturity: {
    current: "learning",                   // Niveau maturité
    progression: 0.6,                      // Progression 0-1
    levelChangedAt: "2025-01-10T00:00:00Z",
    signals: {
      autonomySignals: 8,                  // Signaux autonomie
      deepEngagement: 15,                  // Engagement profond
      consistentUsage: 22                  // Usage consistant
    }
  }
}
```

#### **🧠 useUserIntelligence - Intelligence Comportementale**
```javascript
{
  learning: {
    confidence: 68,                        // Confiance système 0-100
    
    timePatterns: {
      favoriteHours: [8, 14, 20],          // Heures préférées
      activeDays: ["monday", "wednesday"],  // Jours actifs
      sessionDuration: 8,                   // Durée session moyenne
      peakProductivity: "morning"           // Moment productif
    },
    
    conversationPrefs: {
      responseLength: "medium",             // Longueur réponse préférée
      questionTypes: ["emotional", "cycle"], // Types questions
      successfulPrompts: [...],             // Prompts efficaces
      avoidedTopics: [...],                 // Sujets évités
      preferredTone: "empathetic"           // Ton préféré
    },
    
    phasePatterns: {                        // Patterns par phase
      menstrual: { 
        mood: "calm", 
        energy: 2, 
        topics: ["cocooning", "repos"],
        symptoms: ["crampes", "fatigue"]
      },
      follicular: { 
        mood: "energetic", 
        energy: 4, 
        topics: ["projets", "créativité"],
        symptoms: ["énergie", "motivation"]
      },
      ovulatory: { 
        mood: "social", 
        energy: 5, 
        topics: ["communication", "confiance"],
        symptoms: ["rayonnement", "sociabilité"]
      },
      luteal: { 
        mood: "introspective", 
        energy: 3, 
        topics: ["préparation", "sensibilité"],
        symptoms: ["sensibilité", "tension"]
      }
    }
  },
  
  observationPatterns: {
    consistency: 0.8,                      // Cohérence observations
    confidence: 75,                        // Confiance patterns
    preferredMode: "hybrid",               // Mode préféré
    lastObservations: [...],               // Observations récentes
    
    autonomySignals: {
      correctsPredictions: 5,               // Corrections prédictions
      manualPhaseChanges: 3,               // Changements manuels
      detailedObservations: 12,            // Observations détaillées
      patternRecognitions: 4               // Reconnaissance patterns
    }
  }
}
```

#### **🧭 useNavigationStore - Navigation & Filtres**
```javascript
{
  notebookFilters: {
    type: "all",                          // Filtre type
    phase: "follicular",                  // Filtre phase
    tags: ["#émotion"],                   // Tags actifs
    searchQuery: "",                      // Recherche
    sortBy: "recent"                      // Tri
  },
  
  navigationHistory: {
    lastTab: "notebook",                  // Dernier onglet
    lastVignetteId: "vignette_123",       // Dernière vignette
    vignetteInteractions: {               // Interactions vignettes
      "vignette_123": 5,
      "vignette_456": 2
    },
    screenTime: {                         // Temps par écran
      "cycle": 180,                       // Secondes
      "conseils": 95,
      "notebook": 220
    }
  }
}
```

#### **⚙️ useAppStore - État Global**
```javascript
{
  isFirstLaunch: false,                   // Premier lancement
  currentTheme: "dark",                   // Thème actuel
  isOnline: true,                         // Statut connexion
  devMode: false,                         // Mode développement
  
  notifications: {
    enabled: true,                        // Notifications activées
    cycleReminders: true,                 // Rappels cycle
    dailyReflection: false,               // Réflexion quotidienne
    pushTokens: [...],                    // Tokens push
    clickThroughRate: 0.23               // Taux clic notifications
  },
  
  performance: {
    appStartTime: 1.2,                   // Temps démarrage
    averageNavigationTime: 0.3,          // Temps navigation
    memoryUsage: 45,                     // MB utilisés
    crashCount: 0                        // Nombre crashes
  }
}
```

### 📊 **Métadonnées Automatiques**
```javascript
{
  metadata: {
    timestamp: "2025-01-15T10:30:00Z",    // Horodatage sync
    platform: "ios",                      // Plateforme
    appVersion: "1.0.0",                  // Version app
    deviceModel: "iPhone 14",             // Modèle device
    osVersion: "17.2",                    // Version OS
    syncType: "automatic",                // Type sync
    deviceId: "device_1705312800_abc123", // ID unique
    batteryLevel: 0.67,                   // Niveau batterie
    networkType: "wifi",                  // Type réseau
    locale: "fr-FR",                      // Locale
    timezone: "Europe/Paris"              // Fuseau horaire
  }
}
```

---

## 🔮 **2. DONNÉES SUPPLÉMENTAIRES POSSIBLES**

### 📱 **Métriques Techniques Avancées**
```javascript
{
  advancedDeviceMetrics: {
    screenTime: 1250,                     // Temps total app (secondes)
    backgroundUsage: 45,                  // Minutes arrière-plan
    batteryImpact: "low",                 // Impact batterie
    dataUsage: 2.3,                       // MB utilisés
    offlineTime: 120,                     // Minutes offline
    crashReports: [...],                  // Rapports crash
    performanceMetrics: {
      frameRate: 59.2,                    // FPS moyen
      memoryPeaks: [67, 89, 45],         // Pics mémoire
      cpuUsage: 0.12,                     // Usage CPU
      diskUsage: 156                      // MB stockage
    }
  }
}
```

### 🎨 **Préférences UI Détaillées**
```javascript
{
  uiAnalytics: {
    interactionPatterns: {
      singleTaps: 1245,                   // Taps simples
      doubleTaps: 23,                     // Double taps
      longPresses: 56,                    // Appuis longs
      swipeGestures: 189,                 // Gestes swipe
      pinchZoom: 12,                      // Zooms
      scrollDistance: 45678               // Distance scroll (px)
    },
    
    accessibilityUsage: {
      voiceOverEnabled: false,            // VoiceOver
      largeFontSize: false,               // Grande police
      highContrast: false,                // Contraste élevé
      reducedMotion: false,               // Mouvement réduit
      colorBlindMode: false               // Mode daltonien
    },
    
    visualPreferences: {
      preferredImageTypes: ["illustration", "photo"],
      colorPreferences: ["warm", "soft"],
      animationEngagement: 0.78,          // Engagement animations
      iconClickRate: 0.65                 // Taux clic icônes
    }
  }
}
```

### 🧠 **Intelligence Comportementale Poussée**
```javascript
{
  behaviorAnalytics: {
    readingBehavior: {
      averageReadingSpeed: 250,           // Mots/minute
      contentCompletionRate: 0.78,        // % contenu lu
      scrollDepth: 0.85,                  // % scroll moyen
      timeOnContent: 145,                 // Secondes/contenu
      skippedContent: 23,                 // Contenus ignorés
      revisitedContent: 8,                // Contenus relus
      bookmarkedContent: 5                // Contenus sauvés
    },
    
    decisionPatterns: {
      choiceLatency: 2.3,                 // Temps décision (s)
      changeOfMind: 0.12,                 // Taux changement
      explorationDepth: 3.4,              // Profondeur exploration
      returnToContent: 0.34,              // Taux retour contenu
      helpSeeking: 0.08                   // Demande aide
    },
    
    learningPatterns: {
      conceptRetention: 0.72,             // Rétention concepts
      skillProgression: 0.65,             // Progression compétences
      knowledgeApplication: 0.58,         // Application connaissances
      questioningBehavior: 0.43,          // Comportement questionnement
      insightGeneration: 0.39             // Génération insights
    }
  }
}
```

### 🔄 **Patterns Cycliques Prédictifs**
```javascript
{
  predictiveCycleAnalytics: {
    predictionAccuracy: {
      nextPeriodPredictions: 0.82,        // Précision prédictions
      phasePredictions: 0.75,             // Précision phases
      symptomPredictions: 0.68,           // Précision symptômes
      moodPredictions: 0.71,              // Précision humeur
      energyPredictions: 0.73             // Précision énergie
    },
    
    adaptivePatterns: {
      seasonalInfluence: 0.34,            // Influence saison
      stressCorrelation: 0.67,            // Corrélation stress
      sleepImpact: 0.45,                  // Impact sommeil
      exerciseCorrelation: 0.52,          // Corrélation exercice
      nutritionImpact: 0.38               // Impact nutrition
    },
    
    irregularityAnalysis: {
      variationRange: [25, 32],           // Plage variation
      stressEvents: [...],                // Événements stress
      environmentalFactors: [...],        // Facteurs environnementaux
      lifestyleChanges: [...]             // Changements lifestyle
    }
  }
}
```

### 💬 **Analyse Conversationnelle NLP**
```javascript
{
  nlpAnalytics: {
    languagePatterns: {
      vocabularyRichness: 0.75,           // Richesse vocabulaire
      emotionalTone: "positive",          // Ton émotionnel
      sentimentEvolution: [...],          // Évolution sentiment
      topicProgression: [...],            // Progression sujets
      linguisticComplexity: 0.62,         // Complexité linguistique
      personalityMarkers: ["curious", "analytical"]
    },
    
    conversationQuality: {
      coherenceScore: 0.84,               // Score cohérence
      relevanceScore: 0.79,               // Score pertinence
      engagementScore: 0.81,              // Score engagement
      satisfactionScore: 0.77,            // Score satisfaction
      learningEffectiveness: 0.68         // Efficacité apprentissage
    }
  }
}
```

### 🎯 **Métriques Bien-être & Impact**
```javascript
{
  wellbeingAnalytics: {
    wellbeingTrend: {
      initialScore: 6.2,                  // Score initial /10
      currentScore: 7.8,                  // Score actuel /10
      peakScore: 8.5,                     // Meilleur score
      improvementRate: 0.15,              // Amélioration/semaine
      stabilityScore: 0.73,               // Score stabilité
      resilienceScore: 0.68               // Score résilience
    },
    
    autonomyDevelopment: {
      selfAwarenessScore: 0.82,           // Conscience de soi
      patternRecognition: 0.75,           // Reconnaissance patterns
      selfCareActions: 34,                // Actions bien-être
      proactiveTracking: 0.68,            // Tracking proactif
      insightApplication: 0.71,           // Application insights
      independentDecisions: 0.64          // Décisions autonomes
    },
    
    impactMetrics: {
      cycleUnderstanding: 0.79,           // Compréhension cycle
      symptomManagement: 0.71,            // Gestion symptômes
      emotionalRegulation: 0.68,          // Régulation émotionnelle
      lifestyleOptimization: 0.62,        // Optimisation lifestyle
      relationshipImpact: 0.58            // Impact relations
    }
  }
}
```

---

## 🛠️ **3. IMPLÉMENTATION TECHNIQUE**

### 📊 **Analytics Dashboard Admin**
- **Métriques temps réel** : Testeuses actives, engagement, patterns
- **Visualisations** : Graphiques personas, maturité, cycles
- **Alertes** : Anomalies, problèmes, opportunités
- **Exports** : Données CSV, JSON, rapports PDF

### 🔄 **Collecte Automatique**
- **Sync automatique** : Toutes les 24h
- **Sync manuelle** : Bouton dans DevPanel
- **Sync intelligente** : Basée sur changements significatifs
- **Sync offline** : Queue et retry automatique

### 🔐 **Sécurité & Confidentialité**
- **Anonymisation** : DeviceId tronqué côté admin
- **Chiffrement** : Données sensibles chiffrées
- **RGPD** : Droit à l'oubli, export données
- **Consentement** : Opt-in explicite utilisatrices

### ⚡ **Performance**
- **Cache intelligent** : Calculs côté serveur
- **Compression** : Données compressées
- **Pagination** : Gros datasets paginés
- **Indexation** : Base données optimisée

---

## 🎯 **4. BÉNÉFICES BUSINESS**

### 📈 **Optimisation Produit**
- **Personas affinés** : Distribution réelle vs théorique
- **Fonctionnalités prioritaires** : Basées sur usage réel
- **UX optimisée** : Patterns navigation, abandons
- **Contenu personnalisé** : Basé sur préférences réelles

### 🚀 **Lancement Optimisé**
- **Stratégie marketing** : Ciblage précis personas
- **Onboarding optimisé** : Basé sur points friction
- **Retention améliorée** : Patterns engagement identifiés
- **Monétisation** : Features premium basées sur valeur

### 📊 **KPIs Mesurables**
- **Engagement** : Temps passé, actions, retention
- **Satisfaction** : Scores bien-être, feedback
- **Efficacité** : Patterns apprentissage, autonomie
- **Croissance** : Acquisition, activation, retention

---

## 🔄 **5. ROADMAP ANALYTICS**

### **Phase 1 : Collecte Base** ✅
- [x] 8 stores Zustand collectés
- [x] API endpoints fonctionnels
- [x] Dashboard admin basique
- [x] Sécurité & anonymisation

### **Phase 2 : Intégration App** 🚀
- [ ] Service intégré dans App.js
- [ ] Bouton sync DevPanel
- [ ] Monitoring paramètres
- [ ] Tests avec testeuses

### **Phase 3 : Analytics Avancés** 📊
- [ ] Métriques comportementales
- [ ] Patterns prédictifs
- [ ] Analytics NLP
- [ ] Visualisations avancées

### **Phase 4 : Intelligence Artificielle** 🤖
- [ ] Recommandations personnalisées
- [ ] Prédictions comportementales
- [ ] Optimisation automatique
- [ ] Insights génératifs

---

## 🎉 **CONCLUSION**

Avec ce système d'analytics, MoodCycle devient **data-driven** et peut :
- **Comprendre** ses utilisatrices en profondeur
- **Optimiser** l'expérience en temps réel
- **Prédire** les besoins et comportements
- **Personnaliser** le contenu et les recommandations
- **Mesurer** l'impact réel sur le bien-être

C'est un **avantage concurrentiel majeur** qui transforme une app en un **écosystème intelligent** ! 🚀

---

*📝 Document maintenu par l'équipe MoodCycle - Dernière mise à jour : Janvier 2025* 