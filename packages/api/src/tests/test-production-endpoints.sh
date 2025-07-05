#!/bin/bash
# Test des endpoints sécurisés en production

PROD_URL="https://moodcycle.irimwebforge.com"
DEVICE_ID="test-production-validation"

echo "🌐 === VALIDATION ENDPOINTS PRODUCTION ==="
echo "URL: $PROD_URL"
echo "Device ID: $DEVICE_ID"
echo

# Test 1: API Health (baseline)
echo "🔍 TEST 1: API Health"
HEALTH_RESPONSE=$(curl -s "$PROD_URL/api/health")
echo "Response: $HEALTH_RESPONSE"
if echo "$HEALTH_RESPONSE" | grep -q "healthy"; then
  echo "✅ API Health OK"
else
  echo "❌ API Health FAILED"
fi
echo

# Test 2: Nouveaux endpoints sécurisés
echo "🔍 TEST 2: Endpoints sécurisés"

echo "Testing /api/insights:"
INSIGHTS_RESPONSE=$(curl -s -w "%{http_code}" -H "X-Device-ID: $DEVICE_ID" "$PROD_URL/api/insights")
echo "Response: $INSIGHTS_RESPONSE"
echo

echo "Testing /api/phases:"
PHASES_RESPONSE=$(curl -s -w "%{http_code}" -H "X-Device-ID: $DEVICE_ID" "$PROD_URL/api/phases")
echo "Response: $PHASES_RESPONSE"
echo

echo "Testing /api/closings:"
CLOSINGS_RESPONSE=$(curl -s -w "%{http_code}" -H "X-Device-ID: $DEVICE_ID" "$PROD_URL/api/closings")
echo "Response: $CLOSINGS_RESPONSE"
echo

echo "Testing /api/vignettes:"
VIGNETTES_RESPONSE=$(curl -s -w "%{http_code}" -H "X-Device-ID: $DEVICE_ID" "$PROD_URL/api/vignettes")
echo "Response: $VIGNETTES_RESPONSE"
echo

# Test 3: Sécurité (sans X-Device-ID)
echo "🔍 TEST 3: Sécurité (sans X-Device-ID)"
SECURITY_RESPONSE=$(curl -s -w "%{http_code}" "$PROD_URL/api/insights")
echo "Response sans device ID: $SECURITY_RESPONSE"
if echo "$SECURITY_RESPONSE" | grep -q "401"; then
  echo "✅ Sécurité OK - Accès refusé sans device ID"
else
  echo "⚠️ Sécurité - Vérifier configuration"
fi
echo

# Test 4: Endpoints admin (doivent toujours fonctionner)
echo "🔍 TEST 4: Endpoints admin"
ADMIN_RESPONSE=$(curl -s -w "%{http_code}" "$PROD_URL/api/admin/insights")
echo "Admin response: $ADMIN_RESPONSE"
if echo "$ADMIN_RESPONSE" | grep -q "401"; then
  echo "✅ Admin endpoints OK - Auth requise"
else
  echo "⚠️ Admin endpoints - Vérifier configuration"
fi
echo

echo "📋 === DIAGNOSTIC ==="
echo "Si les nouveaux endpoints retournent 404:"
echo "1. Vérifier que PM2 a bien redémarré"
echo "2. Vérifier les logs PM2"
echo "3. Vérifier que server.js contient les nouvelles routes"
echo "4. Vérifier que les fichiers de données existent"
echo
echo "Commandes de diagnostic:"
echo "ssh root@69.62.107.136 'pm2 logs moodcycle-api --lines 20'"
echo "ssh root@69.62.107.136 'pm2 show moodcycle-api'" 