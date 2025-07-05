#!/bin/bash

# Script de déploiement et test du service Hostinger corrigé
# Version sans dépendances externes

set -e

echo "🚀 DÉPLOIEMENT ET TEST HOSTINGER SERVICE"
echo "========================================"

# Configuration
API_DIR="/srv/www/internal/moodcycle-api"
CURRENT_DIR="$API_DIR/current"
RELEASES_DIR="$API_DIR/releases"
TIMESTAMP=$(date +%Y%m%d%H%M%S)
NEW_RELEASE_DIR="$RELEASES_DIR/$TIMESTAMP"

echo "📁 Création du répertoire de release: $NEW_RELEASE_DIR"
mkdir -p "$NEW_RELEASE_DIR"

# Copier les fichiers depuis le répertoire local
echo "📋 Copie des fichiers..."
cp -r /Users/irimwebforge/Projets/pro/moodcycle/MOODCYCLE-VPS/packages/api/* "$NEW_RELEASE_DIR/"

# Mettre à jour le symlink
echo "🔗 Mise à jour du symlink vers la nouvelle release"
rm -f "$CURRENT_DIR"
ln -s "$NEW_RELEASE_DIR" "$CURRENT_DIR"

# Redémarrer PM2 avec le nouveau symlink
echo "🔄 Redémarrage PM2..."
cd "$CURRENT_DIR"
pm2 restart moodcycle-api || pm2 start src/server.js --name moodcycle-api

# Attendre que le serveur soit prêt
echo "⏳ Attente du démarrage du serveur..."
sleep 3

# Tester le service Hostinger
echo ""
echo "🧪 TEST DU SERVICE HOSTINGER"
echo "============================"

# Vérifier que le serveur répond
if curl -s http://localhost:3000/api/health > /dev/null; then
    echo "✅ Serveur API accessible"
else
    echo "❌ Erreur: Serveur API non accessible"
    exit 1
fi

# Tester les endpoints d'infrastructure
echo ""
echo "🌐 Test des endpoints d'infrastructure..."

# Test endpoint infrastructure
echo -n "Testing /api/infrastructure/metrics... "
if curl -s "http://localhost:3000/api/infrastructure/metrics" -H "Authorization: Bearer dev-admin-token" > /dev/null; then
    echo "✅ OK"
else
    echo "❌ FAIL"
fi

# Test endpoint server metrics
echo -n "Testing /api/infrastructure/server... "
if curl -s "http://localhost:3000/api/infrastructure/server" -H "Authorization: Bearer dev-admin-token" > /dev/null; then
    echo "✅ OK"
else
    echo "❌ FAIL"
fi

# Exécuter le test complet du service Hostinger
echo ""
echo "🔧 Test complet du service Hostinger..."
cd "$CURRENT_DIR"
node src/tests/test-hostinger-real-api.js

# Vérifier les logs PM2
echo ""
echo "📊 Logs PM2 récents:"
pm2 logs moodcycle-api --lines 5

echo ""
echo "🎉 DÉPLOIEMENT TERMINÉ!"
echo "======================"
echo "✅ Release: $TIMESTAMP"
echo "✅ Symlink: $CURRENT_DIR -> $NEW_RELEASE_DIR"
echo "✅ PM2 redémarré"
echo "✅ Tests Hostinger exécutés"
echo ""
echo "🌐 Interface admin: http://admin.moodcycle-api.com"
echo "📊 Page Infrastructure: http://admin.moodcycle-api.com/infrastructure" 