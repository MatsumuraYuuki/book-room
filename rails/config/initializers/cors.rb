Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # rails/config/settings/に定義
    origins Settings.front_domain # フロントエンドのドメインからのアクセスを許可

    resource "*",
             headers: :any, # すべてのヘッダーを許可
             expose: ["access-token", "uid", "client"], # 重要: 認証情報をフロントエンドに公開
             methods: [:get, :post, :put, :patch, :delete, :options, :head] # 許可するHTTPメソッド
  end
end
