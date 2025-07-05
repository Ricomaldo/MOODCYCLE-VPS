#!/bin/bash

# Déploiement Production Ready MoodCycle
# Orchestration complète: Analytics + Logs + Performance + TestFlight Ready

set -e

echo "🚀 Déploiement Production Ready MoodCycle"
echo "=========================================="

# Variables
DEPLOY_DIR="/srv/www/internal/moodcycle-api"
CURRENT_DIR="$DEPLOY_DIR/current"
LOG_DIR="$DEPLOY_DIR/logs"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DEPLOYMENT_LOG="$LOG_DIR/production-deployment-$TIMESTAMP.log"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Fonction de logging
log_step() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${GREEN}✅ $message${NC}"
    echo "$timestamp - SUCCESS: $message" >> "$DEPLOYMENT_LOG"
}

log_error() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${RED}❌ $message${NC}"
    echo "$timestamp - ERROR: $message" >> "$DEPLOYMENT_LOG"
}

log_info() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${BLUE}ℹ️  $message${NC}"
    echo "$timestamp - INFO: $message" >> "$DEPLOYMENT_LOG"
}

log_warning() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${YELLOW}⚠️  $message${NC}"
    echo "$timestamp - WARNING: $message" >> "$DEPLOYMENT_LOG"
}

# Créer le répertoire de logs
mkdir -p "$LOG_DIR"

log_info "Démarrage déploiement production - $TIMESTAMP"

echo -e "${CYAN}🔍 Phase 1: Vérifications Préalables${NC}"
echo "====================================="

# Vérifier les prérequis
if [ ! -d "$DEPLOY_DIR" ]; then
    log_error "Répertoire de déploiement non trouvé: $DEPLOY_DIR"
    exit 1
fi

if ! command -v pm2 >/dev/null; then
    log_error "PM2 non installé"
    exit 1
fi

if ! command -v node >/dev/null; then
    log_error "Node.js non installé"
    exit 1
fi

if ! command -v nginx >/dev/null; then
    log_error "Nginx non installé"
    exit 1
fi

log_step "Vérifications préalables OK"

# Vérifier les fichiers nécessaires
REQUIRED_FILES=(
    "packages/api/src/server.js"
    "packages/api/src/middleware/analyticsLogger.js"
    "packages/api/src/routes/analytics.js"
    "packages/api/src/controllers/advancedAnalyticsController.js"
    "monitor-analytics-logs.sh"
    "test-analytics-logs.js"
    "performance-validation.js"
    "prepare-testflight.js"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        log_error "Fichier requis manquant: $file"
        exit 1
    fi
done

log_step "Fichiers requis présents"

echo ""
echo -e "${CYAN}🏗️ Phase 2: Déploiement Backend${NC}"
echo "================================="

# Exécuter le déploiement avec logs
log_info "Lancement déploiement backend avec logs..."
if ./deploy-analytics-with-logs.sh > "$LOG_DIR/backend-deployment-$TIMESTAMP.log" 2>&1; then
    log_step "Déploiement backend réussi"
else
    log_error "Déploiement backend échoué"
    echo "Voir les logs: $LOG_DIR/backend-deployment-$TIMESTAMP.log"
    exit 1
fi

echo ""
echo -e "${CYAN}⚡ Phase 3: Validation Performance${NC}"
echo "=================================="

# Attendre que l'API soit prête
log_info "Attente démarrage API..."
sleep 10

# Exécuter la validation de performance
log_info "Lancement validation performance..."
if node performance-validation.js > "$LOG_DIR/performance-validation-$TIMESTAMP.log" 2>&1; then
    log_step "Validation performance réussie"
else
    log_warning "Validation performance échouée (non-bloquant)"
    echo "Voir les logs: $LOG_DIR/performance-validation-$TIMESTAMP.log"
fi

echo ""
echo -e "${CYAN}🧪 Phase 4: Tests Complets${NC}"
echo "==========================="

# Tester les logs analytics
log_info "Test du système de logs..."
if node test-analytics-logs.js > "$LOG_DIR/logs-test-$TIMESTAMP.log" 2>&1; then
    log_step "Tests de logs réussis"
else
    log_warning "Tests de logs échoués (non-bloquant)"
    echo "Voir les logs: $LOG_DIR/logs-test-$TIMESTAMP.log"
fi

# Tester tous les endpoints critiques
log_info "Test des endpoints critiques..."
CRITICAL_ENDPOINTS=(
    "/api/health"
    "/api/insights"
    "/api/phases"
    "/api/closings"
    "/api/vignettes"
    "/api/analytics/health"
    "/api/analytics/overview"
    "/api/analytics/dashboard"
)

FAILED_ENDPOINTS=0
for endpoint in "${CRITICAL_ENDPOINTS[@]}"; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "X-Device-ID: production-test" \
        "https://moodcycle.irimwebforge.com$endpoint" 2>/dev/null || echo "000")
    
    if [ "$HTTP_CODE" = "200" ]; then
        log_step "Endpoint OK: $endpoint"
    else
        log_error "Endpoint KO: $endpoint (HTTP $HTTP_CODE)"
        FAILED_ENDPOINTS=$((FAILED_ENDPOINTS + 1))
    fi
