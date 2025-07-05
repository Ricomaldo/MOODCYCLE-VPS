#!/bin/bash

# Monitoring des logs Analytics Avancés MoodCycle
# Surveillance PM2, API, erreurs et performances

echo "📊 Monitoring Logs Analytics Avancés MoodCycle"
echo "=============================================="

# Variables
API_DIR="/srv/www/internal/moodcycle-api/current"
LOG_DIR="/srv/www/internal/moodcycle-api/logs"
ANALYTICS_LOG="$LOG_DIR/analytics.log"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}📂 Répertoires de logs:${NC}"
echo "   API: $API_DIR"
echo "   Logs: $LOG_DIR"
echo ""

# Fonction pour afficher les logs avec couleurs
show_logs() {
    local title="$1"
    local command="$2"
    local lines="${3:-20}"
    
    echo -e "${CYAN}🔍 $title${NC}"
    echo "----------------------------------------"
    
    if eval "$command" 2>/dev/null; then
        echo ""
    else
        echo -e "${RED}❌ Erreur lors de la récupération des logs${NC}"
        echo ""
    fi
}

# Fonction pour surveiller les logs en temps réel
monitor_realtime() {
    echo -e "${GREEN}📡 Monitoring temps réel des logs analytics...${NC}"
    echo -e "${YELLOW}Appuyez sur Ctrl+C pour arrêter${NC}"
    echo ""
    
    # Créer le fichier de log analytics s'il n'existe pas
    touch "$ANALYTICS_LOG"
    
    # Surveiller les logs PM2 et analytics en parallèle
    (
        pm2 logs moodcycle-api --raw --lines 0 | while read line; do
            if echo "$line" | grep -i "analytics\|error\|crash\|performance" >/dev/null; then
                echo -e "${BLUE}[PM2]${NC} $line" | tee -a "$ANALYTICS_LOG"
            fi
        done
    ) &
    
    # Surveiller les requêtes analytics
    (
        tail -f /var/log/nginx/access.log 2>/dev/null | while read line; do
            if echo "$line" | grep "/api/analytics" >/dev/null; then
                echo -e "${GREEN}[NGINX]${NC} $line" | tee -a "$ANALYTICS_LOG"
            fi
        done
    ) &
    
    wait
}

# Menu principal
show_menu() {
    echo -e "${PURPLE}📋 Options de monitoring:${NC}"
    echo "1. 📊 Logs PM2 MoodCycle API"
    echo "2. 🔍 Logs erreurs récentes"
    echo "3. 📈 Logs analytics spécifiques"
    echo "4. 🌐 Logs Nginx (requêtes analytics)"
    echo "5. 💾 Logs système (disk, memory)"
    echo "6. 📡 Monitoring temps réel"
    echo "7. 🧪 Test endpoints avec logs"
    echo "8. 📋 Rapport complet"
    echo "9. 🧹 Nettoyer anciens logs"
    echo "0. ❌ Quitter"
    echo ""
    read -p "Choisissez une option (0-9): " choice
}

# 1. Logs PM2
show_pm2_logs() {
    show_logs "Logs PM2 MoodCycle API (20 dernières lignes)" \
        "pm2 logs moodcycle-api --lines 20 --raw"
    
    echo -e "${YELLOW}Status PM2:${NC}"
    pm2 status moodcycle-api
    echo ""
}

# 2. Logs d'erreurs
show_error_logs() {
    show_logs "Erreurs récentes dans les logs PM2" \
        "pm2 logs moodcycle-api --lines 100 --raw | grep -i 'error\|exception\|crash' | tail -20"
    
    echo -e "${YELLOW}Erreurs Node.js récentes:${NC}"
    journalctl -u pm2-root --since "1 hour ago" | grep -i "error\|exception" | tail -10 2>/dev/null || echo "Aucune erreur système récente"
    echo ""
}

# 3. Logs analytics spécifiques
show_analytics_logs() {
    show_logs "Requêtes analytics dans les logs PM2" \
        "pm2 logs moodcycle-api --lines 200 --raw | grep -i 'analytics' | tail -20"
    
    if [ -f "$ANALYTICS_LOG" ]; then
        echo -e "${YELLOW}Logs analytics dédiés:${NC}"
        tail -20 "$ANALYTICS_LOG"
    else
        echo -e "${YELLOW}Aucun log analytics dédié trouvé${NC}"
    fi
    echo ""
}

# 4. Logs Nginx
show_nginx_logs() {
    show_logs "Requêtes analytics dans Nginx" \
        "tail -100 /var/log/nginx/access.log | grep '/api/analytics' | tail -20"
    
    echo -e "${YELLOW}Erreurs Nginx récentes:${NC}"
    tail -20 /var/log/nginx/error.log 2>/dev/null | grep -v "client disconnected" || echo "Aucune erreur Nginx récente"
    echo ""
}

# 5. Logs système
show_system_logs() {
    echo -e "${CYAN}💾 Métriques système${NC}"
    echo "----------------------------------------"
    
    echo -e "${YELLOW}Espace disque:${NC}"
    df -h | grep -E "Filesystem|/srv|/var"
    echo ""
    
    echo -e "${YELLOW}Mémoire:${NC}"
    free -h
    echo ""
    
    echo -e "${YELLOW}Processus PM2:${NC}"
    ps aux | grep -E "PM2|node.*moodcycle" | head -5
    echo ""
    
    echo -e "${YELLOW}Charge système:${NC}"
    uptime
    echo ""
}

