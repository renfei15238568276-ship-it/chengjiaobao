#!/usr/bin/env sh
set -eu

BASE_URL="${1:-http://localhost:3000}"

echo "[1/3] Checking health endpoint..."
curl -fsS "$BASE_URL/api/health" && echo "\nOK"

echo "[2/3] Checking login page..."
curl -fsS "$BASE_URL/login" >/dev/null && echo "OK"

echo "[3/3] Checking homepage..."
curl -fsS "$BASE_URL/" >/dev/null && echo "OK"

echo "All basic checks passed for $BASE_URL"