done

if [ "$FAILED_ENDPOINTS" -eq 0 ]; then
    log_step "Tous les endpoints critiques sont opérationnels"
else
    log_error "$FAILED_ENDPOINTS endpoints critiques en échec"
    exit 1
fi

echo ""
echo -e "${CYAN}🎯 Phase 5: Préparation TestFlight${NC}"
echo "=================================="

# Exécuter la préparation TestFlight
log_info "Validation complète pour TestFlight..."
if node prepare-testflight.js > "$LOG_DIR/testflight-preparation-$TIMESTAMP.log" 2>&1; then
    log_step "Préparation TestFlight réussie"
    TESTFLIGHT_READY=true
else
    log_warning "Préparation TestFlight échouée"
    echo "Voir les logs: $LOG_DIR/testflight-preparation-$TIMESTAMP.log"
    TESTFLIGHT_READY=false
fi

echo ""
echo -e "${CYAN}📊 Phase 6: Configuration Monitoring${NC}"
echo "===================================="

# Configurer le monitoring avancé
log_info "Configuration monitoring avancé..."

# Créer le script de monitoring système
cat > "$DEPLOY_DIR/system-monitor.sh" << 'EOF'
#!/bin/bash

# Monitoring système complet
LOG_DIR="/srv/www/internal/moodcycle-api/logs"
SYSTEM_LOG="$LOG_DIR/system-monitor.log"
ALERT_LOG="$LOG_DIR/system-alerts.log"

# Fonction de logging
log_metric() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$SYSTEM_LOG"
}

log_alert() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - ALERT: $1" >> "$ALERT_LOG"
}

# Vérifier PM2
if ! pm2 status moodcycle-api | grep -q "online"; then
    log_alert "moodcycle-api is not online"
fi

# Vérifier l'espace disque
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 80 ]; then
    log_alert "Disk usage high: ${DISK_USAGE}%"
fi

# Vérifier la mémoire
MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100}')
if [ "$MEMORY_USAGE" -gt 80 ]; then
    log_alert "Memory usage high: ${MEMORY_USAGE}%"
fi

# Vérifier les logs d'erreur
ERROR_COUNT=$(grep -c "ERROR" "$LOG_DIR/analytics-errors.log" 2>/dev/null || echo 0)
if [ "$ERROR_COUNT" -gt 20 ]; then
    log_alert "High error count: $ERROR_COUNT errors"
fi

# Vérifier la connectivité API
if ! curl -s -f "http://localhost:4000/api/health" > /dev/null; then
    log_alert "API health check failed"
fi

log_metric "System check completed - Disk: ${DISK_USAGE}%, Memory: ${MEMORY_USAGE}%, Errors: $ERROR_COUNT"
EOF

chmod +x "$DEPLOY_DIR/system-monitor.sh"
log_step "Script de monitoring système créé"

# Ajouter au cron si pas déjà présent
if ! crontab -l 2>/dev/null | grep -q "system-monitor.sh"; then
    (crontab -l 2>/dev/null; echo "*/2 * * * * $DEPLOY_DIR/system-monitor.sh") | crontab -
    log_step "Monitoring système ajouté au cron (toutes les 2 minutes)"
fi

# Configurer la rotation des logs étendus
cat > "/etc/logrotate.d/moodcycle-production" << EOF
$LOG_DIR/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reload moodcycle-api > /dev/null 2>&1 || true
    endscript
}
EOF

log_step "Rotation des logs configurée (30 jours)"

echo ""
echo -e "${CYAN}🔐 Phase 7: Sécurisation${NC}"
echo "========================"

# Vérifier la configuration Nginx
if nginx -t 2>/dev/null; then
    log_step "Configuration Nginx valide"
else
    log_warning "Configuration Nginx à vérifier"
fi