# 6. Test endpoints avec logs
test_endpoints_with_logs() {
    echo -e "${GREEN}🧪 Test endpoints analytics avec monitoring logs${NC}"
    echo "=================================================="
    
    # Démarrer monitoring en arrière-plan
    (
        echo -e "${BLUE}[LOG MONITOR]${NC} Démarrage monitoring..."
        pm2 logs moodcycle-api --lines 0 --raw | grep -i "analytics\|error" &
        MONITOR_PID=$!
        
        sleep 1
        
        # Tuer le monitoring après 30 secondes
        sleep 30
        kill $MONITOR_PID 2>/dev/null
    ) &
    
    # Tester les endpoints
    ENDPOINTS=(
        "/api/analytics/health"
        "/api/analytics/overview"
        "/api/analytics/behavior"
        "/api/analytics/device"
        "/api/analytics/dashboard"
    )
    
    for endpoint in "${ENDPOINTS[@]}"; do
        echo -e "${CYAN}🔍 Test $endpoint${NC}"
        
        RESPONSE=$(curl -s -w "%{http_code}" -H "X-Device-ID: log-test" \
            "https://moodcycle.irimwebforge.com$endpoint")
        
        HTTP_CODE="${RESPONSE: -3}"
        BODY="${RESPONSE%???}"
        
        if [ "$HTTP_CODE" = "200" ]; then
            echo -e "   ✅ Status: $HTTP_CODE"
            if echo "$BODY" | jq -e '.success' >/dev/null 2>&1; then
                echo -e "   📊 JSON valide"
            else
                echo -e "   ⚠️ Réponse non-JSON: ${BODY:0:100}..."
            fi
        else
            echo -e "   ❌ Status: $HTTP_CODE"
            echo -e "   💬 Response: ${BODY:0:200}..."
        fi
        
        sleep 1
    done
    
    echo ""
    echo -e "${YELLOW}Vérifiez les logs ci-dessus pour les détails des requêtes${NC}"
    echo ""
}

# 7. Rapport complet
generate_report() {
    local report_file="/tmp/analytics-logs-report-$(date +%Y%m%d-%H%M%S).txt"
    
    echo -e "${GREEN}📋 Génération rapport complet...${NC}"
    
    {
        echo "RAPPORT LOGS ANALYTICS MOODCYCLE"
        echo "================================="
        echo "Date: $(date)"
        echo "Serveur: $(hostname)"
        echo ""
        
        echo "=== STATUS PM2 ==="
        pm2 status
        echo ""
        
        echo "=== LOGS PM2 RÉCENTS ==="
        pm2 logs moodcycle-api --lines 50 --raw
        echo ""
        
        echo "=== ERREURS RÉCENTES ==="
        pm2 logs moodcycle-api --lines 200 --raw | grep -i "error\|exception" | tail -20
        echo ""
        
        echo "=== REQUÊTES ANALYTICS ==="
        tail -100 /var/log/nginx/access.log | grep '/api/analytics' | tail -20
        echo ""
        
        echo "=== MÉTRIQUES SYSTÈME ==="
        echo "Espace disque:"
        df -h
        echo ""
        echo "Mémoire:"
        free -h
        echo ""
        echo "Charge:"
        uptime
        echo ""
        
    } > "$report_file"
    
    echo -e "${GREEN}✅ Rapport généré: $report_file${NC}"
    echo -e "${CYAN}📖 Afficher le rapport? (y/n):${NC}"
    read -p "" show_report
    
    if [ "$show_report" = "y" ] || [ "$show_report" = "Y" ]; then
        less "$report_file"
    fi
    echo ""
}

# 8. Nettoyer logs
cleanup_logs() {
    echo -e "${YELLOW}🧹 Nettoyage des anciens logs...${NC}"
    
    # Nettoyer logs PM2 anciens
    pm2 flush moodcycle-api
    echo "   ✅ Logs PM2 vidés"
    
    # Nettoyer logs analytics dédiés
    if [ -f "$ANALYTICS_LOG" ]; then
        > "$ANALYTICS_LOG"
        echo "   ✅ Logs analytics dédiés vidés"
    fi
    
    # Nettoyer anciens rapports
    find /tmp -name "analytics-logs-report-*" -mtime +7 -delete 2>/dev/null
    echo "   ✅ Anciens rapports supprimés"
    
    echo -e "${GREEN}✨ Nettoyage terminé${NC}"
    echo ""
}

# Boucle principale
main() {
    while true; do
        show_menu
        
        case $choice in
            1) show_pm2_logs ;;
            2) show_error_logs ;;
            3) show_analytics_logs ;;
            4) show_nginx_logs ;;
            5) show_system_logs ;;
            6) monitor_realtime ;;
            7) test_endpoints_with_logs ;;
            8) generate_report ;;
            9) cleanup_logs ;;
            0) 
                echo -e "${GREEN}👋 Au revoir!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ Option invalide${NC}"
                echo ""
                ;;
        esac
        
        echo -e "${CYAN}Appuyez sur Entrée pour continuer...${NC}"
        read
        clear
    done
}

# Vérifications initiales
echo -e "${YELLOW}🔍 Vérifications initiales...${NC}"

# Vérifier PM2
if ! command -v pm2 >/dev/null; then
    echo -e "${RED}❌ PM2 non trouvé${NC}"
    exit 1
fi

# Vérifier processus MoodCycle
if ! pm2 status | grep -q "moodcycle-api"; then
    echo -e "${RED}❌ Processus moodcycle-api non trouvé dans PM2${NC}"
    echo "Processus PM2 disponibles:"
    pm2 status
    exit 1
fi

echo -e "${GREEN}✅ Vérifications OK${NC}"
echo ""

# Créer répertoire logs si nécessaire
mkdir -p "$LOG_DIR"

# Si argument fourni, exécuter directement
if [ "$1" = "realtime" ]; then
    monitor_realtime
elif [ "$1" = "report" ]; then
    generate_report
elif [ "$1" = "test" ]; then
    test_endpoints_with_logs
else
    main
fi 