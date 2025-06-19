# 📋 **MoodCycle - Guide des Logs**

> Documentation des systèmes de logging pour audit et debug des conversations Melune

## 🎯 **Vue d'ensemble**

Le système de logs est maintenant **double** :
1. **Logs techniques** → PM2 (debug, erreurs, performance)
2. **Logs conversationnels** → Fichier dédié (audit, reconstitution)

---

## 📁 **Emplacements des logs**

### **Production (VPS)**
```bash
# Logs techniques PM2
pm2 logs moodcycle-api

# Logs conversationnels dédiés
/srv/www/internal/moodcycle.irimwebforge.com/current/logs/conversations.log
```

### **Développement Local**
```bash
# Logs techniques PM2
pm2 logs moodcycle-api

# Logs conversationnels dédiés  
packages/api/logs/conversations.log
```

---

## 🔧 **Commandes Pratiques**

### **1. Logs Techniques (Debug/Performance)**

```bash
# Voir logs temps réel
pm2 logs moodcycle-api --lines 50

# Filtrer par type
pm2 logs moodcycle-api | grep "🎭"    # Behavior modulation
pm2 logs moodcycle-api | grep "💰"    # Budget tracking
pm2 logs moodcycle-api | grep "🌙"    # Phase mapping
pm2 logs moodcycle-api | grep "❌"    # Erreurs

# Logs des 5 dernières minutes
pm2 logs moodcycle-api --lines 100 | grep "$(date +%H:%M)"
```

### **2. Logs Conversationnels (Audit/Reconstitution)**

```bash
# Voir toutes les conversations (production)
tail -f /srv/www/internal/moodcycle.irimwebforge.com/current/logs/conversations.log

# Dernières 20 conversations formatées
tail -20 /srv/www/internal/moodcycle.irimwebforge.com/current/logs/conversations.log | jq .

# Filtrer par persona
cat /srv/www/internal/moodcycle.irimwebforge.com/current/logs/conversations.log | jq 'select(.persona == "emma")'

# Filtrer par phase
cat /srv/www/internal/moodcycle.irimwebforge.com/current/logs/conversations.log | jq 'select(.phase == "folliculaire")'

# Conversations d'aujourd'hui
cat /srv/www/internal/moodcycle.irimwebforge.com/current/logs/conversations.log | jq 'select(.timestamp | startswith("2025-06-18"))'

# Conversations avec erreurs
cat /srv/www/internal/moodcycle.irimwebforge.com/current/logs/conversations.log | jq 'select(.is_error == true)'

# Session spécifique
cat /srv/www/internal/moodcycle.irimwebforge.com/current/logs/conversations.log | jq 'select(.session_id | contains("emma_moodcycl"))'
```

---

## 📊 **Format des Logs Conversationnels**

### **Conversation Normale**
```json
{
  "timestamp": "2025-06-18T16:26:15Z",
  "session_id": "emma_moodcycl_2025-06-18",
  "user_message": "Je me sens super énergique aujourd'hui",
  "persona": "emma",
  "phase": "folliculaire",
  "user_profile": {
    "prenom": "Sophie",
    "age": "25-35"
  },
  "preferences": {
    "symptoms": 3,
    "moods": 4,
    "phases": 5
  },
  "strong_preferences": ["énergie cyclique"],
  "llm_prompt": "Tu es Melune, IA cycle féminin...",
  "llm_response": "🌱 Coucou ma belle, quelle énergie fantastique !...",
  "tokens_prompt": 243,
  "tokens_completion": 101,
  "tokens_total": 344,
  "cost_usd": 0.000187,
  "device_id": "moodcycl***",
  "is_fallback": false,
  "response_time": 1250
}
```

### **Conversation avec Erreur**
```json
{
  "timestamp": "2025-06-18T16:30:22Z",
  "session_id": "emma_moodcycl_2025-06-18",
  "user_message": "Comment ça va ?",
  "persona": "emma",
  "phase": "lutéale",
  "error_type": "CLAUDE_RATE_LIMIT",
  "llm_response": "Oups ! 😅 Je suis un peu débordée là...",
  "is_error": true,
  "device_id": "moodcycl***"
}
```

---

## 🔍 **Analyses Rapides**

### **Statistiques Usage**
```bash
# Nombre total de conversations
wc -l /srv/www/internal/moodcycle/shared/logs/conversations.log

# Répartition par persona
cat /srv/www/internal/moodcycle/shared/logs/conversations.log | jq -r '.persona' | sort | uniq -c

# Répartition par phase
cat /srv/www/internal/moodcycle/shared/logs/conversations.log | jq -r '.phase' | sort | uniq -c

# Coût total du jour
cat /srv/www/internal/moodcycle/shared/logs/conversations.log | jq 'select(.timestamp | startswith("2025-06-18")) | .cost_usd' | awk '{sum += $1} END {print "Total: $" sum}'

# Taux d'erreur
echo "Erreurs: $(cat /srv/www/internal/moodcycle/shared/logs/conversations.log | jq -r 'select(.is_error == true)' | wc -l)"
echo "Total: $(wc -l < /srv/www/internal/moodcycle/shared/logs/conversations.log)"
```

### **Debug Session Spécifique**
```bash
# Reconstituer conversation complète d'une session
SESSION="emma_moodcycl_2025-06-18"
cat /srv/www/internal/moodcycle/shared/logs/conversations.log | jq "select(.session_id == \"$SESSION\")" | jq -r '"[\(.timestamp | split("T")[1] | split(".")[0])] User: \(.user_message)\nMelune: \(.llm_response)\n"'
```

### **Monitoring Performance**
```bash
# Temps de réponse moyen par persona
cat /srv/www/internal/moodcycle/shared/logs/conversations.log | jq 'select(.response_time != null) | {persona: .persona, time: .response_time}' | jq -s 'group_by(.persona) | map({persona: .[0].persona, avg_time: (map(.time) | add / length)})'

# Tokens moyens par phase
cat /srv/www/internal/moodcycle/shared/logs/conversations.log | jq 'select(.tokens_total > 0) | {phase: .phase, tokens: .tokens_total}' | jq -s 'group_by(.phase) | map({phase: .[0].phase, avg_tokens: (map(.tokens) | add / length)})'
```

---

## ⚡ **Commandes Express** (à retenir)

```bash
# 🔥 LES 3 COMMANDES ESSENTIELLES

# 1. Voir conversations temps réel
tail -f /srv/www/internal/moodcycle.irimwebforge.com/current/logs/conversations.log | jq .

# 2. Debug technique temps réel  
pm2 logs moodcycle-api --lines 30

# 3. Dernières conversations formatées
tail -10 /srv/www/internal/moodcycle.irimwebforge.com/current/logs/conversations.log | jq -r '"[\(.timestamp | split("T")[1] | split(".")[0])] \(.persona) (\(.phase)): \(.user_message) → \(.llm_response)"'
```

---

## 🚀 **Rotation & Maintenance**

### **Nettoyage Automatique** (à configurer)
```bash
# Garder seulement 30 jours de logs
find /srv/www/internal/moodcycle/shared/logs/ -name "conversations.log.*" -mtime +30 -delete

# Rotation quotidienne (logrotate)
/etc/logrotate.d/moodcycle-conversations
```

### **Backup Logs Important**
```bash
# Sauvegarder logs avant maintenance
cp /srv/www/internal/moodcycle/shared/logs/conversations.log /srv/www/internal/moodcycle/shared/logs/conversations.backup.$(date +%Y%m%d)
```

---

**✨ Avec ce système, tu peux reconstituer n'importe quelle conversation de A à Z !** 