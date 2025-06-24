#!/bin/bash
# Tests validation Sprint 1

API_URL="http://localhost:4000"
ADMIN_PASSWORD="admin_secure_2025"

echo "=== TEST 1: Phase dynamique ==="
curl -s -X POST "$API_URL/chat" \
  -H "Content-Type: application/json" \
  -H "X-Device-ID: test-phase" \
  -d '{"message": "Comment gérer ma fatigue?", "context": {"currentPhase": "luteal", "persona": "emma"}}' | jq '.phase'

echo -e "\n=== TEST 2: Mémoire conversation ==="
# Premier message
RESPONSE1=$(curl -s -X POST "$API_URL/chat" \
  -H "Content-Type: application/json" \
  -H "X-Device-ID: test-memory" \
  -d '{"message": "J ai mal au ventre"}')
echo "Message 1:" $(echo $RESPONSE1 | jq -r '.response' | head -c 80)...

# Second avec historique
RESPONSE2=$(curl -s -X POST "$API_URL/chat" \
  -H "Content-Type: application/json" \
  -H "X-Device-ID: test-memory" \
  -d '{"message": "C est pire le matin"}')
echo "Message 2:" $(echo $RESPONSE2 | jq -r '.response' | head -c 80)...

echo -e "\n=== TEST 3: Admin Auth ==="
AUTH_RESPONSE=$(curl -s -X POST "$API_URL/admin/auth" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"admin\", \"password\":\"$ADMIN_PASSWORD\"}")
TOKEN=$(echo $AUTH_RESPONSE | jq -r '.token')
echo "Auth success:" $(echo $AUTH_RESPONSE | jq -r '.success')
echo "User role:" $(echo $AUTH_RESPONSE | jq -r '.user.role')

echo -e "\n=== TEST 3bis: Jeza Auth ==="
JEZA_AUTH=$(curl -s -X POST "$API_URL/admin/auth" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"jeza\", \"password\":\"jeza_content_2025\"}")
echo "Jeza auth:" $(echo $JEZA_AUTH | jq -r '.success')
echo "Jeza role:" $(echo $JEZA_AUTH | jq -r '.user.role')

echo -e "\n=== TEST 4: Budget status ==="
curl -s "$API_URL/admin/budget-status" \
  -H "Authorization: Bearer $TOKEN" | jq '.budgets.daily // .budget // .'

echo -e "\n=== TEST 5: Cache stats ==="
curl -s "$API_URL/admin/cache-stats" \
  -H "Authorization: Bearer $TOKEN" | jq '.devices.total // .activeConversations // .'

echo -e "\n=== TEST 6: Performance ==="
time curl -s -X POST "$API_URL/chat" \
  -H "Content-Type: application/json" \
  -H "X-Device-ID: test-perf" \
  -d '{"message": "Test performance"}' > /dev/null

echo -e "\n=== TEST 7: Cache stats ==="
curl -s "$API_URL/admin/cache-stats" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo -e "\n=== TEST 8: Budget status ==="
curl -s "$API_URL/admin/budget-status" \
  -H "Authorization: Bearer $TOKEN" | jq '.'