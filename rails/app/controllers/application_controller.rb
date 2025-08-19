  class ApplicationController < ActionController::API
    include DeviseTokenAuth::Concerns::SetUserByToken
    include DeviseHackFakeSession

   before_action :configure_permitted_parameters, if: :devise_controller?

    # Deviseのストロングパラメータを設定
    # devise_parameter_sanitizerは、deviseが提供するストロングパラメータの設定メソッド
    # :sign_upは、ユーザー登録時に許可するパラメータを指定
    # keys: [:name]は、nameカラムを許可することを示す
   protected

   def configure_permitted_parameters
         devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
   end
  end