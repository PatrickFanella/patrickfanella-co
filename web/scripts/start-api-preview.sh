#!/usr/bin/env bash
set -euo pipefail

script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
api_dir=$(cd -- "${script_dir}/../../api" && pwd)
api_bin=$(mktemp /tmp/patrickfanella-api-preview.XXXXXX)

cleanup() {
  if [[ -n "${api_pid:-}" ]]; then
    kill "${api_pid}" 2>/dev/null || true
    wait "${api_pid}" 2>/dev/null || true
  fi
  rm -f -- "${api_bin}"
}
trap cleanup EXIT INT TERM

cd "${api_dir}"
go build -o "${api_bin}" ./cmd/server
CORS_ORIGIN="${CORS_ORIGIN:-http://localhost:4173}" "${api_bin}" &
api_pid=$!
wait "${api_pid}"
