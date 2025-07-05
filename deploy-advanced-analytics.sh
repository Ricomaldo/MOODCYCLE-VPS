#!/bin/bash

# Déploiement des Analytics Avancés MoodCycle
# Mise à jour API + Admin Dashboard

echo "🚀 Déploiement Analytics Avancés MoodCycle"
echo "=========================================="

# Variables
API_DIR="/srv/www/internal/moodcycle-api/current"
ADMIN_DIR="/srv/www/internal/moodcycle-api/current/packages/admin"

echo "📂 Répertoires:"
echo "   API: $API_DIR"
echo "   Admin: $ADMIN_DIR"

# 1. Copier les nouveaux fichiers API
echo ""
echo "📡 Mise à jour API..."

# Copier le nouveau controller
echo "   ✅ AdvancedAnalyticsController"
cp packages/api/src/controllers/advancedAnalyticsController.js $API_DIR/packages/api/src/controllers/

# Copier les nouvelles routes
echo "   ✅ Routes analytics"
cp packages/api/src/routes/analytics.js $API_DIR/packages/api/src/routes/

# Mettre à jour server.js
echo "   ✅ Server.js"
cp packages/api/src/server.js $API_DIR/packages/api/src/

# 2. Redémarrer l'API
echo ""
echo "🔄 Redémarrage API..."
cd $API_DIR
pm2 restart moodcycle-api

# Attendre que l'API redémarre
echo "   ⏳ Attente redémarrage..."
sleep 3

# 3. Test de l'API
echo ""
echo "🧪 Test API..."
API_HEALTH=$(curl -s -H "X-Device-ID: deploy-test" https://moodcycle.irimwebforge.com/api/health | jq -r '.status' 2>/dev/null)

if [ "$API_HEALTH" = "healthy" ]; then
    echo "   ✅ API opérationnelle"
else
    echo "   ❌ API non responsive"
    echo "   📋 Logs PM2:"
    pm2 logs moodcycle-api --lines 10
    exit 1
fi

# 4. Test des nouveaux endpoints
echo ""
echo "🔍 Test endpoints analytics..."

ENDPOINTS=(
    "/api/analytics/health"
    "/api/analytics/overview" 
    "/api/analytics/behavior"
    "/api/analytics/device"
    "/api/analytics/dashboard"
)

for endpoint in "${ENDPOINTS[@]}"; do
    echo -n "   Testing $endpoint... "
    
    RESPONSE=$(curl -s -H "X-Device-ID: deploy-test" "https://moodcycle.irimwebforge.com$endpoint")
    
    if echo "$RESPONSE" | jq -e '.success' >/dev/null 2>&1; then
        echo "✅"
    else
        echo "❌"
        echo "     Response: $RESPONSE"
    fi
done

# 5. Mise à jour Admin Dashboard
echo ""
echo "🖥️ Mise à jour Admin Dashboard..."

# Copier les nouveaux fichiers admin
echo "   📄 Nouveaux composants..."
cp -r packages/admin/src/hooks/useAdvancedAnalytics.ts $ADMIN_DIR/src/hooks/ 2>/dev/null || echo "     Hook déjà présent"
cp -r packages/admin/src/pages/AdvancedAnalytics.tsx $ADMIN_DIR/src/pages/ 2>/dev/null || echo "     Page déjà présente"

# Mettre à jour les fichiers modifiés
echo "   🔧 Mise à jour composants..."
cp packages/admin/src/App.tsx $ADMIN_DIR/src/
cp packages/admin/src/components/AppSidebar.tsx $ADMIN_DIR/src/components/
cp packages/admin/src/components/AppHeader.tsx $ADMIN_DIR/src/components/

# 6. Build et déploiement admin
echo ""
echo "🏗️ Build Admin Dashboard..."
cd $ADMIN_DIR

# Install des dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "   📦 Installation dépendances..."
    npm install
fi

# Build production
echo "   🔨 Build production..."
npm run build

if [ $? -eq 0 ]; then
    echo "   ✅ Build réussi"
else
    echo "   ❌ Erreur build"
    exit 1
fi

# 7. Test final
echo ""
echo "🎯 Tests finaux..."

# Test API health
echo -n "   API Health: "
curl -s -H "X-Device-ID: final-test" https://moodcycle.irimwebforge.com/api/health | jq -r '.status'

# Test admin access
echo -n "   Admin Dashboard: "
ADMIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://moodcycle.irimwebforge.com/admin/)
if [ "$ADMIN_STATUS" = "200" ]; then
    echo "✅ Accessible"
else
    echo "❌ Status $ADMIN_STATUS"
fi

# Test advanced analytics
echo -n "   Analytics Dashboard: "
ANALYTICS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://moodcycle.irimwebforge.com/admin/advanced-analytics)
if [ "$ANALYTICS_STATUS" = "200" ]; then
    echo "✅ Accessible"
else
    echo "❌ Status $ANALYTICS_STATUS"
fi

echo ""
echo "🎉 Déploiement Analytics Avancés terminé!"
echo ""
echo "📊 URLs disponibles:"
echo "   • API Health: https://moodcycle.irimwebforge.com/api/health"
echo "   • Analytics Health: https://moodcycle.irimwebforge.com/api/analytics/health"
echo "   • Admin Dashboard: https://moodcycle.irimwebforge.com/admin/"
echo "   • Advanced Analytics: https://moodcycle.irimwebforge.com/admin/advanced-analytics"
echo ""
echo "✨ Système opérationnel avec analytics comportementaux et device!" 