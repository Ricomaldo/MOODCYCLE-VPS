# 🎯 ADMIN SPRINT 1 - Spécifications Techniques

*Extraites de l'audit API + analyse architecture existante*

## 📊 DONNÉES ONBOARDINGSTORE DISPONIBLES

### **Structure Complète Analysée**
```javascript
// useOnboardingStore.js - Données contextuelles pour Admin
const onboardingData = {
  // 1. Profil utilisateur
  userInfo: {
    prenom: "Emma",                    // Prénom collecté
    ageRange: "18-25",                // 5 tranches disponibles
    journeyStarted: true,
    startDate: "2025-01-15"
  },
  
  // 2. Motivation profonde (écran 200-rencontre.jsx)
  journeyChoice: {
    selectedOption: "body_disconnect", // 'body', 'nature', 'emotions'  
    motivation: "Retrouver mon corps"
  },
  
  // 3. Données cycle (écran 400-cycle.jsx)
  cycleData: {
    lastPeriodDate: "2025-01-08",
    averageCycleLength: 28,
    averagePeriodLength: 5,
    isRegular: true,
    trackingExperience: "basic"        // 'never', 'basic', 'advanced'
  },
  
  // 4. Préférences 6 dimensions (écran 500-preferences.jsx)
  preferences: {
    symptoms: 4,        // Symptômes physiques (échelle 0-5)
    moods: 5,          // Humeurs (forte préférence)
    phyto: 2,          // Phyto/HE (faible)
    phases: 3,         // Énergie des phases
    lithotherapy: 1,   // Lithothérapie (très faible)
    rituals: 4         // Rituels bien-être (forte)
  },
  
  // 5. Style communication (écran 600-avatar.jsx)
  melune: {
    avatarStyle: "classic",           // 'classic', 'modern', 'mystique'
    communicationTone: "friendly"     // 'friendly', 'professional', 'inspiring'
  },
  
  // 6. Persona calculé (algorithme utils/personaCalculator.js)
  persona: {
    assigned: "emma",                 // Résultat algorithme
    confidence: 72.3,                // Score de confiance
    scores: {                        // Scores détaillés debug
      emma: 87.2,
      laure: 54.1,
      sylvie: 23.8,
      christine: 31.4,
      clara: 45.7
    },
    lastCalculated: "2025-01-15T14:30:00Z"
  }
};
```

### **Algorithme Mapping Personas Opérationnel**
```javascript
// utils/personaCalculator.js - VALIDÉ ET FONCTIONNEL
const SCORING_WEIGHTS = {
  JOURNEY_CHOICE: 0.25,    // 25% - Choix motivation
  AGE_RANGE: 0.15,         // 15% - Tranche d'âge  
  PREFERENCES: 0.40,       // 40% - Préférences fortes (≥4)
  COMMUNICATION: 0.20      // 20% - Style communication
};

// Fonction principale - OPÉRATIONNELLE
export const calculateAndAssignPersona = (userData) => {
  const scores = calculatePersonaScores(userData);
  return {
    assigned: bestPersona,
    scores: allScores,
    confidence: confidenceLevel,
    metadata: { timestamp, algorithm: 'v2_simplified' }
  };
};
```

## 🏗️ ARCHITECTURE API EXPRESS ACTUELLE

### **Serveur Express Opérationnel**
```javascript
// packages/api/src/server.js - BASE VALIDÉE
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware sécurité OPÉRATIONNEL
app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json());

// Rate limiting OPÉRATIONNEL
const limiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 5,               // 5 req/min
  message: { error: 'Rate limit exceeded' }
});

// Route chat existante OPÉRATIONNELLE
app.post('/api/chat', deviceAuth, handleChat);
```

### **Services Existants Opérationnels**
```javascript
// packages/api/src/services/ClaudeService.js - OPÉRATIONNEL
class ClaudeService {
  async sendMessage(userMessage, customSystemPrompt, deviceId) {
    const response = await this.client.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      temperature: 0.7,
      system: customSystemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    });
    return { message: response.content[0].text };
  }
}

// packages/api/src/services/PromptBuilder.js - SOPHISTIQUÉ ET OPÉRATIONNEL
class PromptBuilder {
  buildContextualPrompt(contextData) {
    const { persona, userProfile, currentPhase, preferences } = contextData;
    const traits = this.personaTraits[persona];
    
    return `Tu es Melune, IA bienveillante spécialisée cycle féminin.
    
    PROFIL UTILISATRICE:
    - Nom: ${userProfile.prenom}
    - Persona: ${persona}
    - Phase: ${currentPhase}
    - Préférences fortes: ${strongPreferences.join(', ')}
    
    STYLE: ${traits.style}
    Exemple: "${traits.example}"
    
    Réponds selon ce persona et contexte:`;
  }
}
```