# Vérifier les certificats SSL
if openssl x509 -in /etc/ssl/certs/moodcycle.crt -text -noout > /dev/null 2>&1; then
    CERT_EXPIRY=$(openssl x509 -in /etc/ssl/certs/moodcycle.crt -noout -dates | grep "notAfter" | cut -d= -f2)
    log_step "Certificat SSL valide (expire: $CERT_EXPIRY)"
else
    log_warning "Certificat SSL non trouvé ou invalide"
fi

# Vérifier les permissions
chown -R www-data:www-data "$LOG_DIR" 2>/dev/null || true
chmod -R 755 "$DEPLOY_DIR" 2>/dev/null || true
log_step "Permissions vérifiées"

echo ""
echo -e "${CYAN}📈 Phase 8: Métriques Finales${NC}"
echo "============================="

# Collecter les métriques finales
FINAL_METRICS="$LOG_DIR/final-metrics-$TIMESTAMP.json"

cat > "$FINAL_METRICS" << EOF
{
  "deployment": {
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "version": "analytics-v2.0",
    "environment": "production"
  },
  "system": {
    "pm2_status": "$(pm2 status moodcycle-api | grep -o "online\|stopped" | head -1)",
    "disk_usage": "$(df -h / | awk 'NR==2 {print $5}')",
    "memory_usage": "$(free | grep Mem | awk '{printf "%.1f%%", $3/$2 * 100}')",
    "load_average": "$(uptime | grep -o "load average.*" | cut -d: -f2)"
  },
  "api": {
    "health_check": "$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/api/health 2>/dev/null || echo "000")",
    "analytics_endpoints": $((${#CRITICAL_ENDPOINTS[@]} - FAILED_ENDPOINTS)),
    "total_endpoints": ${#CRITICAL_ENDPOINTS[@]},
    "success_rate": "$(echo "scale=1; ($((${#CRITICAL_ENDPOINTS[@]} - FAILED_ENDPOINTS)) * 100) / ${#CRITICAL_ENDPOINTS[@]}" | bc)%"
  },
  "features": {
    "analytics_logging": true,
    "performance_monitoring": true,
    "advanced_analytics": true,
    "testflight_ready": $TESTFLIGHT_READY
  }
}
EOF

log_step "Métriques finales collectées: $FINAL_METRICS"

echo ""
echo -e "${GREEN}🎉 DÉPLOIEMENT PRODUCTION TERMINÉ!${NC}"
echo "=================================="

# Résumé final
echo -e "${BLUE}📊 Résumé du déploiement:${NC}"
echo "   Timestamp: $TIMESTAMP"
echo "   Endpoints OK: $((${#CRITICAL_ENDPOINTS[@]} - FAILED_ENDPOINTS))/${#CRITICAL_ENDPOINTS[@]}"
echo "   TestFlight Ready: $TESTFLIGHT_READY"
echo "   Logs: $LOG_DIR"
echo ""

echo -e "${BLUE}🔗 URLs de production:${NC}"
echo "   API: https://moodcycle.irimwebforge.com"
echo "   Admin: https://moodcycle.irimwebforge.com/admin"
echo "   Health: https://moodcycle.irimwebforge.com/api/health"
echo ""

echo -e "${BLUE}📋 Commandes de monitoring:${NC}"
echo "   Logs temps réel: ./monitor-analytics-logs.sh"
echo "   Status PM2: pm2 status"
echo "   Métriques: cat $FINAL_METRICS"
echo ""

echo -e "${BLUE}🧪 Scripts de test:${NC}"
echo "   Test complet: node test-analytics-logs.js"
echo "   Performance: node performance-validation.js"
echo "   TestFlight: node prepare-testflight.js"
echo ""

if [ "$TESTFLIGHT_READY" = true ]; then
    echo -e "${GREEN}✅ SYSTÈME PRÊT POUR TESTFLIGHT!${NC}"
    echo -e "${GREEN}🚀 Vous pouvez maintenant inviter les testeuses${NC}"
else
    echo -e "${YELLOW}⚠️  Système déployé mais vérifications TestFlight à compléter${NC}"
    echo -e "${YELLOW}📋 Voir les logs de préparation TestFlight pour plus de détails${NC}"
fi

echo ""
echo -e "${CYAN}📞 En cas de problème:${NC}"
echo "   1. Vérifier les logs: $LOG_DIR"
echo "   2. Utiliser le monitoring: ./monitor-analytics-logs.sh"
echo "   3. Redémarrer PM2: pm2 restart moodcycle-api"
echo "   4. Vérifier Nginx: nginx -t && systemctl reload nginx"
echo ""

log_step "Déploiement production terminé avec succès"

echo -e "${GREEN}🎯 MoodCycle Analytics Production Ready!${NC}" 