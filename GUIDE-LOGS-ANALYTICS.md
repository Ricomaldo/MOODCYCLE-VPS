# Guide du Système de Logs Analytics MoodCycle

## Vue d'ensemble

Le système de logs analytics MoodCycle fournit un monitoring complet et en temps réel des performances, erreurs et métriques des endpoints analytics. Ce guide explique comment utiliser tous les outils de logging et de monitoring disponibles.

## 🏗️ Architecture du Système de Logs

### Composants Principaux

1. **AnalyticsLogger Middleware** (`analyticsLogger.js`)
   - Logging automatique des requêtes analytics
   - Métriques de performance en temps réel
   - Gestion des erreurs avec stack traces
   - Recommandations automatiques

2. **Fichiers de Logs**
   - `analytics.log` : Logs généraux des requêtes
   - `analytics-errors.log` : Erreurs spécifiques
   - `analytics-performance.log` : Métriques de performance
   - `deployment.log` : Logs de déploiement

3. **Scripts de Monitoring**
   - `monitor-analytics-logs.sh` : Interface interactive
   - `test-analytics-logs.js` : Tests automatisés
   - `deploy-analytics-with-logs.sh` : Déploiement complet

## 📊 Utilisation du Système

### 1. Monitoring Interactif

```bash
# Lancer le monitoring interactif
./monitor-analytics-logs.sh

# Ou modes directs
./monitor-analytics-logs.sh realtime    # Monitoring temps réel
./monitor-analytics-logs.sh report      # Génération rapport
./monitor-analytics-logs.sh test        # Test avec logs
```

#### Options du Menu Interactif

1. **📊 Logs PM2** - Affiche les logs PM2 de l'API
2. **🔍 Logs erreurs** - Filtre les erreurs récentes
3. **📈 Logs analytics** - Requêtes analytics spécifiques
4. **🌐 Logs Nginx** - Requêtes au niveau proxy
5. **💾 Logs système** - Métriques serveur
6. **📡 Monitoring temps réel** - Surveillance live
7. **🧪 Test endpoints** - Tests avec logging
8. **📋 Rapport complet** - Génération rapport détaillé
9. **🧹 Nettoyage logs** - Maintenance

### 2. Tests Automatisés

```bash
# Test complet des endpoints avec logs
node test-analytics-logs.js
```

Le script teste automatiquement :
- 9 endpoints analytics
- Génération et analyse des logs
- Métriques de performance
- Rapport JSON détaillé

### 3. Déploiement avec Logs

```bash
# Déploiement complet avec système de logs
./deploy-analytics-with-logs.sh
```

Inclut :
- Configuration automatique des logs
- Rotation des logs (logrotate)
- Monitoring automatique (cron)
- Tests de validation

## 📋 Format des Logs

### Structure JSON Standard

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "INFO|ERROR|WARN",
  "category": "REQUEST|DATA_METRICS|ANALYSIS_ERROR",
  "message": "Description de l'événement",
  "method": "GET|POST",
  "url": "/api/analytics/behavior",
  "deviceId": "device-123",
  "responseTime": "150ms",
  "statusCode": 200,
  "success": true
}
```

### Catégories de Logs

- **REQUEST** : Requêtes HTTP
- **DATA_METRICS** : Métriques de données traitées
- **ANALYSIS_ERROR** : Erreurs d'analyse
- **RECOMMENDATIONS** : Recommandations générées
- **SLOW_REQUEST** : Requêtes lentes (>1s)

## 🔍 Analyse des Logs

### Commandes Utiles

```bash
# Logs temps réel
tail -f /srv/www/internal/moodcycle-api/logs/analytics.log

# Filtrer par device ID
grep "device-123" /srv/www/internal/moodcycle-api/logs/analytics.log

# Compter les erreurs
grep -c "ERROR" /srv/www/internal/moodcycle-api/logs/analytics-errors.log

# Analyser les performances
grep "SLOW_REQUEST" /srv/www/internal/moodcycle-api/logs/analytics-performance.log

# Logs PM2 analytics
pm2 logs moodcycle-api | grep -i analytics
```

### Parsing JSON

```bash
# Extraire les temps de réponse
cat analytics.log | jq -r '.responseTime' | grep -o '[0-9]*' | sort -n

