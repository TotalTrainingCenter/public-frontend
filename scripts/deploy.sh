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

# 서비스 중인 폴더에 바로 덮어쓰지 않는다(document#72 F-8).
# 예전에는 rsync --delete 로 서비스 폴더를 고쳐 썼다. 올리는 동안 index.html 과 assets 가 서로 다른 판이 되고,
# 이미 열린 탭이 나중에 불러오는 옛 조각(assets/*.js)이 지워져 화면이 깨졌다.
# 이제: 옆 폴더(.next)에 다 올린 뒤 → 옛 판의 assets 를 7일치 옮겨 담고 → 폴더 이름을 바꿔 한 번에 교체한다.
# 직전 판은 .prev 로 하나 남는다(되돌리기: .prev 와 서비스 폴더 이름을 맞바꾼다).
DEPLOY_NEXT="${DEPLOY_PATH%/}.next"
REMOTE="${DEPLOY_USER}@${DEPLOY_HOST}"
printf -v REMOTE_ARGS "%q %q" "${DEPLOY_PATH%/}" "$DEPLOY_NEXT"

echo "Preparing staging path: ${REMOTE}:${DEPLOY_NEXT}"
ssh "${SSH_ARGS[@]}" "$REMOTE" "bash -s -- ${REMOTE_ARGS}" <<'REMOTE_PREPARE'
set -euo pipefail
current="$1"; next="$2"
mkdir -p "$current"
rm -rf "$next"
mkdir -p "$next"
REMOTE_PREPARE

echo "Uploading ${LOCAL_BUILD_PATH}/ to ${REMOTE}:${DEPLOY_NEXT}/"
RSYNC_RSH="ssh"
for arg in "${RSYNC_SSH_ARGS[@]}"; do
  printf -v quoted_arg "%q" "$arg"
  RSYNC_RSH+=" ${quoted_arg}"
done

# 빈 폴더에 통째로 올린다(빌드 결과는 몇 MB 다). --link-dest 는 크기·시각만 같으면 옛 파일을 재사용해 쓰지 않는다.
rsync -az --delete -e "$RSYNC_RSH" \
  "${LOCAL_BUILD_PATH}/" \
  "${REMOTE}:${DEPLOY_NEXT}/"

echo "Switching ${DEPLOY_PATH} to the new build"
ssh "${SSH_ARGS[@]}" "$REMOTE" "bash -s -- ${REMOTE_ARGS}" <<'REMOTE_SWITCH'
set -euo pipefail
current="$1"; next="$2"; previous="${current}.prev"

# 열린 탭이 나중에 부를 옛 조각: 지금 판의 assets 중 새 판에 없는 것을 옮겨 담는다.
# 빌드 시각(rsync 가 유지)이 7일 안인 것만 — 판마다 쌓이지 않게.
if [ -d "$current/assets" ]; then
  (cd "$current" && find assets -type f -mtime -7) | while IFS= read -r file; do
    if [ ! -e "$next/$file" ]; then
      mkdir -p "$next/$(dirname "$file")"
      cp -p "$current/$file" "$next/$file"
    fi
  done
fi

rm -rf "$previous"
mv "$current" "$previous"
mv "$next" "$current"
REMOTE_SWITCH

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
