#!/bin/bash
set -e

# 環境変数をクリア（開発環境用）
unset BUNDLE_DEPLOYMENT
unset BUNDLE_WITHOUT

# bundle設定をクリア
bundle config unset deployment 2>/dev/null || true
bundle config unset without 2>/dev/null || true

rm -f /rails/tmp/pids/server.pid


exec "$@"