# Top 10 des endpoints les plus lents
cat analytics.log | jq -r 'select(.responseTime) | "\(.responseTime) \(.url)"' | sort -nr | head -10

# Erreurs par endpoint
cat analytics-errors.log | jq -r '.url' | sort | uniq -c | sort -nr
```

## 📊 Métriques et Alertes

### Métriques Collectées

1. **Performance**
   - Temps de réponse par endpoint
   - Taille des données traitées
   - Nombre d'enregistrements traités

2. **Fiabilité**
   - Taux de succès/échec
   - Types d'erreurs
   - Stack traces détaillées

3. **Usage**
   - Fréquence des requêtes
   - Endpoints populaires
   - Patterns d'utilisation

### Alertes Automatiques

Le script `monitor-analytics.sh` (cron toutes les 5 minutes) vérifie :
- Taille des logs (>100MB)
- Nombre d'erreurs (>10/heure)
- Status PM2 (offline)

Alertes dans : `/srv/www/internal/moodcycle-api/logs/alerts.log`

## 🛠️ Maintenance

### Rotation des Logs

Configuration automatique via logrotate :
```bash
# Vérifier la configuration
cat /etc/logrotate.d/moodcycle-analytics

# Test manuel
sudo logrotate -d /etc/logrotate.d/moodcycle-analytics
```

### Nettoyage Manuel

```bash
# Vider les logs
> /srv/www/internal/moodcycle-api/logs/analytics.log
> /srv/www/internal/moodcycle-api/logs/analytics-errors.log

# Ou via PM2
pm2 flush moodcycle-api
```

### Archivage

```bash
# Archiver les logs anciens
cd /srv/www/internal/moodcycle-api/logs
tar -czf "archive-$(date +%Y%m%d).tar.gz" *.log
```

## 🚨 Dépannage

### Problèmes Courants

1. **Logs non générés**
   ```bash
   # Vérifier les permissions
   ls -la /srv/www/internal/moodcycle-api/logs/
   
   # Vérifier le middleware
   grep -n "analyticsLogger" /srv/www/internal/moodcycle-api/current/src/server.js
   ```

2. **Erreurs de parsing JSON**
   ```bash
   # Vérifier la validité JSON
   cat analytics.log | jq empty
   
   # Nettoyer les lignes invalides
   cat analytics.log | jq -c . > analytics-clean.log
   ```

3. **Performance dégradée**
   ```bash
   # Vérifier la taille des logs
   du -h /srv/www/internal/moodcycle-api/logs/
   
   # Analyser les requêtes lentes
   grep "SLOW_REQUEST" analytics-performance.log
   ```

### Commandes de Debug

```bash
# Status complet du système
pm2 status
pm2 logs moodcycle-api --lines 50

# Test de connectivité
curl -H "X-Device-ID: debug" http://localhost:4000/api/analytics/health

# Vérifier la configuration
node -e "console.log(require('./src/middleware/analyticsLogger'))"
```

## 📈 Optimisations

### Performance

1. **Logging asynchrone** : Tous les logs sont non-bloquants
2. **Rotation automatique** : Évite l'accumulation de gros fichiers
3. **Compression** : Logs archivés compressés
4. **Filtrage intelligent** : Seules les requêtes analytics sont loggées

### Monitoring

1. **Alertes proactives** : Détection automatique des problèmes
2. **Métriques en temps réel** : Monitoring live disponible
3. **Rapports automatiques** : Génération de rapports périodiques
4. **Intégration PM2** : Logs centralisés avec PM2

## 🔗 Intégration avec l'Admin Dashboard

Les logs sont accessibles via l'admin dashboard :
- Endpoint `/api/logs/analytics/stats` pour les statistiques
- Visualisation en temps réel des métriques
- Alertes intégrées dans l'interface

## 📞 Support

Pour toute question ou problème :
1. Consulter les logs d'erreur
2. Utiliser le script de monitoring interactif
3. Vérifier les alertes automatiques
4. Générer un rapport complet pour analyse

---

*Ce guide est maintenu à jour avec chaque version du système analytics MoodCycle.* 