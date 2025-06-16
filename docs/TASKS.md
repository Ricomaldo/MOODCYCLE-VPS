# 🎯 TASKS - Suivi des Tâches MoodCycle

*Dernière mise à jour : 15 janvier 2025*
*Source de vérité pour priorisation et focus*

## 📋 POST-IT DE FOCUS VALIDÉS

### **🎯 SPRINT 1 : Admin MVP (6h samedi + 3h dimanche) - EN COURS**
```
⚙️ LOVABLE + API EXPRESS COMBO
├── 🚀 Interface admin Lovable (gratuit ce weekend)     [⏳ SAMEDI 4H SOIR]
├── 🔌 Endpoints admin API Express                      [✅ TERMINÉ 2H]
├── 🔗 Connexion Lovable → API Express                  [⏳ CE SOIR 4H]
└── ✅ Test workflow complet Jeza                       [⏳ DIMANCHE 1H]

DÉTAIL ENDPOINTS:
├── GET  /api/admin/insights     # Liste 178 insights  [✅ TERMINÉ 2H]
├── POST /api/admin/insights     # CRUD insights       [✅ TERMINÉ 2H]  
├── GET  /api/admin/phases       # phases.json         [✅ TERMINÉ 2H]
└── POST /api/admin/auth         # Auth simple         [✅ TERMINÉ 2H]
```

### **🎯 SPRINT 2 : App MVP Complet (3 séquences) - EN ATTENTE**
```
📱 APP FINALIZATION  
├── 📔 NotebookStore + écran Carnet complet             [❌ BLOQUÉ]
├── 🔗 Connexion API insights (fallback local maintenu) [❌ BLOQUÉ]
├── 📄 Pages phases détaillées dynamiques              [❌ BLOQUÉ]
└── ✅ Test UX bout-en-bout                             [❌ BLOQUÉ]
```

### **🎯 SPRINT 3 : Tests & Production (2 séquences) - EN ATTENTE**
```
🧪 PRÉPARATION UTILISATEURS
├── 🍎 Guidelines Apple (accompagnement prévu)         [❌ BLOQUÉ]
├── 💳 RevenueCat basic (pour test payant futur)       [❌ BLOQUÉ]
├── 📊 Métriques basiques (crashes, usage)             [❌ BLOQUÉ]
└── 🔒 Sécurisation finale                             [❌ BLOQUÉ]
```

## 🎭 TRAVAIL PARALLÈLE JEZA

### **Contenu Thérapeutique**
```
🧠 INSIGHTS & PERSONAS
├── ✅ 178 insights génériques validés                  [✅ TERMINÉ]
├── 🔄 Variantage 5 personas (178 → 890 insights)      [⏳ EN ATTENTE ADMIN]
├── 📋 Validation cohérence phases                     [⏳ À FAIRE]
└── 🎭 Affinement traits personas                      [⏳ À FAIRE]
```

**Statut Jeza :** Absente 3 jours → Priorité admin MVP pour la débloquer

## 🏗️ ARCHITECTURE DECISIONS VALIDÉES

### **Repo Strategy**
- ✅ **Mono-repo** validé
- ✅ **PersonaCalculator** reste côté app (offline-first preserved)
- ✅ **Admin hébergement** : admin.irimwebforge.com
- ✅ **Synchronisation** : Polling simple au démarrage app

### **Technical Stack**
- ✅ **Admin Interface** : React + Vite 
- ✅ **Auth Admin** : JWT simple (2 admins : toi + Jeza)
- ✅ **Insights Workflow** : Jeza écrit 5 versions par insight
- ✅ **Migration Progressive** : Fallbacks locaux maintenus

## 🚨 BLOCKERS & DEPENDENCIES

### **Critical Path**
1. **API Admin endpoints** → Débloquer interface admin
2. **Interface admin** → Débloquer travail Jeza
3. **Travail Jeza terminé** → Débloquer finalisation app
4. **App finalisée** → Débloquer tests utilisateurs

### **Non-Critical (Reporté)**
- ❌ Phase 4 sophistication prompts (architecture déjà excellente)
- ❌ Cache Redis (AsyncStorage suffit)
- ❌ Montée Claude Sonnet (Haiku répond aux besoins)

### **🔒 Sécurité Production (Post-MVP)**
- ❌ Rate limiting multicouche (actuellement 5/min seulement)
- ❌ JWT device-based réel (actuellement temp-token)
- ❌ Validation inputs stricte (actuellement basique)
- ❌ HTTPS obligatoire + certificats
- ❌ Monitoring sécurité + alertes
- ❌ Audit trail actions admin

## 📊 METRICS & SUCCESS CRITERIA

### **Phase 1 Success**
- [ ] Jeza peut éditer les 178 insights existants
- [ ] Création de 5 variants fonctionne
- [ ] App récupère insights via API (avec fallback)
- [ ] Zero breaking changes côté app

### **MVP Complete Success**  
- [ ] Écran Carnet fonctionnel
- [ ] 890+ insights personnalisés disponibles
- [ ] Test utilisateur groupe enthousiaste réalisé
- [ ] App prête pour soumission App Store

## 🚀 STRATÉGIE LOVABLE WEEKEND

### **Samedi 6h (2h jour + 4h soir)**
**Jour 2h :** API Express endpoints admin
**Soir 4h :** Interface Lovable complète (gratuit weekend)

### **Dimanche 3h**  
**2h :** Connexion Lovable ↔ API Express
**1h :** Test workflow Jeza complet

### **Résultat Sprint 1**
✅ Admin MVP fonctionnel
✅ Jeza débloquée pour variantage 178→890 insights  
✅ Architecture prête pour sprint suivant

## 🎯 FOCUS QUESTIONS

**Pour maintenir le cap :**
- Qu'est-ce qui débloquerait le plus de valeur aujourd'hui ?
- Cette tâche fait-elle avancer vers les tests utilisateurs ?
- Jeza peut-elle reprendre son travail créatif après ça ?
- L'app sera-t-elle plus proche du déploiement ?

---

*Ces post-it sont la source de vérité. Aucun développement sans validation par rapport à ces objectifs.*