#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env.local"

if [ ! -f "$ENV_FILE" ]; then
  echo ".env.local not found in project root. Create it with your Firebase keys first." >&2
  exit 2
fi

# shellcheck disable=SC1090
source "$ENV_FILE"

# Defaults - can be changed by exporting TEST_EMAIL/TEST_PASSWORD
TEST_EMAIL="${TEST_EMAIL:-test+dev@swiftbus.local}"
TEST_PASSWORD="${TEST_PASSWORD:-Test1234}"

API_KEY="${VITE_FIREBASE_API_KEY:-}"
PROJECT_ID="${VITE_FIREBASE_PROJECT_ID:-}"

if [ -z "$API_KEY" ] || [ -z "$PROJECT_ID" ]; then
  echo "VITE_FIREBASE_API_KEY or VITE_FIREBASE_PROJECT_ID missing in .env.local" >&2
  exit 3
fi

echo "Using Firebase project: $PROJECT_ID"

echo "Registering test user: $TEST_EMAIL"
SIGNUP_RESP=$(curl -s -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${TEST_EMAIL}\",\"password\":\"${TEST_PASSWORD}\",\"returnSecureToken\":true}")

echo "Signup response:"
echo "$SIGNUP_RESP" | python3 -m json.tool

ID_TOKEN=$(echo "$SIGNUP_RESP" | python3 -c 'import sys,json; print(json.load(sys.stdin).get("idToken",""))')
LOCAL_ID=$(echo "$SIGNUP_RESP" | python3 -c 'import sys,json; print(json.load(sys.stdin).get("localId",""))')

if [ -z "$ID_TOKEN" ] || [ -z "$LOCAL_ID" ]; then
  echo "Failed to register user. Response above." >&2
  exit 4
fi

echo "Registered user UID: $LOCAL_ID"

# Create a sample booking document
PNR="TESTPNR-$(date +%s)"
DATE_STR="$(date -I)"

read -r -d '' FIRESTORE_BODY <<EOF
{
  "fields": {
    "userId": {"stringValue": "$LOCAL_ID"},
    "pnr": {"stringValue": "$PNR"},
    "busId": {"stringValue": "bus-test-1"},
    "name": {"stringValue": "Test Bus"},
    "from": {"stringValue": "Dhaka"},
    "to": {"stringValue": "Chittagong"},
    "date": {"stringValue": "$DATE_STR"},
    "seats": {"arrayValue": {"values": [{"stringValue": "A1"}, {"stringValue":"A2"}]}},
    "seatCount": {"integerValue": "2"},
    "price": {"doubleValue": 1200},
    "passenger": {"mapValue": {"fields": {"name": {"stringValue": "Test Passenger"}, "phone": {"stringValue": "017XXXXXXXX"}, "email": {"stringValue": "$TEST_EMAIL"}}}},
    "createdAt": {"stringValue": "$(date -Is)"}
  }
}
EOF

echo "Creating Firestore booking document..."
CREATE_RESP=$(curl -s -X POST "https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/bookings" \
  -H "Authorization: Bearer ${ID_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "$FIRESTORE_BODY")

echo "Create response:"
echo "$CREATE_RESP" | python3 -m json.tool

DOC_NAME=$(echo "$CREATE_RESP" | python3 -c 'import sys,json; print(json.load(sys.stdin).get("name",""))')
if [ -z "$DOC_NAME" ]; then
  echo "Failed to create booking document. Response above." >&2
  exit 5
fi

echo "Created booking document: $DOC_NAME"

# Print cleanup hints
echo
echo "Test data created. To cleanup:"
echo "  1) Delete booking document:"
echo "     curl -X DELETE \"https://firestore.googleapis.com/v1/${DOC_NAME}\" -H \"Authorization: Bearer ${ID_TOKEN}\""
echo "  2) Delete test user (authenticated delete):"
echo "     curl -X POST \"https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${API_KEY}\" -H \"Content-Type: application/json\" -d '{\"idToken\": \"${ID_TOKEN}\"}'"

echo "Done."
