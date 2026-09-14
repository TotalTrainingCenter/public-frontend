#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${DEPLOY_ENV_FILE:-${ROOT_DIR}/.deploy.env}"

set -o allexport
# shellcheck disable=SC1090
source "$ENV_FILE"
set +o allexport

VERSION_FILE="${VERSION_FILE:-${ROOT_DIR}/VERSION}"

if [[ -f "$VERSION_FILE" ]]; then
  VERSION=$(cat "$VERSION_FILE")
else
  VERSION=1
fi

VERSION_STR=$(printf "%07d" "$VERSION")

text=$(cat <<EOF
🔨 <b>PUBLIC 프론트 프로그램 신규 릴리즈 버전</b>: $VERSION_STR
EOF
)

curl -s -X POST "https://api.telegram.org/bot${botToken}/sendMessage" \
  --data-urlencode "text=${text}" \
  -d chat_id="${groupId}" \
  -d message_thread_id="${gitNotiTopicId}" \
  -d parse_mode="HTML"
