#!/bin/bash
set -e

echo "Start entrypoint.prod.sh"

echo "rm -f /myapp/tmp/pids/server.pid"
rm -f /myapp/tmp/pids/server.pid

# 初回デプロイ時以外では実行したくないのでコメントアウト
# echo "bundle exec rails db:create RAILS_ENV=production"
# bundle exec rails db:create RAILS_ENV=production

echo "bundle exec rails db:migrate RAILS_ENV=production"
bundle exec rails db:migrate RAILS_ENV=production

# 青空文庫の作品データ群をCSVからインポート
echo "bundle exec rails aozora_books:import RAILS_ENV=production"
bundle exec rails aozora_books:import RAILS_ENV=production    

# 初回デプロイ時以外では実行したくないのでコメントアウト
# echo "bundle exec rails db:seed RAILS_ENV=production"
# bundle exec rails db:seed RAILS_ENV=production

echo "bundle exec puma -C config/puma.rb"
bundle exec puma -C config/puma.rb