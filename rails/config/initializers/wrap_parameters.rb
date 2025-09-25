# 「device_auth_tokenのログイン時にUnpermitted parameter: session」の記事で作成
# Unpermitted parameter: sessionのエラー解消のため作成
# Railsのparameter wrapping機能が原因だった
ActiveSupport.on_load(:action_controller) do
  wrap_parameters false
end
