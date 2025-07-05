#!/bin/bash
# Test sécurité des nouveaux endpoints app mobile

API_URL="http://localhost:4000"
DEVICE_ID="test-device-security"

echo "🔒 === TESTS SÉCURITÉ ENDPOINTS APP MOBILE ==="
echo

# Test 1: Accès sans X-Device-ID (doit échouer)
echo "📋 TEST 1: Accès sans X-Device-ID (doit être refusé)"
echo "GET /api/insights sans header:"
curl -s -w "Status: %{http_code}\n" "$API_URL/api/insights" | head -2
echo

echo "GET /api/phases sans header:"
curl -s -w "Status: %{http_code}\n" "$API_URL/api/phases" | head -2
echo

# Test 2: Accès avec X-Device-ID (doit fonctionner)
echo "📋 TEST 2: Accès avec X-Device-ID (doit fonctionner)"
echo "GET /api/insights avec X-Device-ID:"
RESPONSE=$(curl -s -w "Status: %{http_code}" \
  -H "X-Device-ID: $DEVICE_ID" \
  "$API_URL/api/insights")
echo "$RESPONSE" | grep -o '"success":true' || echo "❌ Échec"
echo "$RESPONSE" | grep -o 'Status: [0-9]*'
echo

echo "GET /api/phases avec X-Device-ID:"
RESPONSE=$(curl -s -w "Status: %{http_code}" \
  -H "X-Device-ID: $DEVICE_ID" \
  "$API_URL/api/phases")
echo "$RESPONSE" | grep -o '"success":true' || echo "❌ Échec"
echo "$RESPONSE" | grep -o 'Status: [0-9]*'
echo

echo "GET /api/closings avec X-Device-ID:"
RESPONSE=$(curl -s -w "Status: %{http_code}" \
  -H "X-Device-ID: $DEVICE_ID" \
  "$API_URL/api/closings")
echo "$RESPONSE" | grep -o '"success":true' || echo "❌ Échec"
echo "$RESPONSE" | grep -o 'Status: [0-9]*'
echo

echo "GET /api/vignettes avec X-Device-ID:"
RESPONSE=$(curl -s -w "Status: %{http_code}" \
  -H "X-Device-ID: $DEVICE_ID" \
  "$API_URL/api/vignettes")
echo "$RESPONSE" | grep -o '"success":true' || echo "❌ Échec"
echo "$RESPONSE" | grep -o 'Status: [0-9]*'
echo

# Test 3: Vérifier structure des données
echo "📋 TEST 3: Vérification structure des données"
echo "Structure insights:"
curl -s -H "X-Device-ID: $DEVICE_ID" "$API_URL/api/insights" | \
  jq -r '.data | keys[]' | head -4
echo

echo "Structure phases:"
curl -s -H "X-Device-ID: $DEVICE_ID" "$API_URL/api/phases" | \
  jq -r '.data | keys[]' | head -4
echo

# Test 4: Comparaison avec endpoints admin (doivent être différents)
echo "📋 TEST 4: Comparaison sécurité admin vs mobile"
echo "Admin sans token (doit échouer):"
curl -s -w "Status: %{http_code}\n" "$API_URL/api/admin/insights" | head -1
echo

echo "Mobile sans device ID (doit échouer):"
curl -s -w "Status: %{http_code}\n" "$API_URL/api/insights" | head -1
echo

echo "✅ Tests terminés - Vérifiez que:"
echo "- Endpoints mobile refusent sans X-Device-ID"
echo "- Endpoints mobile acceptent avec X-Device-ID"
echo "- Endpoints admin refusent sans Bearer token"
echo "- Données sont correctement structurées" 