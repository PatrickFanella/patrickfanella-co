#!/usr/bin/env bash
set -euo pipefail

script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
repo_dir=$(cd -- "${script_dir}/../.." && pwd)
container_name=patrickfanella-portfolio-e2e-web
web_port=${E2E_WEB_PORT:-4173}
api_port=${E2E_API_PORT:-8181}

cleanup() {
  docker rm -f "${container_name}" >/dev/null 2>&1 || true
}
trap cleanup EXIT INT TERM

cd "${repo_dir}"
docker rm -f "${container_name}" >/dev/null 2>&1 || true
docker build \
  -f web/Dockerfile \
  --build-arg VITE_API_BASE_URL="http://localhost:${api_port}" \
  -t patrickfanella-portfolio-e2e .
docker run -d --rm --name "${container_name}" -p "${web_port}:80" patrickfanella-portfolio-e2e >/dev/null
docker wait "${container_name}" >/dev/null
