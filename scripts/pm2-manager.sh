#!/bin/bash

# 🚀 PM2 Manager pour MoodCycle API
# Usage: ./pm2-manager.sh [start|stop|restart|status|logs|install]

set -e

PROJECT_ROOT="/Users/irimwebforge/Projets/pro/moodcycle/MOODCYCLE-VPS"
APP_NAME="moodcycle-api"

cd "$PROJECT_ROOT"

case "$1" in
    "start")
        echo "🚀 Démarrage de $APP_NAME..."
        npx pm2 start ecosystem.config.js --env development
        npx pm2 list
        ;;
    "stop")
        echo "🛑 Arrêt de $APP_NAME..."
        npx pm2 stop $APP_NAME
        npx pm2 list
        ;;
    "restart")
        echo "🔄 Redémarrage de $APP_NAME..."
        npx pm2 restart $APP_NAME
        npx pm2 list
        ;;
    "status")
        echo "📊 Statut de $APP_NAME..."
        npx pm2 list
        ;;
    "logs")
        echo "📋 Logs de $APP_NAME..."
        npx pm2 logs $APP_NAME --lines 20
        ;;
    "install")
        echo "📦 Installation globale de PM2..."
        npm install -g pm2
        echo "✅ PM2 installé globalement"
        ;;
    "test")
        echo "🧪 Test de l'API..."
        echo "Health check:"
        curl -s http://localhost:3001/api/health | jq '.' 2>/dev/null || curl -s http://localhost:3001/api/health
        echo -e "\n\nStores analytics:"
        curl -s -H "X-Device-ID: test-device-123" http://localhost:3001/api/stores/analytics | jq '.success' 2>/dev/null || echo "API accessible"
        ;;
    *)
        echo "Usage: $0 [start|stop|restart|status|logs|install|test]"
        echo ""
        echo "Commandes disponibles:"
        echo "  start    - Démarrer l'API"
        echo "  stop     - Arrêter l'API"
        echo "  restart  - Redémarrer l'API"
        echo "  status   - Voir le statut"
        echo "  logs     - Voir les logs"
        echo "  install  - Installer PM2 globalement"
        echo "  test     - Tester l'API"
        exit 1
        ;;
esac 