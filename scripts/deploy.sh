#!/usr/bin/env bash

set -Eeuo pipefail

REPOSITORY="${REPOSITORY:-avoocreator/sman1kraksaan-web}"
APP_HOME="${APP_HOME:-/home/app}"
RELEASES_DIR="${RELEASES_DIR:-$APP_HOME/releases}"
CURRENT_LINK="${CURRENT_LINK:-$APP_HOME/current}"
ENV_FILE="${ENV_FILE:-$APP_HOME/public_html/.env.production}"
APP_NAME="${APP_NAME:-sman1kraksaan}"
HOSTNAME="${HOSTNAME:-0.0.0.0}"
PORT="${PORT:-3000}"
HEALTHCHECK_URL="${HEALTHCHECK_URL:-http://127.0.0.1:$PORT/}"
DOWNLOAD_URL="https://github.com/$REPOSITORY/releases/download/deployment-latest"

for command in curl sha256sum tar pm2; do
  if ! command -v "$command" >/dev/null 2>&1; then
    echo "Required command not found: $command" >&2
    exit 1
  fi
done

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Environment file not found: $ENV_FILE" >&2
  exit 1
fi

mkdir -p "$RELEASES_DIR"

if command -v flock >/dev/null 2>&1; then
  exec 9>"$APP_HOME/.deploy.lock"
  if ! flock -n 9; then
    echo "Another deployment is already running." >&2
    exit 1
  fi
fi

temporary_dir="$(mktemp -d)"
release_id="$(date -u +%Y%m%d%H%M%S)"
release_dir="$RELEASES_DIR/$release_id"
previous_release="$(readlink -f "$CURRENT_LINK" 2>/dev/null || true)"

cleanup() {
  rm -rf "$temporary_dir"
}
trap cleanup EXIT

echo "Downloading deployment artifact..."
curl -fsSL --retry 3 \
  "$DOWNLOAD_URL/deployment.tar.gz" \
  -o "$temporary_dir/deployment.tar.gz"
curl -fsSL --retry 3 \
  "$DOWNLOAD_URL/deployment.tar.gz.sha256" \
  -o "$temporary_dir/deployment.tar.gz.sha256"

echo "Verifying artifact..."
(
  cd "$temporary_dir"
  sha256sum -c deployment.tar.gz.sha256
)

mkdir "$release_dir"
tar -xzf "$temporary_dir/deployment.tar.gz" -C "$release_dir"

if [[ ! -f "$release_dir/server.js" ]]; then
  echo "Invalid deployment: server.js is missing." >&2
  rm -rf "$release_dir"
  exit 1
fi

cp "$ENV_FILE" "$release_dir/.env.production"
chmod 600 "$release_dir/.env.production"

next_link="$APP_HOME/.current.$release_id"
ln -s "$release_dir" "$next_link"
mv -Tf "$next_link" "$CURRENT_LINK"

export HOSTNAME PORT NODE_ENV=production

restart_application() {
  if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
    pm2 restart "$APP_NAME" --update-env
  else
    pm2 start "$CURRENT_LINK/server.js" \
      --name "$APP_NAME" \
      --cwd "$CURRENT_LINK" \
      --time
  fi
}

healthy=false
if restart_application; then
  for _ in {1..30}; do
    if curl -fsS --max-time 3 "$HEALTHCHECK_URL" >/dev/null; then
      healthy=true
      break
    fi
    sleep 1
  done
fi

if [[ "$healthy" != true ]]; then
  echo "Health check failed; rolling back." >&2

  if [[ -n "$previous_release" && -d "$previous_release" ]]; then
    rollback_link="$APP_HOME/.current.rollback.$release_id"
    ln -s "$previous_release" "$rollback_link"
    mv -Tf "$rollback_link" "$CURRENT_LINK"
    pm2 restart "$APP_NAME" --update-env || true
  else
    pm2 delete "$APP_NAME" || true
  fi

  rm -rf "$release_dir"
  exit 1
fi

pm2 save
echo "Deployment active: $release_dir"
