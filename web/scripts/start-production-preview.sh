#!/usr/bin/env bash
set -euo pipefail

script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
repo_dir=$(cd -- "${script_dir}/../.." && pwd)
# shellcheck source=docker-preview-lib.sh
source "${script_dir}/docker-preview-lib.sh"
container_name=$(e2e_name patrickfanella-portfolio-lighthouse-web)
image=patrickfanella-portfolio-lighthouse:${E2E_RUN_ID:-latest}
api_bin=$(mktemp /tmp/patrickfanella-api-lighthouse.XXXXXX)

cleanup() {
  if [[ -n "${api_pid:-}" ]]; then
    kill "${api_pid}" 2>/dev/null || true
    wait "${api_pid}" 2>/dev/null || true
  fi
  rm -f -- "${api_bin}"
  docker rm -f "${container_name}" >/dev/null 2>&1 || true
  e2e_stop_postgres
  if [[ -n "${E2E_RUN_ID:-}" ]]; then
    docker image rm "${image}" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT INT TERM

if [[ -f "${repo_dir}/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "${repo_dir}/.env"
  set +a
fi

e2e_start_postgres "${repo_dir}"

cd "${repo_dir}/api"
go run ./cmd/migrate
go run ./cmd/seed
go build -o "${api_bin}" ./cmd/server
CORS_ORIGIN=http://127.0.0.1:4173 "${api_bin}" &
api_pid=$!

cd "${repo_dir}"
docker build \
  -f web/Dockerfile \
  --build-arg VITE_API_BASE_URL=http://127.0.0.1:8181 \
  -t "${image}" .
docker rm -f "${container_name}" >/dev/null 2>&1 || true
e2e_run_web "${container_name}" "${image}"
for _ in {1..30}; do
  if curl --fail --silent http://127.0.0.1:4173/healthz >/dev/null; then
    echo "Portfolio preview ready"
    docker wait "${container_name}" >/dev/null
    exit 0
  fi
  sleep 1
done

echo "Portfolio preview failed to become ready" >&2
exit 1
