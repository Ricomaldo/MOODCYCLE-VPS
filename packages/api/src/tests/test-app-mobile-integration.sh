#!/bin/bash
# Test d'intégration app mobile - Simulation complète

API_URL="http://localhost:4000"
DEVICE_ID="test-app-mobile-integration"
APP_VERSION="1.0.0-mvp"

echo "📱 === TEST INTÉGRATION APP MOBILE ==="
echo "Device ID: $DEVICE_ID"
echo "App Version: $APP_VERSION"
echo

# Headers standards de l'app mobile
HEADERS="-H 'X-Device-ID: $DEVICE_ID' -H 'X-App-Version: $APP_VERSION' -H 'Content-Type: application/json'"

# Test 1: Récupération des insights (comme ContentManager.getInsights())
echo "🔍 TEST 1: Récupération insights"
INSIGHTS_RESPONSE=$(curl -s -H "X-Device-ID: $DEVICE_ID" -H "X-App-Version: $APP_VERSION" "$API_URL/api/insights")
INSIGHTS_SUCCESS=$(echo "$INSIGHTS_RESPONSE" | jq -r '.success')
INSIGHTS_COUNT=$(echo "$INSIGHTS_RESPONSE" | jq -r '.data | keys | length')

if [ "$INSIGHTS_SUCCESS" = "true" ]; then
  echo "✅ Insights récupérés avec succès"
  echo "📊 Nombre de phases: $INSIGHTS_COUNT"
  echo "🗂️ Phases disponibles: $(echo "$INSIGHTS_RESPONSE" | jq -r '.data | keys | join(", ")')"
else
  echo "❌ Échec récupération insights"
  echo "$INSIGHTS_RESPONSE" | jq '.'
fi
echo

# Test 2: Récupération des phases (comme ContentManager.getPhases())
echo "🔍 TEST 2: Récupération phases"
PHASES_RESPONSE=$(curl -s -H "X-Device-ID: $DEVICE_ID" -H "X-App-Version: $APP_VERSION" "$API_URL/api/phases")
PHASES_SUCCESS=$(echo "$PHASES_RESPONSE" | jq -r '.success')
PHASES_COUNT=$(echo "$PHASES_RESPONSE" | jq -r '.data | keys | length')

if [ "$PHASES_SUCCESS" = "true" ]; then
  echo "✅ Phases récupérées avec succès"
  echo "📊 Nombre de phases: $PHASES_COUNT"
  
  # Vérifier structure editableContent
  HAS_EDITABLE=$(echo "$PHASES_RESPONSE" | jq -r '.data.menstrual.editableContent != null')
  if [ "$HAS_EDITABLE" = "true" ]; then
    echo "✅ Structure editableContent présente"
  else
    echo "⚠️ Structure editableContent manquante"
  fi
else
  echo "❌ Échec récupération phases"
  echo "$PHASES_RESPONSE" | jq '.'
fi
echo

# Test 3: Récupération des closings
echo "🔍 TEST 3: Récupération closings"
CLOSINGS_RESPONSE=$(curl -s -H "X-Device-ID: $DEVICE_ID" -H "X-App-Version: $APP_VERSION" "$API_URL/api/closings")
CLOSINGS_SUCCESS=$(echo "$CLOSINGS_RESPONSE" | jq -r '.success')

if [ "$CLOSINGS_SUCCESS" = "true" ]; then
  echo "✅ Closings récupérés avec succès"
  echo "👥 Personas disponibles: $(echo "$CLOSINGS_RESPONSE" | jq -r '.data | keys | join(", ")')"
else
  echo "❌ Échec récupération closings"
fi
echo

# Test 4: Récupération des vignettes
echo "🔍 TEST 4: Récupération vignettes"
VIGNETTES_RESPONSE=$(curl -s -H "X-Device-ID: $DEVICE_ID" -H "X-App-Version: $APP_VERSION" "$API_URL/api/vignettes")
VIGNETTES_SUCCESS=$(echo "$VIGNETTES_RESPONSE" | jq -r '.success')

if [ "$VIGNETTES_SUCCESS" = "true" ]; then
  echo "✅ Vignettes récupérées avec succès"
  echo "🎯 Phases disponibles: $(echo "$VIGNETTES_RESPONSE" | jq -r '.data | keys | join(", ")')"
else
  echo "❌ Échec récupération vignettes"
fi
echo

# Test 5: Simulation chat (pour vérifier que les autres endpoints fonctionnent)
echo "🔍 TEST 5: Test chat (vérification complète)"
CHAT_RESPONSE=$(curl -s -H "X-Device-ID: $DEVICE_ID" -H "X-App-Version: $APP_VERSION" \
  -H "Content-Type: application/json" \
  -d '{"message": "Test intégration", "context": {"currentPhase": "menstrual", "persona": "emma"}}' \
  "$API_URL/api/chat")

CHAT_SUCCESS=$(echo "$CHAT_RESPONSE" | jq -r '.response != null')
if [ "$CHAT_SUCCESS" = "true" ]; then
  echo "✅ Chat fonctionne correctement"
else
  echo "❌ Problème avec le chat"
fi
echo

# Résumé final
echo "📋 === RÉSUMÉ INTÉGRATION ==="
echo "Insights: $([ "$INSIGHTS_SUCCESS" = "true" ] && echo "✅" || echo "❌")"
echo "Phases: $([ "$PHASES_SUCCESS" = "true" ] && echo "✅" || echo "❌")"
echo "Closings: $([ "$CLOSINGS_SUCCESS" = "true" ] && echo "✅" || echo "❌")"
echo "Vignettes: $([ "$VIGNETTES_SUCCESS" = "true" ] && echo "✅" || echo "❌")"
echo "Chat: $([ "$CHAT_SUCCESS" = "true" ] && echo "✅" || echo "❌")"
echo

if [ "$INSIGHTS_SUCCESS" = "true" ] && [ "$PHASES_SUCCESS" = "true" ] && [ "$CLOSINGS_SUCCESS" = "true" ] && [ "$VIGNETTES_SUCCESS" = "true" ]; then
  echo "🎉 INTÉGRATION RÉUSSIE - L'app mobile peut accéder à toutes les données !"
  echo "🚀 Prêt pour le déploiement"
else
  echo "⚠️ Certains endpoints ont des problèmes - Vérifiez les logs"
fi 