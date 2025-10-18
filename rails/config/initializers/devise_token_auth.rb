DeviseTokenAuth.setup do |config|
  # ログイントークンを毎回のリクエストで更新されないようにする。
  config.change_headers_on_each_request = false

  # ログイントークンの有効期限を2週間とする。
  config.token_lifespan = 2.weeks

  config.token_cost = Rails.env.test? ? 4 : 10
end
