#!/usr/bin/env bash
# Shared helpers for the disposable containers used by browser tests and Lighthouse.
#
# Local runs publish container ports on the Docker host, as before.
#
# CI job containers talk to the Docker daemon through its socket, so a port
# published by a sibling container lands on the daemon host, not inside the job
# container. Setting E2E_DOCKER_NETWORK=container:<job container> makes each
# sibling container join the job container's network namespace instead, so the
# job reaches it on localhost without any published port. E2E_RUN_ID keeps
# container names and image tags unique when jobs share a daemon.

e2e_shared_network() {
  [[ -n "${E2E_DOCKER_NETWORK:-}" ]]
}

e2e_name() {
  local base=$1
  if [[ -n "${E2E_RUN_ID:-}" ]]; then
    printf '%s-%s\n' "${base}" "${E2E_RUN_ID}"
  else
    printf '%s\n' "${base}"
  fi
}

e2e_postgres_container() {
  e2e_name patrickfanella-portfolio-e2e-postgres
}

# Start the production Nginx image detached so it serves on port 4173.
e2e_run_web() {
  local container_name=$1 image=$2
  if e2e_shared_network; then
    docker run -d --rm --name "${container_name}" --network "${E2E_DOCKER_NETWORK}" "${image}" \
      sh -c "sed -i 's/listen 80;/listen 4173;/' /etc/nginx/conf.d/default.conf && grep -q 'listen 4173;' /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'" >/dev/null
  else
    docker run -d --rm --name "${container_name}" -p 4173:80 "${image}" >/dev/null
  fi
}

# Start PostgreSQL on 127.0.0.1:${POSTGRES_HOST_PORT:-5432} and wait until it accepts connections.
e2e_start_postgres() {
  local repo_dir=$1
  local user=${POSTGRES_USER:-postgres}
  local database=${POSTGRES_DB:-patrickfanella}

  if e2e_shared_network; then
    local container_name
    container_name=$(e2e_postgres_container)
    # Reuse a running database so a second start call (Playwright starts it
    # for the API, then again in global setup) keeps the existing connection.
    if [[ "$(docker inspect --format '{{.State.Running}}' "${container_name}" 2>/dev/null)" != true ]]; then
      docker rm -f "${container_name}" >/dev/null 2>&1 || true
      docker run -d --rm --name "${container_name}" --network "${E2E_DOCKER_NETWORK}" \
        -e POSTGRES_DB="${database}" \
        -e POSTGRES_USER="${user}" \
        -e POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-postgres}" \
        postgres:17-alpine -c "port=${POSTGRES_HOST_PORT:-5432}" >/dev/null
    fi
    for _ in {1..60}; do
      # Connect over TCP so the check passes only after the final server start,
      # not during the image's socket-only initialisation phase.
      if docker exec "${container_name}" pg_isready -h 127.0.0.1 -p "${POSTGRES_HOST_PORT:-5432}" -U "${user}" -d "${database}" >/dev/null 2>&1; then
        return 0
      fi
      sleep 1
    done
    echo "PostgreSQL container ${container_name} did not become ready" >&2
    docker logs "${container_name}" >&2 || true
    return 1
  fi

  (cd "${repo_dir}" && docker compose up -d postgres)
  for _ in {1..60}; do
    if (cd "${repo_dir}" && docker compose exec -T postgres pg_isready -U "${user}" -d "${database}") >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
  done
  echo "PostgreSQL did not become ready" >&2
  return 1
}

# Remove the CI-only PostgreSQL container. Local Compose databases are kept.
e2e_stop_postgres() {
  if e2e_shared_network; then
    docker rm -f "$(e2e_postgres_container)" >/dev/null 2>&1 || true
  fi
}
