#!/bin/bash

# Déploiement Analytics depuis Local vers Production
# Script simple pour copier les fichiers analytics

echo "🚀 Déploiement Analytics depuis Local"
echo "====================================="

# Configuration
SERVER="irimwebforge.com"
USER="irimwebforge"
REMOTE_DIR="/srv/www/internal/moodcycle-api/current"
LOCAL_API_DIR="packages/api"

echo "📁 Fichiers à déployer:"
echo "   Server: $SERVER"
echo "   Remote: $REMOTE_DIR"
echo "   Local: $LOCAL_API_DIR"
echo ""

# Vérifier la connexion SSH
echo "🔍 Test connexion SSH..."
if ! ssh -o ConnectTimeout=5 "$USER@$SERVER" "echo 'SSH OK'" 2>/dev/null; then
    echo "❌ Erreur connexion SSH vers $USER@$SERVER"
    echo "Vérifiez vos clés SSH et la connectivité"
    exit 1
fi
echo "✅ Connexion SSH OK"

# Sauvegarder les fichiers existants
echo "💾 Sauvegarde des fichiers existants..."
BACKUP_DIR="/srv/www/internal/moodcycle-api/backups/analytics-$(date +%Y%m%d_%H%M%S)"
ssh "$USER@$SERVER" "mkdir -p $BACKUP_DIR"

# Sauvegarder les fichiers qui vont être modifiés
BACKUP_FILES=(
    "src/server.js"
    "src/controllers/advancedAnalyticsController.js"
    "src/middleware/analyticsLogger.js"
    "src/routes/analytics.js"
)

for file in "${BACKUP_FILES[@]}"; do
    ssh "$USER@$SERVER" "cp $REMOTE_DIR/$file $BACKUP_DIR/ 2>/dev/null || echo 'Fichier $file non trouvé (nouveau)'"
done

echo "✅ Sauvegarde dans $BACKUP_DIR"

# Déployer les nouveaux fichiers
echo "📦 Déploiement des fichiers analytics..."

# 1. Controller
echo "   📄 AdvancedAnalyticsController..."
scp "$LOCAL_API_DIR/src/controllers/advancedAnalyticsController.js" \
    "$USER@$SERVER:$REMOTE_DIR/src/controllers/"

# 2. Middleware
echo "   📄 AnalyticsLogger Middleware..."
scp "$LOCAL_API_DIR/src/middleware/analyticsLogger.js" \
    "$USER@$SERVER:$REMOTE_DIR/src/middleware/"

# 3. Routes
echo "   📄 Analytics Routes..."
scp "$LOCAL_API_DIR/src/routes/analytics.js" \
    "$USER@$SERVER:$REMOTE_DIR/src/routes/"

# 4. Server.js modifié
echo "   📄 Server.js..."
scp "$LOCAL_API_DIR/src/server.js" \
    "$USER@$SERVER:$REMOTE_DIR/src/"

# 5. Scripts de monitoring
echo "   📄 Scripts de monitoring..."
scp monitor-analytics-logs.sh test-analytics-logs.js \
    "$USER@$SERVER:/srv/www/internal/moodcycle-api/"

echo "✅ Fichiers déployés"

# Installer les dépendances si nécessaire
echo "📦 Vérification des dépendances..."
ssh "$USER@$SERVER" "cd $REMOTE_DIR && npm install --production 2>/dev/null || echo 'npm install skipped'"

# Créer les répertoires de logs
echo "📁 Création répertoires de logs..."
ssh "$USER@$SERVER" "mkdir -p /srv/www/internal/moodcycle-api/logs"
ssh "$USER@$SERVER" "touch /srv/www/internal/moodcycle-api/logs/analytics.log"
ssh "$USER@$SERVER" "touch /srv/www/internal/moodcycle-api/logs/analytics-errors.log"
ssh "$USER@$SERVER" "touch /srv/www/internal/moodcycle-api/logs/analytics-performance.log"

# Redémarrer PM2
echo "🔄 Redémarrage PM2..."
ssh "$USER@$SERVER" "pm2 restart moodcycle-api || pm2 start $REMOTE_DIR/src/server.js --name moodcycle-api"

# Attendre que l'API soit prête
echo "⏳ Attente redémarrage API..."
sleep 5

# Test de santé
echo "🧪 Test de santé..."
HEALTH_CHECK=$(ssh "$USER@$SERVER" "curl -s -o /dev/null -w '%{http_code}' http://localhost:4000/api/health" 2>/dev/null || echo "000")

if [ "$HEALTH_CHECK" = "200" ]; then
    echo "✅ API opérationnelle"
else
    echo "❌ API non opérationnelle (code: $HEALTH_CHECK)"
    echo "📋 Logs PM2:"
    ssh "$USER@$SERVER" "pm2 logs moodcycle-api --lines 10 --nostream"
    exit 1
fi

# Test des endpoints analytics
echo "🧪 Test des endpoints analytics..."
ANALYTICS_ENDPOINTS=(
    "/api/analytics/health"
    "/api/analytics/overview"
    "/api/analytics/dashboard"
)

FAILED_ENDPOINTS=0
for endpoint in "${ANALYTICS_ENDPOINTS[@]}"; do
    HTTP_CODE=$(ssh "$USER@$SERVER" "curl -s -o /dev/null -w '%{http_code}' -H 'X-Device-ID: deploy-test' 'http://localhost:4000$endpoint'" 2>/dev/null || echo "000")
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo "   ✅ $endpoint: $HTTP_CODE"
    else
        echo "   ❌ $endpoint: $HTTP_CODE"
        FAILED_ENDPOINTS=$((FAILED_ENDPOINTS + 1))
    fi
done

echo ""
if [ "$FAILED_ENDPOINTS" -eq 0 ]; then
    echo "🎉 DÉPLOIEMENT ANALYTICS RÉUSSI!"
    echo "✅ Tous les endpoints analytics sont opérationnels"
    echo ""
    echo "🔗 URLs disponibles:"
    echo "   https://moodcycle.irimwebforge.com/api/analytics/health"
    echo "   https://moodcycle.irimwebforge.com/api/analytics/dashboard"
    echo "   https://moodcycle.irimwebforge.com/admin/advanced-analytics"
    echo ""
    echo "📋 Commandes de monitoring:"
    echo "   ssh $USER@$SERVER './monitor-analytics-logs.sh'"
    echo "   ssh $USER@$SERVER 'pm2 logs moodcycle-api'"
    echo ""
else
    echo "⚠️ Déploiement partiel: $FAILED_ENDPOINTS endpoints en échec"
    echo "📋 Vérifiez les logs sur le serveur"
fi

echo "🎯 Déploiement Analytics terminé!" 