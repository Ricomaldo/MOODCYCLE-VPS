#!/bin/bash

# Déploiement Analytics Avancés avec Système de Logs
# Version complète avec monitoring et logging

set -e

echo "🚀 Déploiement Analytics Avancés avec Logs MoodCycle"
echo "=================================================="

# Variables
DEPLOY_DIR="/srv/www/internal/moodcycle-api"
CURRENT_DIR="$DEPLOY_DIR/current"
SHARED_DIR="$DEPLOY_DIR/shared"
LOG_DIR="$DEPLOY_DIR/logs"
BACKUP_DIR="$DEPLOY_DIR/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📂 Répertoires de déploiement:${NC}"
echo "   Current: $CURRENT_DIR"
echo "   Shared: $SHARED_DIR"
echo "   Logs: $LOG_DIR"
echo "   Backup: $BACKUP_DIR"
echo ""

# Fonction pour logger les étapes
log_step() {
    echo -e "${GREEN}✅ $1${NC}"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_DIR/deployment.log"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - ERROR: $1" >> "$LOG_DIR/deployment.log"
}

log_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - WARNING: $1" >> "$LOG_DIR/deployment.log"
}

# Vérifications préalables
echo -e "${BLUE}🔍 Vérifications préalables...${NC}"

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

log_step "Vérifications préalables OK"

# Créer les répertoires nécessaires
echo -e "${BLUE}📁 Création des répertoires...${NC}"
mkdir -p "$LOG_DIR" "$BACKUP_DIR" "$SHARED_DIR"
log_step "Répertoires créés"

# Sauvegarder la version actuelle
if [ -d "$CURRENT_DIR" ]; then
    echo -e "${YELLOW}💾 Sauvegarde de la version actuelle...${NC}"
    tar -czf "$BACKUP_DIR/backup_$TIMESTAMP.tar.gz" -C "$CURRENT_DIR" . 2>/dev/null || true
    log_step "Sauvegarde créée: backup_$TIMESTAMP.tar.gz"
fi

# Copier les nouveaux fichiers
echo -e "${BLUE}📦 Copie des nouveaux fichiers...${NC}"

