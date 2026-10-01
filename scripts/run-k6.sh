#!/usr/bin/env bash

set -euo pipefail

if ! command -v k6 >/dev/null 2>&1; then
  printf '%s\n' "k6 belum terpasang. macOS: brew install k6" >&2
  printf '%s\n' "Panduan platform lain: https://grafana.com/docs/k6/latest/set-up/install-k6/" >&2
  exit 1
fi

BASE_URL="${BASE_URL:-http://localhost:3000}"
REPORT_DIR="${REPORT_DIR:-reports/k6}"
K6_SCRIPT="${K6_SCRIPT:-tests/load/all-pages.js}"
REPORT_PREFIX="${REPORT_PREFIX:-stress}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
REPORT_PATH="${REPORT_DIR}/${REPORT_PREFIX}-${TIMESTAMP}.html"
SUMMARY_PATH="${REPORT_DIR}/${REPORT_PREFIX}-${TIMESTAMP}.json"
LOG_PATH="${REPORT_DIR}/${REPORT_PREFIX}-${TIMESTAMP}.log"

mkdir -p "$REPORT_DIR"

if ! curl --fail --silent --show-error --output /dev/null "$BASE_URL"; then
  printf 'Aplikasi tidak dapat diakses di %s. Jalankan aplikasi terlebih dahulu.\n' "$BASE_URL" >&2
  exit 1
fi

printf 'Menjalankan stress test ke %s\n' "$BASE_URL"
printf 'Laporan HTML: %s\n' "$REPORT_PATH"
printf 'Log diagnostik: %s\n' "$LOG_PATH"

set +e
K6_WEB_DASHBOARD=true \
K6_WEB_DASHBOARD_OPEN=false \
K6_WEB_DASHBOARD_EXPORT="$REPORT_PATH" \
K6_WEB_DASHBOARD_PERIOD="${K6_WEB_DASHBOARD_PERIOD:-1s}" \
BASE_URL="$BASE_URL" \
k6 run --summary-export="$SUMMARY_PATH" "$K6_SCRIPT" 2>&1 | tee "$LOG_PATH"
K6_EXIT_STATUS="${PIPESTATUS[0]}"
set -e

if [[ ! -f "$REPORT_PATH" ]]; then
  printf '\nStress test selesai, tetapi laporan HTML tidak terbentuk. Periksa output k6 di atas.\n' >&2
  exit 1
fi

if (( K6_EXIT_STATUS != 0 )); then
  printf '\nStress test gagal dengan exit code %s. Periksa laporan dan log di atas.\n' "$K6_EXIT_STATUS" >&2
  exit "$K6_EXIT_STATUS"
fi

printf '\nStress test selesai. Buka laporan: %s\n' "$REPORT_PATH"
