#!/usr/bin/env bash
# macOS Finder double-clickable deployment launcher
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
exec "$DIR/deploy.sh"