## 🎯 ENDPOINTS ADMIN À CRÉER (Sprint 1)

### **1. GET /api/admin/insights**
```javascript
// packages/api/src/routes/adminRoutes.js - À CRÉER
router.get('/insights', adminAuth, async (req, res) => {
  try {
    // Lire les 178 insights de base depuis insights.json
    const baseInsights = await readInsightsFromFile();
    
    res.json({
      success: true,
      data: {
        total: baseInsights.length,
        insights: baseInsights,
        lastModified: fs.statSync('packages/app/data/insights.json').mtime
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### **2. POST /api/admin/insights**
```javascript
// CRUD pour variants personas - À CRÉER
router.post('/insights', adminAuth, validateInsight, async (req, res) => {
  try {
    const { insightId, variants } = req.body;
    
    // Valider structure variants
    const requiredPersonas = ['emma', 'laure', 'sylvie', 'christine', 'clara'];
    for (const persona of requiredPersonas) {
      if (!variants[persona]) {
        return res.status(400).json({ 
          success: false, 
          error: `Variant manquant pour persona: ${persona}` 
        });
      }
    }
    
    // Sauvegarder dans insights.json
    await saveInsightVariants(insightId, variants);
    
    res.json({
      success: true,
      data: { insightId, variantsCreated: Object.keys(variants).length }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### **3. GET /api/admin/phases**
```javascript
// Retour phases.json actuel - À CRÉER
router.get('/phases', adminAuth, async (req, res) => {
  try {
    const phasesData = await readPhasesFromFile();
    res.json({ success: true, data: phasesData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### **4. POST /api/admin/auth**
```javascript
// Auth simple Jeza - À CRÉER
router.post('/auth', async (req, res) => {
  const { username, password } = req.body;
  
  // Auth simple codée en dur (MVP)
  const validCredentials = {
    'admin': process.env.ADMIN_PASSWORD,
    'jeza': process.env.JEZA_PASSWORD
  };
  
  if (validCredentials[username] === password) {
    const token = jwt.sign(
      { username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ success: true, token, user: { username, role: 'admin' } });
  } else {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
});
```

## 🎨 INTERFACE LOVABLE REQUISE

### **Prompts Lovable Préparés**
```
PROMPT 1 - Dashboard Principal:
"Créer dashboard admin React pour gestion insights thérapeutiques MoodCycle. 
Interface liste des 178 insights avec boutons édition. 
Navigation simple : Liste insights → Éditeur variants → Preview.
Style: Interface moderne, claire, responsive. Auth simple avec JWT."

PROMPT 2 - Éditeur Variants:  
"Interface édition variants personas (Emma/Laure/Sylvie/Christine/Clara).
5 textareas pour chaque persona avec labels clairs.
Preview en temps réel du rendu final.
Boutons Sauvegarder/Annuler avec confirmation.
Validation: champs requis, longueur max 500 chars."

PROMPT 3 - Connexion API:
"Intégrer client API REST vers localhost:4000/api/admin.
Endpoints: GET/POST insights, auth avec Bearer token.
Gestion erreurs avec messages utilisateur.
Loading states pendant requêtes.
Headers: Authorization Bearer + Content-Type JSON."
```

### **Structure Lovable Attendue**
```
packages/admin/
├── src/
│   ├── components/
│   │   ├── InsightsList.jsx      # Liste 178 insights
│   │   ├── VariantEditor.jsx     # Éditeur 5 variants
│   │   ├── Preview.jsx           # Aperçu rendu
│   │   └── Auth.jsx              # Login simple
│   ├── services/
│   │   └── apiClient.js          # Client REST API
│   ├── App.jsx                   # Router principal
│   └── main.jsx                  # Entry point
├── package.json
└── vite.config.js
```

## 📝 WORKFLOW JEZA PRÉCIS

### **Étapes Utilisateur Jeza**
```
1. LOGIN
   → URL: moodcycle.irimwebforge.com (production)
   → Développement: localhost:3000 ou localhost:5173
   → Credentials: jeza / password_simple

2. LISTE INSIGHTS
   → Affichage 178 insights base
   → Colonne: ID, Titre, Phase, Status variants
   → Bouton "Éditer variants" par ligne

3. ÉDITION VARIANTS
   → Affichage insight de base (read-only)
   → 5 textareas pour variants Emma/Laure/Sylvie/Christine/Clara
   → Compteur caractères (max 500)
   → Preview temps réel selon persona sélectionné

4. SAUVEGARDE
   → Validation côté client (champs requis)
   → POST /api/admin/insights avec variants
   → Retour liste avec message succès
   → Status "variants created" ✅

5. WORKFLOW COMPLET
   → 178 insights × 5 variants = 890 contenus personnalisés
   → Timeline: ~2-3 semaines de travail créatif
```

### **Format de Données Jeza**
```javascript
// Format sauvegarde insight avec variants
const insightWithVariants = {
  id: "M_symptoms_friendly_01",
  baseContent: "Tes crampes te parlent aujourd'hui ! 💕 Ton corps fait un travail incroyable.",
  personaVariants: {
    emma: "Tes crampes te parlent aujourd'hui ! 💕 C'est normal, ton corps apprend à communiquer avec toi.",
    laure: "Tes crampes signalent une phase importante. 💕 Optimise ta journée en t'accordant cette pause.",
    sylvie: "Ces crampes sont un signal de transition. 💕 Accueille-les avec bienveillance.",
    christine: "Tes crampes portent la sagesse de tes cycles. 💕 Honore cette douleur sacrée.",
    clara: "Tes crampes indiquent le processus physiologique. 💕 Optimise ta récupération."
  },
  targetPersonas: ["emma", "laure", "sylvie", "christine", "clara"],
  targetPreferences: ["symptoms"],
  phase: "menstrual",
  jezaApproval: 4,
  status: "enriched"
};
```

## ⚡ CONFIGURATION DÉVELOPPEMENT

### **Variables .env Requises**
```bash
# packages/api/.env
NODE_ENV=development
PORT=4000
CLAUDE_API_KEY=sk-ant-api03-*** # Existant
JWT_SECRET=your_super_long_secret_32_chars_min
ADMIN_PASSWORD=admin_password_secure
JEZA_PASSWORD=jeza_password_secure

# CORS pour développement + production
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,https://moodcycle.irimwebforge.com
```

### **Structure Fichiers API à Créer**
```
packages/api/src/
├── routes/
│   └── adminRoutes.js           # [CRÉER] Routes admin
├── controllers/  
│   └── adminController.js       # [CRÉER] Logique CRUD
├── middleware/
│   └── adminAuth.js             # [CRÉER] Auth admin
├── utils/
│   ├── insightsManager.js       # [CRÉER] Gestion fichiers
│   └── validation.js            # [CRÉER] Validation données
└── data/                        # [CRÉER] Dossier données partagées
    ├── insights.json            # Base + variants créés
    └── phases.json              # Configuration phases
```

## 🚀 ARCHITECTURE VPS PRODUCTION

### **Infrastructure Hostinger Configurée**
```
VPS: 69.62.107.136
Domaine: moodcycle.irimwebforge.com
SSL: Let's Encrypt automatique
Process Manager: PM2 pour API Node.js
```

### **Structure Déploiement Production**
```
/srv/www/internal/moodcycle/
├── api/
│   ├── releases/2024-01-15-143022/
│   └── current/ -> releases/latest/
│       ├── packages/api/src/
│       ├── package.json
│       └── .env.production
├── admin/
│   ├── releases/2024-01-15-144530/
│   └── current/ -> releases/latest/
│       ├── index.html (Lovable build)
│       └── assets/
└── shared/
    └── data/
        ├── insights.json      # 890 variants Jeza
        └── phases.json        # Config phases
```

### **Configuration PM2 API**
```bash
# Sur VPS après développement
cd /srv/www/internal/moodcycle/api/current
pm2 start packages/api/src/server.js --name moodcycle-api
pm2 save && pm2 startup
```

### **Nginx Proxy Configuration**
```nginx
# moodcycle.irimwebforge.com
location / {
    root /srv/www/internal/moodcycle/admin/current;
    try_files $uri $uri.html $uri/ /index.html;
}

location /api/ {
    proxy_pass http://localhost:4000/;
    proxy_set_header Host $host;
}