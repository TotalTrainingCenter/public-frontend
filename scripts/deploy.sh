#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${DEPLOY_ENV_FILE:-${ROOT_DIR}/.deploy.env}"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

: "${DEPLOY_HOST:?DEPLOY_HOST is required. Create .deploy.env from deploy.env.example.}"
: "${DEPLOY_PATH:?DEPLOY_PATH is required. Create .deploy.env from deploy.env.example.}"

DEPLOY_USER="${DEPLOY_USER:-root}"
DEPLOY_PORT="${DEPLOY_PORT:-22}"
BUILD_DIR="${BUILD_DIR:-dist}"
LOCAL_BUILD_PATH="${ROOT_DIR}/${BUILD_DIR}"
VERSION_FILE="${VERSION_FILE:-${ROOT_DIR}/VERSION}"
NOTIFICATION_SCRIPT="${NOTIFICATION_SCRIPT:-${ROOT_DIR}/scripts/notification.sh}"

SSH_ARGS=(-p "$DEPLOY_PORT")
RSYNC_SSH_ARGS=(-p "$DEPLOY_PORT")

if [[ -n "${DEPLOY_KEY:-}" ]]; then
  SSH_ARGS+=(-i "$DEPLOY_KEY")
  RSYNC_SSH_ARGS+=(-i "$DEPLOY_KEY")
fi

if [[ "${DEPLOY_STRICT_HOST_KEY_CHECKING:-yes}" == "no" ]]; then
  SSH_ARGS+=(-o StrictHostKeyChecking=no)
  RSYNC_SSH_ARGS+=(-o StrictHostKeyChecking=no)
fi

cd "$ROOT_DIR"

echo "Building locally"
# ⚠️ total-frontend 와 달리 tiptap 서브모듈을 쓰지 않는다(에디터가 없다).
#    src/dependencies 가 없으므로 그쪽을 빌드하려 하면 set -e 때문에 즉시 죽는다.
#
# ⚠️ npm run build 는 fetch:content → vite build → prerender → sitemap 까지 포함한다.
#    fetch:content 가 공개 API(VITE_API_BASE_URL)를 호출하므로 백엔드가 먼저 떠 있어야 한다.
npm i && npm run build

if [[ ! -d "$LOCAL_BUILD_PATH" ]]; then
  echo "Build directory not found: ${LOCAL_BUILD_PATH}" >&2
  exit 1
fi

echo "Preparing remote deploy path: ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}"
ssh "${SSH_ARGS[@]}" "${DEPLOY_USER}@${DEPLOY_HOST}" "mkdir -p '${DEPLOY_PATH}'"

echo "Uploading ${LOCAL_BUILD_PATH}/ to ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/"
RSYNC_RSH="ssh"
for arg in "${RSYNC_SSH_ARGS[@]}"; do
  printf -v quoted_arg "%q" "$arg"
  RSYNC_RSH+=" ${quoted_arg}"
done

rsync -az --delete -e "$RSYNC_RSH" \
  "${LOCAL_BUILD_PATH}/" \
  "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/"

if [[ -f "$VERSION_FILE" ]]; then
  VERSION=$(cat "$VERSION_FILE")
  VERSION=$((VERSION + 1))
else
  VERSION=1
fi

echo "$VERSION" > "$VERSION_FILE"
echo "Deploy version updated: ${VERSION_FILE} -> ${VERSION}"

if [[ -x "$NOTIFICATION_SCRIPT" ]]; then
  "$NOTIFICATION_SCRIPT"
else
  echo "Notification script not executable or not found: ${NOTIFICATION_SCRIPT}" >&2
  exit 1
fi

echo "Deploy complete."
