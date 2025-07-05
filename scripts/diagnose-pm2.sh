#!/bin/bash

# 🔍 Script de diagnostic PM2 pour MoodCycle API
# Identifie les problèmes de chemin et propose des solutions

echo "🔍 === DIAGNOSTIC PM2 MOODCYCLE API ==="
echo

# 1. Vérification du statut PM2
echo "📊 1. Statut PM2..."
ssh root@69.62.107.136 'pm2 list | grep moodcycle-api'
echo

# 2. Vérification des chemins PM2
echo "📂 2. Chemins PM2..."
PM2_SCRIPT_PATH=$(ssh root@69.62.107.136 'pm2 show moodcycle-api' | grep 'script path' | awk '{print $NF}')
PM2_EXEC_CWD=$(ssh root@69.62.107.136 'pm2 show moodcycle-api' | grep 'exec cwd' | awk '{print $NF}')

echo "Script path: $PM2_SCRIPT_PATH"
echo "Exec cwd: $PM2_EXEC_CWD"

# 3. Vérification du symlink current
echo
echo "🔗 3. Symlink current..."
CURRENT_TARGET=$(ssh root@69.62.107.136 'ls -la /srv/www/internal/moodcycle-api/current' | awk '{print $NF}')
echo "Current pointe vers: $CURRENT_TARGET"

# 4. Vérification des releases
echo
echo "📦 4. Releases disponibles..."
ssh root@69.62.107.136 'ls -la /srv/www/internal/moodcycle-api/releases/ | tail -3'

# 5. Analyse des problèmes
echo
echo "🧐 5. Analyse des problèmes..."

if [[ "$PM2_SCRIPT_PATH" == *"/current/"* ]]; then
    echo "✅ PM2 utilise le symlink current - OK"
else
    echo "❌ PM2 utilise un chemin absolu vers une release - PROBLÈME"
    echo "   Script path: $PM2_SCRIPT_PATH"
    echo "   Devrait être: /srv/www/internal/moodcycle-api/current/src/server.js"
fi

if [[ "$PM2_EXEC_CWD" == *"/current"* ]]; then
    echo "✅ PM2 exec cwd utilise current - OK"
else
    echo "❌ PM2 exec cwd utilise un chemin absolu - PROBLÈME"
    echo "   Exec cwd: $PM2_EXEC_CWD"
    echo "   Devrait être: /srv/www/internal/moodcycle-api/current"
fi

# 6. Test des endpoints
echo
echo "🧪 6. Test des endpoints..."
HEALTH_STATUS=$(curl -s "https://moodcycle.irimwebforge.com/api/health" | jq -r '.status' 2>/dev/null || echo "error")
if [ "$HEALTH_STATUS" = "healthy" ]; then
    echo "✅ API Health OK"
else
    echo "❌ API Health FAILED ou inaccessible"
fi

INSIGHTS_STATUS=$(curl -s -H "X-Device-ID: diagnostic-test" "https://moodcycle.irimwebforge.com/api/insights" | jq -r '.success' 2>/dev/null || echo "error")
if [ "$INSIGHTS_STATUS" = "true" ]; then
    echo "✅ Endpoints sécurisés OK"
else
    echo "❌ Endpoints sécurisés FAILED"
fi

# 7. Solutions proposées
echo
echo "🛠️  7. Solutions proposées..."
if [[ "$PM2_SCRIPT_PATH" != *"/current/"* ]] || [[ "$PM2_EXEC_CWD" != *"/current"* ]]; then
    echo "🔧 Pour résoudre le problème de chemin PM2 :"
    echo "   1. ssh root@69.62.107.136 'pm2 delete moodcycle-api'"
    echo "   2. ssh root@69.62.107.136 'cd /srv/www/internal/moodcycle-api && pm2 start ecosystem.config.js'"
    echo "   3. ssh root@69.62.107.136 'pm2 save'"
    echo
    echo "🚀 Ou utiliser le script automatique :"
    echo "   ./MOODCYCLE-VPS/deploy-with-pm2-fix.sh"
fi

echo
echo "📋 Commandes utiles :"
echo "  - Logs PM2 : ssh root@69.62.107.136 'pm2 logs moodcycle-api --lines 20'"
echo "  - Redémarrer : ssh root@69.62.107.136 'pm2 restart moodcycle-api'"
echo "  - Statut détaillé : ssh root@69.62.107.136 'pm2 show moodcycle-api'" 