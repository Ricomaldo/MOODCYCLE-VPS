#!/bin/bash

# 🚀 Script de déploiement MoodCycle API avec fix PM2
# Résout définitivement le problème de chemin PM2

set -e

echo "🚀 === DÉPLOIEMENT MOODCYCLE API AVEC FIX PM2 ==="
echo

# 1. Déploiement classique
echo "📦 1. Déploiement du code..."
npm run deploy:api

# 2. Vérification du symlink current
echo "🔗 2. Vérification du symlink current..."
ssh root@69.62.107.136 'ls -la /srv/www/internal/moodcycle-api/current'

# 3. Redémarrage PM2 avec le bon chemin
echo "🔄 3. Redémarrage PM2 avec ecosystem.config.js..."
ssh root@69.62.107.136 'cd /srv/www/internal/moodcycle-api && pm2 reload ecosystem.config.js'

# 4. Vérification du statut
echo "✅ 4. Vérification du statut..."
ssh root@69.62.107.136 'pm2 show moodcycle-api | grep -E "(script path|exec cwd|status)"'

# 5. Test des endpoints
echo "🧪 5. Test des endpoints..."
sleep 3
HEALTH_CHECK=$(curl -s "https://moodcycle.irimwebforge.com/api/health" | jq -r '.status')
if [ "$HEALTH_CHECK" = "healthy" ]; then
    echo "✅ API Health OK"
else
    echo "❌ API Health FAILED"
    exit 1
fi

INSIGHTS_CHECK=$(curl -s -H "X-Device-ID: deploy-test" "https://moodcycle.irimwebforge.com/api/insights" | jq -r '.success')
if [ "$INSIGHTS_CHECK" = "true" ]; then
    echo "✅ Endpoints sécurisés OK"
else
    echo "❌ Endpoints sécurisés FAILED"
    exit 1
fi

echo
echo "🎉 === DÉPLOIEMENT RÉUSSI ==="
echo "✅ PM2 utilise maintenant le symlink current"
echo "✅ Plus de problèmes de chemin lors des futurs déploiements"
echo "✅ Endpoints sécurisés fonctionnels"
echo
echo "📋 Commandes utiles :"
echo "  - Voir les logs : ssh root@69.62.107.136 'pm2 logs moodcycle-api'"
echo "  - Voir le statut : ssh root@69.62.107.136 'pm2 show moodcycle-api'"
echo "  - Redémarrer : ssh root@69.62.107.136 'pm2 restart moodcycle-api'" 