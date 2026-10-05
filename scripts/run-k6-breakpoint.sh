#!/usr/bin/env bash

set -euo pipefail

if [[ -z "${BASE_URL:-}" ]]; then
  printf '%s\n' "BASE_URL wajib diisi untuk breakpoint test." >&2
  exit 1
fi

if [[ "${CONFIRM_PRODUCTION_BREAKPOINT:-}" != "I_UNDERSTAND_THIS_CAN_CAUSE_AN_OUTAGE" ]]; then
  printf '%s\n' "Breakpoint test dapat membuat target tidak tersedia dan menimbulkan biaya trafik." >&2
  printf '%s\n' "Set CONFIRM_PRODUCTION_BREAKPOINT=I_UNDERSTAND_THIS_CAN_CAUSE_AN_OUTAGE untuk melanjutkan." >&2
  exit 1
fi

printf '%s\n' "PERINGATAN: beban akan dinaikkan sampai threshold abort tercapai atau seluruh stage selesai."

K6_SCRIPT="tests/load/breakpoint.js" \
REPORT_PREFIX="breakpoint" \
bash scripts/run-k6.sh
