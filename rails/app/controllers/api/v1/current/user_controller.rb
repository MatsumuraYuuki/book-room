class Api::V1::Current::UserController < Api::V1::BaseController
  before_action :authenticate_user! # ユーザーが認証済みであるか否かをbooleanで返す

  def show
    # CurrentUserSerializerにて id、name、email、image_urlカラムのみが、レスポンスボディーに含まれるようになる
    render json: current_user, serializer: CurrentUserSerializer
  end

  def update
    # パスワード変更がある場合は update_with_password を使用
    result = if password_change?
               current_user.update_with_password(user_params_with_password)
             else
               current_user.update(user_params)
             end

    if result
      render json: current_user, serializer: CurrentUserSerializer
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

    def password_change?
      params[:user][:password].present? || params[:user][:password_confirmation].present?
    end

    def user_params
      params.require(:user).permit(:name, :email, :image)
    end

    def user_params_with_password
      params.require(:user).permit(:name, :email, :image, :current_password, :password, :password_confirmation)
    end
end
