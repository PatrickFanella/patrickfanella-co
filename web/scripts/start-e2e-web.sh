#!/usr/bin/env bash
set -euo pipefail

script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
repo_dir=$(cd -- "${script_dir}/../.." && pwd)
# shellcheck source=docker-preview-lib.sh
source "${script_dir}/docker-preview-lib.sh"
container_name=$(e2e_name patrickfanella-portfolio-e2e-web)
image=patrickfanella-portfolio-e2e:${E2E_RUN_ID:-latest}

cleanup() {
  docker rm -f "${container_name}" >/dev/null 2>&1 || true
  if [[ -n "${E2E_RUN_ID:-}" ]]; then
    docker image rm "${image}" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT INT TERM

cd "${repo_dir}"
docker rm -f "${container_name}" >/dev/null 2>&1 || true
docker build \
  -f web/Dockerfile \
  --build-arg VITE_API_BASE_URL=http://localhost:8181 \
  -t "${image}" .
e2e_run_web "${container_name}" "${image}"
docker wait "${container_name}" >/dev/null