# Copier les fichiers API
cp -r packages/api/* "$CURRENT_DIR/" 2>/dev/null || {
    log_error "Erreur copie fichiers API"
    exit 1
}

# Copier les fichiers admin
if [ -d "packages/admin/dist" ]; then
    cp -r packages/admin/dist "$CURRENT_DIR/" 2>/dev/null || {
        log_warning "Erreur copie fichiers admin (dist manquant?)"
    }
fi

log_step "Fichiers copiés"

# Installer les dépendances
echo -e "${BLUE}📦 Installation des dépendances...${NC}"
cd "$CURRENT_DIR"

if [ -f "package.json" ]; then
    npm install --production --silent 2>/dev/null || {
        log_error "Erreur installation npm"
        exit 1
    }
    log_step "Dépendances installées"
else
    log_warning "package.json non trouvé"
fi

# Configurer les logs
echo -e "${BLUE}📊 Configuration du système de logs...${NC}"

# Créer les fichiers de logs s'ils n'existent pas
touch "$LOG_DIR/analytics.log"
touch "$LOG_DIR/analytics-errors.log"
touch "$LOG_DIR/analytics-performance.log"
touch "$LOG_DIR/deployment.log"

# Permissions correctes
chmod 664 "$LOG_DIR"/*.log
chown -R www-data:www-data "$LOG_DIR" 2>/dev/null || true

log_step "Système de logs configuré"

# Configurer PM2
echo -e "${BLUE}⚙️ Configuration PM2...${NC}"

# Créer le fichier ecosystem.config.js s'il n'existe pas
if [ ! -f "$CURRENT_DIR/ecosystem.config.js" ]; then
    cat > "$CURRENT_DIR/ecosystem.config.js" << 'EOF'
module.exports = {
  apps: [{
    name: 'moodcycle-api',
    script: 'src/server.js',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 4000
    },
    error_file: '/srv/www/internal/moodcycle-api/logs/pm2-error.log',
    out_file: '/srv/www/internal/moodcycle-api/logs/pm2-out.log',
    log_file: '/srv/www/internal/moodcycle-api/logs/pm2-combined.log',
    time: true,
    max_memory_restart: '500M',
    node_args: '--max-old-space-size=512'
  }]
};
EOF
    log_step "Fichier ecosystem.config.js créé"
fi

# Redémarrer PM2
echo -e "${BLUE}🔄 Redémarrage PM2...${NC}"

# Arrêter l'ancienne version
pm2 stop moodcycle-api 2>/dev/null || true
pm2 delete moodcycle-api 2>/dev/null || true

# Démarrer la nouvelle version
pm2 start ecosystem.config.js 2>/dev/null || {
    log_error "Erreur démarrage PM2"
    exit 1
}

# Sauvegarder la configuration PM2
pm2 save 2>/dev/null || true

log_step "PM2 redémarré avec succès"

# Attendre que l'API soit prête
echo -e "${BLUE}⏳ Vérification de l'API...${NC}"
sleep 5

# Test de santé basique
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/api/health 2>/dev/null || echo "000")

if [ "$HEALTH_CHECK" = "200" ]; then
    log_step "API opérationnelle (health check OK)"
else
    log_error "API non opérationnelle (health check failed: $HEALTH_CHECK)"
    
    # Afficher les logs PM2 pour debug
    echo -e "${YELLOW}📋 Logs PM2 récents:${NC}"
    pm2 logs moodcycle-api --lines 10 --nostream 2>/dev/null || true
    
    exit 1
fi

# Test des endpoints analytics
echo -e "${BLUE}🧪 Test des endpoints analytics...${NC}"
ANALYTICS_ENDPOINTS=(
    "/api/analytics/health"
    "/api/analytics/overview"
    "/api/analytics/dashboard"
)

FAILED_ENDPOINTS=0
for endpoint in "${ANALYTICS_ENDPOINTS[@]}"; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "X-Device-ID: deploy-test" \
        "http://localhost:4000$endpoint" 2>/dev/null || echo "000")
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "   ✅ $endpoint: $HTTP_CODE"
    else
        echo -e "   ❌ $endpoint: $HTTP_CODE"
        FAILED_ENDPOINTS=$((FAILED_ENDPOINTS + 1))
    fi
done

if [ "$FAILED_ENDPOINTS" -eq 0 ]; then
    log_step "Tous les endpoints analytics sont opérationnels"
else
    log_warning "$FAILED_ENDPOINTS endpoints analytics en échec"
fi

# Configurer la rotation des logs
echo -e "${BLUE}🔄 Configuration rotation des logs...${NC}"

# Créer le fichier logrotate
cat > "/etc/logrotate.d/moodcycle-analytics" << EOF
$LOG_DIR/*.log {
    daily
    rotate 7
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

log_step "Rotation des logs configurée"

# Créer un script de monitoring
echo -e "${BLUE}📊 Création script de monitoring...${NC}"

cat > "$DEPLOY_DIR/monitor-analytics.sh" << 'EOF'
#!/bin/bash
# Script de monitoring automatique

LOG_DIR="/srv/www/internal/moodcycle-api/logs"
ALERT_LOG="$LOG_DIR/alerts.log"

# Vérifier la taille des logs
for log_file in "$LOG_DIR"/*.log; do
    if [ -f "$log_file" ]; then
        size=$(stat -f%z "$log_file" 2>/dev/null || stat -c%s "$log_file" 2>/dev/null || echo 0)
        if [ "$size" -gt 104857600 ]; then # 100MB
            echo "$(date) - WARNING: $log_file is larger than 100MB ($size bytes)" >> "$ALERT_LOG"
        fi
    fi
done

# Vérifier les erreurs récentes
error_count=$(grep -c "ERROR" "$LOG_DIR/analytics-errors.log" 2>/dev/null || echo 0)
if [ "$error_count" -gt 10 ]; then
    echo "$(date) - WARNING: $error_count errors in analytics-errors.log" >> "$ALERT_LOG"
fi

# Vérifier PM2
if ! pm2 status moodcycle-api | grep -q "online"; then
    echo "$(date) - CRITICAL: moodcycle-api is not online" >> "$ALERT_LOG"
fi
EOF

chmod +x "$DEPLOY_DIR/monitor-analytics.sh"
log_step "Script de monitoring créé"

# Ajouter au cron si pas déjà présent
if ! crontab -l 2>/dev/null | grep -q "monitor-analytics.sh"; then
    (crontab -l 2>/dev/null; echo "*/5 * * * * $DEPLOY_DIR/monitor-analytics.sh") | crontab -
    log_step "Monitoring automatique ajouté au cron"
fi

# Résumé final
echo ""
echo -e "${GREEN}🎉 Déploiement terminé avec succès!${NC}"
echo "=================================================="
echo -e "${BLUE}📊 Informations de déploiement:${NC}"
echo "   Timestamp: $TIMESTAMP"
echo "   API URL: http://localhost:4000"
echo "   Admin URL: http://localhost:4000/admin"
echo "   Logs: $LOG_DIR"
echo ""
echo -e "${BLUE}📋 Commandes utiles:${NC}"
echo "   Logs PM2: pm2 logs moodcycle-api"
echo "   Status PM2: pm2 status"
echo "   Monitoring: $DEPLOY_DIR/monitor-analytics.sh"
echo "   Logs analytics: tail -f $LOG_DIR/analytics.log"
echo ""
echo -e "${BLUE}🔍 Endpoints disponibles:${NC}"
for endpoint in "${ANALYTICS_ENDPOINTS[@]}"; do
    echo "   https://moodcycle.irimwebforge.com$endpoint"
done
echo ""

# Test final avec le script de test
if [ -f "test-analytics-logs.js" ]; then
    echo -e "${YELLOW}🧪 Lancement du test complet des logs...${NC}"
    node test-analytics-logs.js || {
        log_warning "Tests des logs échoués - vérifiez manuellement"
    }
fi

log_step "Déploiement Analytics avec Logs terminé"

echo -e "${GREEN}✨ Système Analytics avec Logs opérationnel!${NC}" 