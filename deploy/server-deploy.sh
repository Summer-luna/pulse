#!/usr/bin/env bash
set -Eeuo pipefail

release_id="${1:?release id is required}"
app_dir="${2:?app directory is required}"
frontend_origins="${3:?frontend origins are required}"
archive="$app_dir/releases/pulse-$release_id.tar.gz"
release_dir="$app_dir/releases/$release_id"
current_link="$app_dir/current"
previous_release=""

if [[ -L "$current_link" ]]; then
  previous_release="$(readlink -f "$current_link")"
fi

mkdir -p "$release_dir"
tar -xzf "$archive" -C "$release_dir"
test -f "$release_dir/backend/main.js"
test -f "$release_dir/frontend/index.html"
test -f "$app_dir/.env"

set -a
source "$app_dir/.env"
set +a

postgres_user="${POSTGRES_USER:-linear}"
postgres_db="${POSTGRES_DB:-linear}"
http_port="${HTTP_PORT:-80}"

start_services() {
  local active_release="$1"

  docker rm -f pulse-backend-1 >/dev/null 2>&1 || true
  docker run -d \
    --name pulse-backend-1 \
    --restart unless-stopped \
    --security-opt apparmor=unconfined \
    --network pulse_default \
    --network-alias backend \
    -e "DATABASE_URL=postgres://${postgres_user}:${POSTGRES_PASSWORD}@db:5432/${postgres_db}" \
    -e PORT=4000 \
    -e "FRONTEND_ORIGIN=$frontend_origins" \
    -e "JWT_SECRET=$JWT_SECRET" \
    -e "JWT_EXPIRES_IN=${JWT_EXPIRES_IN:-7d}" \
    -v pulse_uploads_data:/app/backend/uploads \
    -v "$active_release/backend:/app/backend/dist:ro" \
    pulse-backend >/dev/null

  docker rm -f pulse-frontend-1 >/dev/null 2>&1 || true
  docker run -d \
    --name pulse-frontend-1 \
    --restart unless-stopped \
    --security-opt apparmor=unconfined \
    --network pulse_default \
    --network-alias frontend \
    -p "$http_port:80" \
    -v "$active_release/frontend:/usr/share/nginx/html:ro" \
    pulse-frontend >/dev/null
}

ln -sfn "$release_dir" "$current_link.next"
mv -Tf "$current_link.next" "$current_link"

if ! start_services "$release_dir"; then
  if [[ -n "$previous_release" && -d "$previous_release" ]]; then
    ln -sfn "$previous_release" "$current_link"
    start_services "$previous_release"
  fi
  exit 1
fi

sleep 5
graphql_response="$(curl -fsS \
  -H 'Content-Type: application/json' \
  --data '{"query":"query { __typename }"}' \
  "http://127.0.0.1:${http_port}/graphql" || true)"

if [[ "$graphql_response" != *'"__typename":"Query"'* ]]; then
  echo 'Health check failed; rolling back.' >&2
  if [[ -n "$previous_release" && -d "$previous_release" ]]; then
    ln -sfn "$previous_release" "$current_link"
    start_services "$previous_release"
  fi
  exit 1
fi

find "$app_dir/releases" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' \
  | sort -rn \
  | tail -n +6 \
  | cut -d' ' -f2- \
  | xargs -r rm -rf
find "$app_dir/releases" -maxdepth 1 -type f -name 'pulse-*.tar.gz' -mtime +7 -delete

echo "Release $release_id is active."
