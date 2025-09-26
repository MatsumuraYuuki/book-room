class ApplicationController < ActionController::API
  # HTTPヘッダーからトークン情報を自動的に取得・検証。current_userメソッドなどが使用可能に 
  include DeviseTokenAuth::Concerns::SetUserByToken

  # ActionDispatch::Request::Session::DisabledSessionErrorの対策ファイル
  # rails/app/controllers/concerns/devise_hack_fake_session.rbに記載
  include DeviseHackFakeSession

  before_action :configure_permitted_parameters, if: :devise_controller?

  protected
  
    # Deviseのストロングパラメータを設定
    # devise_parameter_sanitizerは、deviseが提供するストロングパラメータの設定メソッド
    # :sign_upは、ユーザー登録時に許可するパラメータを指定
    # :sign_upでデフォルトで許可されているパラメータは、email、password、password_confirmation
    # keys: [:name]は、nameカラムを許可することを示す
    def configure_permitted_parameters
      devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
    end
end
