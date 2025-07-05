#!/bin/bash

# 🧪 Script de test complet des endpoints MoodCycle API
# Teste tous les endpoints sécurisés et leur comportement

set -e

API_URL="https://moodcycle.irimwebforge.com"
DEVICE_ID="test-endpoints-$(date +%s)"
ADMIN_TOKEN="test-admin-token"

echo "🧪 === TESTS ENDPOINTS MOODCYCLE API ==="
echo "🌐 URL: $API_URL"
echo "📱 Device ID: $DEVICE_ID"
echo

# Compteurs de tests
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Fonction de test
run_test() {
    local test_name="$1"
    local expected_status="$2"
    local curl_command="$3"
    local validation_command="$4"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo "🔍 Test $TOTAL_TESTS: $test_name"
    
    # Exécuter la commande curl
    response=$(eval "$curl_command" 2>/dev/null)
    actual_status=$(echo "$response" | tail -c 4)
    
    # Validation du statut HTTP
    if [ "$actual_status" = "$expected_status" ]; then
        # Validation supplémentaire si fournie
        if [ -n "$validation_command" ]; then
            if eval "$validation_command" <<< "$response"; then
                echo "✅ PASS - $test_name"
                PASSED_TESTS=$((PASSED_TESTS + 1))
            else
                echo "❌ FAIL - $test_name (validation failed)"
                FAILED_TESTS=$((FAILED_TESTS + 1))
            fi
        else
            echo "✅ PASS - $test_name"
            PASSED_TESTS=$((PASSED_TESTS + 1))
        fi
    else
        echo "❌ FAIL - $test_name (expected $expected_status, got $actual_status)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    echo
}

# === TESTS DE SANTÉ ===
echo "🏥 === TESTS DE SANTÉ ==="

run_test "API Health Check" "200" \
    "curl -s -w '%{http_code}' '$API_URL/api/health'" \
    "grep -q '\"status\":\"healthy\"'"

# === TESTS ENDPOINTS SÉCURISÉS (avec X-Device-ID) ===
echo "🔒 === TESTS ENDPOINTS SÉCURISÉS (avec X-Device-ID) ==="

run_test "GET /api/insights avec device ID" "200" \
    "curl -s -w '%{http_code}' -H 'X-Device-ID: $DEVICE_ID' '$API_URL/api/insights'" \
    "grep -q '\"success\":true'"

run_test "GET /api/phases avec device ID" "200" \
    "curl -s -w '%{http_code}' -H 'X-Device-ID: $DEVICE_ID' '$API_URL/api/phases'" \
    "grep -q '\"success\":true'"

run_test "GET /api/closings avec device ID" "200" \
    "curl -s -w '%{http_code}' -H 'X-Device-ID: $DEVICE_ID' '$API_URL/api/closings'" \
    "grep -q '\"success\":true'"

run_test "GET /api/vignettes avec device ID" "200" \
    "curl -s -w '%{http_code}' -H 'X-Device-ID: $DEVICE_ID' '$API_URL/api/vignettes'" \
    "grep -q '\"success\":true'"

# === TESTS SÉCURITÉ (sans X-Device-ID) ===
echo "🚫 === TESTS SÉCURITÉ (sans X-Device-ID) ==="

run_test "GET /api/insights sans device ID" "401" \
    "curl -s -w '%{http_code}' '$API_URL/api/insights'" \
    "grep -q '\"error\"'"

run_test "GET /api/phases sans device ID" "401" \
    "curl -s -w '%{http_code}' '$API_URL/api/phases'" \
    "grep -q '\"error\"'"

run_test "GET /api/closings sans device ID" "401" \
    "curl -s -w '%{http_code}' '$API_URL/api/closings'" \
    "grep -q '\"error\"'"

run_test "GET /api/vignettes sans device ID" "401" \
    "curl -s -w '%{http_code}' '$API_URL/api/vignettes'" \
    "grep -q '\"error\"'"

# === TESTS ENDPOINTS ADMIN ===
echo "🛡️ === TESTS ENDPOINTS ADMIN ==="

run_test "GET /api/admin/insights sans token" "401" \
    "curl -s -w '%{http_code}' '$API_URL/api/admin/insights'" \
    "grep -q '\"error\"'"

# === TESTS DE CONTENU ===
echo "📋 === TESTS DE CONTENU ==="

run_test "Insights contiennent des phases" "200" \
    "curl -s -w '%{http_code}' -H 'X-Device-ID: $DEVICE_ID' '$API_URL/api/insights'" \
    "grep -q '\"menstrual\"'"

run_test "Phases contiennent 4 phases cycliques" "200" \
    "curl -s -w '%{http_code}' -H 'X-Device-ID: $DEVICE_ID' '$API_URL/api/phases'" \
    "grep -q '\"follicular\"' && grep -q '\"ovulatory\"' && grep -q '\"luteal\"'"

run_test "Closings contiennent les personas" "200" \
    "curl -s -w '%{http_code}' -H 'X-Device-ID: $DEVICE_ID' '$API_URL/api/closings'" \
    "grep -q '\"emma\"' && grep -q '\"laure\"'"

run_test "Vignettes contiennent metadata" "200" \
    "curl -s -w '%{http_code}' -H 'X-Device-ID: $DEVICE_ID' '$API_URL/api/vignettes'" \
    "grep -q '\"totalVignettes\"'"

# === TESTS HEADERS ===
echo "📤 === TESTS HEADERS ==="

run_test "Device ID inclus dans la réponse" "200" \
    "curl -s -w '%{http_code}' -H 'X-Device-ID: $DEVICE_ID' '$API_URL/api/insights'" \
    "grep -q '\"deviceId\":\"$DEVICE_ID\"'"

run_test "Content-Type JSON" "200" \
    "curl -s -w '%{http_code}' -I '$API_URL/api/health'" \
    "grep -q 'content-type: application/json'"

# === RÉSULTATS ===
echo "📊 === RÉSULTATS DES TESTS ==="
echo "🔢 Total: $TOTAL_TESTS tests"
echo "✅ Réussis: $PASSED_TESTS tests"
echo "❌ Échoués: $FAILED_TESTS tests"
echo

if [ $FAILED_TESTS -eq 0 ]; then
    echo "🎉 TOUS LES TESTS SONT PASSÉS !"
    echo "✅ L'API fonctionne correctement"
    exit 0
else
    echo "⚠️  CERTAINS TESTS ONT ÉCHOUÉ"
    echo "🔧 Vérifiez les logs et la configuration"
    echo
    echo "📋 Commandes de diagnostic :"
    echo "  - ./scripts/diagnose-pm2.sh"
    echo "  - ssh root@69.62.107.136 'pm2 logs moodcycle-api --lines 20'"
    exit 1
fi 