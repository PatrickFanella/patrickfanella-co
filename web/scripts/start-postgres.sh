#!/usr/bin/env bash
set -euo pipefail

script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
repo_dir=$(cd -- "${script_dir}/../.." && pwd)
# shellcheck source=docker-preview-lib.sh
source "${script_dir}/docker-preview-lib.sh"

if [[ -f "${repo_dir}/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "${repo_dir}/.env"
  set +a
fi

case "${1:-start}" in
  start) e2e_start_postgres "${repo_dir}" ;;
  stop) e2e_stop_postgres ;;
  *) echo "usage: $0 [start|stop]" >&2; exit 2 ;;
esac
